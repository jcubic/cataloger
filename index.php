<?php

error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE);
ini_set('display_errors', 'On');

require_once('vendor/autoload.php');

class Cataloger {
    function __construct($lang = NULL) {
        $this->db = new PDO('sqlite:cataloger.sqlite');
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->config_name = 'config.json';
        if (file_exists($this->config_name)) {
            $this->config = json_decode(file_get_contents($this->config_name));
            if (!isset($this->config->session_timeout)) {
                $this->config->session_timeout = 3600; // one hour
            }
        } else {
            $this->config = null;
        }
        $this->root = __DIR__ . DIRECTORY_SEPARATOR;
        $templates_dir = $this->root . 'templates' . DIRECTORY_SEPARATOR;
        if (!$lang) {
            $lang = $this->config->default_locale;
        }
        $this->config->locale = $lang;
        if (!preg_match("/utf-?8$/", $lang)) {
            $lang .= ".utf8";
        }
        if (isset($this->config->template) && $this->config->template != 'default') {
            $template = array(
                $templates_dir . $this->config->template,
                $templates_dir . 'default'
            );
        } else {
            $template = $templates_dir . 'default';
        }
        /*
           $twig = new Twig_Environment($loader, array(
           'cache' =>  $root . 'cache',
           ));
         */
        $this->loader = new Twig_Loader_Filesystem($template);
        $this->twig = new Twig_Environment($this->loader);
        putenv("LC_ALL=$lang");
        setlocale(LC_ALL, $lang);
        load_gettext_domains($this->root . "locale", $lang);
        $this->twig->addFunction(new Twig_Function('_', function($text) {
            return _($text);
        }));
        // slim
        $container = new \Slim\Container;
        $app = $this;
        $container['notFoundHandler'] = function ($c) use ($app) {
            return function ($request, $response) use ($c, $app) {
                $uri = $request->getUri();
                $page = $app->render($request, '404.html', array(
                    'page' => "/" . $uri->getPath()
                ));
                return $c['response']->withStatus(404)
                                     ->withHeader('Content-Type', 'text/html')
                                     ->write($page);
            };
        };
        $container['errorHandler'] = $container['phpErrorHandler'] = function ($c) use ($app) {
            return function($request, $response, $exception) use ($c, $app) {
                global $config;
                $stack = $exception->getTraceAsString();
                $message = $exception->getMessage();
                $type = get_class($exception);
                $line = $exception->getLine();
                $file = $exception->getFile();
                log_error("error 500 " . request_url($request));
                log_error($type . ": " . $message . " at " . $file . " in line " . $line);
                log_error($stack);
                if ($this->config->display_error_detail) {
                    $data = array(
                        'type' => $type,
                        'line' => $line,
                        'file' => $file,
                        'stack' => $stack,
                        'message' => $message
                    );
                } else {
                    $data = array();
                }
                $page = $app->render($request, '500.html', $data);
                return $c['response']->withStatus(500)
                                     ->withHeader('Content-Type', 'text/html')
                                     ->write($page);
            };
        };
        $container['settings']['displayErrorDetails'] = true;
        $this->app = new \Slim\App($container);
    }
    function save_config() {
        if (file_exists($this->config_name)) {
            //unlink($this->config_name);
        }
        write($this->config_name, json_encode($this->config));
    }
    function install() {
        $filename = 'config.json';
        if (!file_exists($filename)) {
            $file = fopen($filename, 'w+');
            fwrite($file, json_encode(array(
                'username' => $_POST['username'],
                'password' => $_POST['password'],
                'template' => 'default',
                'display_error_detail' => false
            )));
            fclose($file);
        }
        $tables_to_create = array_diff(required_tables(), tables());
        if (count($tables_to_create)) {
            $re = "/CREATE TABLE IF NOT EXISTS (" . implode("|", $tables_to_create) . ")/";
            $queries = clean(explode(";", file_get_contents("sql/create-tables.sql")));
            foreach ($queries as $query) {
                if (preg_match($re, $query)) {
                    $this->query($query);
                }
            }
            $body->write(render($request, 'install.html', array(
                'completed' => true
            )));
        }
    }
    function render($request, $page, $data = array()) {
        $base = baseURI($request);
        $path = preg_replace(
            "%" . __DIR__ . "%",
            "",
            $this->loader->getSourceContext($page)->getPath()
        );
        $path = preg_replace('%/' . $page . '$%', '', $path);
        try {
            $pages = query("SELECT slug, title FROM pages");
        } catch (Exception $e) {
            $pages = array();
        }
        try {
            $categories = query("select a.id, a.name, a.slug, a.parent, (select count(*) " .
                                "from categories b where a.id = b.parent) as children " .
                                "from categories a");
        } catch (Exception $e) {
            $categories = array();
        }
        $html = $this->twig->render($page, array_merge(array(
            "path" => $base . $path,
            "root" => $base,
            "now" => date("Y-m-d H:i:s"),
            "pages" => $pages,
            "categories" => $categories
        ), $data));
        if ($this->config->tidy) {
            return tidy($html);
        }
        return $html;
    }
    function query($query, $data = null) {
        if ($data == null) {
            $res = $this->db->query($query);
        } else {
            $res = $this->db->prepare($query);
            if ($res) {
                if (!$res->execute($data)) {
                    throw Exception("execute query failed");
                }
            } else {
                throw Exception("wrong query");
            }
        }
        if ($res) {
            if (preg_match("/^\s*INSERT|UPDATE|DELETE|ALTER|CREATE|DROP/i", $query)) {
                return $res->rowCount();
            } else {
                return $res->fetchAll(PDO::FETCH_ASSOC);
            }
        } else {
            throw new Exception("Coudn't open file");
        }
    }
    function __call($name, $args) {
        return call_user_func_array(array($this->app, $name), $args);
    }
}

require_once("utils.php");

if (isset($_GET['lang'])) {
    $lang = $_GET['lang'];
} else {
    $lang = NULL;
}

$app = new Cataloger($lang);

$app->add(function($request, $response, $next) use ($app) {
    $uri = $request->getUri();
    $path = $uri->getPath();
    if (!installed() && !preg_match("/install/", $path)) {
        return redirect($request, $response, "/install");
    }
    if (preg_match("/^(admin|api|login|logout)/", $path)) {
        session_timeout($app->config->session_timeout);
        session_start();
    }
    if (preg_match("/api/", $path)) {
        $response = $response->withAddedHeader('Content-Type', 'application/json');
        if (!$request->isGet() && !isset($_SESSION['logged'])) {
            $response = $response->withJson(array(
                "error" => "You need to be logged in to use this method"
            ), 403);
        }
    }
    return $next($request, $response);
});


$app->get('/', function($request, $response) {
    $response->getBody()->write(render($request, 'index.html'));
    return $response;
});

$app->any('/login', function($request, $response, $args) use ($app) {
    textdomain("admin");
    $body = $response->getBody();
    if (isset($_POST['username']) && isset($_POST['password'])) {
        if ($_POST['username'] != $app->config->username) {
            $page = render($request, 'login.html', array(
                'error' => 'Wrong username'
            ));
        } elseif ($_POST['password'] != $app->config->password) {
            $page = render($request, 'login.html', array(
                'error' => 'Wrong password'
            ));
        } else {
            $_SESSION['logged'] = true;
            return redirect($request, $response, '/admin');
        }
    } else {
        $page = render($request, 'login.html');
    }
    if ($page) {
        $body->write($page);
    }
    return $response;
});

$app->get('/logout', function($request, $response) {
    unset($_SESSION['logged']);
    session_destroy();
    return redirect($request, $response, '/login');
});


$components = array();

function register_admin_plugin($name, $component) {
    global $components;

    $components[] = array(
        'name' => $name,
        'file' => "/plugins/$name/$component.component.js",
        'component' => strtolower(preg_replace("/([A-Z])/", "-$1", $component))
    );
}

register_admin_plugin('sitemap', 'panelSitemap');

$app->get('/products', function($request, $response) {

});


$app->get('/admin', function($request, $response) {
    global $components;
    textdomain("admin");
    if (isset($_SESSION['logged']) && $_SESSION['logged']) {
        $response->getBody()->write(render($request, 'admin.html', array(
            'components' => $components
        )));
    } else {
        return redirect($request, $response, '/login');
    }
    return $response;
});



$app->any('/install', function($request, $response) use($app) {
    $body = $response->getBody();
    if (isset($_POST['username']) && isset($_POST['password'])) {
        $app->install();
    } elseif (installed()) {
        $body->write(render($request, 'install.html', array(
            'completed' => true
        )));
    } else {
        $body->write(render($request, 'install.html'));
    }
    return $response;
});


function make_query_result($query) {
    return function($request, $response) use ($query) {
        $body = $response->getBody();
        $body->write(json_encode(query($query)));
        return $response;
    };
}

function make_new_entry($table, $keys) {
    return function($request, $response) use ($table, $keys) {
        foreach ($keys as $key) {
            if (!isset($_POST[$key])) {
                $body->write('{"result": false, "error": "$key don\'t exists"}');
                return $response;
            }
        }
        $query = "INSERT INTO $table(" . implode(", ", $keys) . ") VALUES(" .
                 implode(", ", array_map(function($key) {
                     return "?";
                 }, $keys)) . ")";
        $data = array_map(function($key) {
            return $_POST[$key];
        }, $keys);
        $body->write(json_encode(array("result" => query($query, $data) == 1)));
    };
}

function convert($string) {
    if (is_numeric($string)) {
        return $string + 0;
    } else {
        return $string;
    }
}

function page_id($slug) {
    if ($d == null) {
        $rows = query("SELECT id FROM pages WHERE slug = ?", array($slug));
    }
    if (count($rows) == 1) {
        return $rows[0]['id'];
    } else {
        return null;
    }
}

function new_page($request, $response) {
    $body = $response->getBody();
    if (isset($_POST['title']) && isset($_POST['content'])) {
        $slug = slug($_POST['title']);
        if (page_id($slug) != null) {
            $body->write(json_encode(array("result" => false, "error" => "slug exists")));
        } else {
            $result = query("INSERT INTO pages(slug, title, content) VALUES(?, ?, ?)", array(
                $slug,
                $_POST['title'],
                $_POST['content']
            ));
            if ($result == 1) {
                $id = page_id($slug);
                $body->write(json_encode(array(
                    'result' => array($id, $slug, query("SELECT id FROM pages WHERE slug = ?", array($slug)))
                )));
            } else {
                $body->write('{"result": false}');
            }
        }
    } else {
        $body->write('{"result": false}');
    }
}
function update_page($request, $response) {
    $body = $response->getBody();
    if (isset($_POST['title']) && isset($_POST['content']) && isset($_POST['id'])) {
        $slug = slug($_POST['title']);
        $rows = query("SELECT id FROM pages WHERE slug = ? AND id <> ?", array($slug, $_POST['id']));
        if (count($rows) != 0) {
            $body->write(json_encode(array("result" => false, "error" => "slug exists")));
        } else {
            $result = query("UPDATE pages SET slug = ?, title = ?, content = ? WHERE id = ?", array(
                $slug,
                $_POST['title'],
                $_POST['content'],
                $_POST["id"]
            ));
            if ($result == 1) {
                $body->write('{"result": true}');
            } else {
                $body->write('{"result": false}');
            }
        }
    } else {
        $body->write('{"result": false}');
    }
}

$app->group('/api', function() {
    $this->get('/config', function($request, $response) {
        global $app;
        $config = clone $app->config;
        unset($config->password);
        $body = $response->getBody();
        $body->write(json_encode($config));
        return $response;
    });
    $this->post('/config', function($request, $response) {
        $body = $response->getBody();
        if (isset($_POST['name']) && isset($_POST['value'])) {
            $name = $_POST['name'];
            $app->config->$name = convert($_POST['value']);
            if ($app->save_config() == FALSE) {
                $result = array('error' => 'save fail', 'success' => false);
            } else {
                $result = array('error' => null, 'success' => true);
            }
        } else {
            $result = array('error' => 'POST variables not set', 'success' => false);
        }
        return $body->write(json_encode($result));
    });
    $this->post('/password', function($request, $response) {
        global $app;
        $body = $response->getBody();
        if (isset($_POST['new']) && isset($_POST['old'])) {
            if ($_POST['old'] != $app->config->password) {
                $result = array('error' => "password don't match", 'success' => false);
            } else {
                $app->config->password = $_POST['new'];
                if ($app->save_config() == FALSE) {
                    $result = array('error' => 'save fail', 'success' => false);
                } else {
                    $result = array('error' => null, 'success' => true);
                }
            }
        } else {
            $result = array('error' => 'POST variables not set', 'success' => false);
        }
        return $body->write(json_encode($result));
    });
    $this->group('/page', function() {
        $this->post('/', function($request, $response) {
            if (isset($_POST['id'])) {
                update_page($request, $response);
            } else {
                new_page($request, $response);
            }
            return $response;
        });
        $this->delete('/{id}', function($request, $response) {
            $id = $request->getAttribute('id');
            $body = $response->getBody();
            if (is_numeric($id)) {
                $result = query("DELETE FROM pages WHERE id = ?", array($id));
                if ($result == 0) {
                    $body->write('{"result": false}');
                } else {
                    $body->write('{"result": true}');
                }
            } else {
                $body->write('{"result": false}');
            }
            return $response;
        });
        $this->get('/list', make_query_result("SELECT * FROM pages"));
    });

    $this->group('/product', function() {
        $this->post('/new', make_new_entry("products", array(
            "name",
            "price",
            "category"
        )));
        $this->get('/list', make_query_result("SELECT * FROM products"));
    });

    $this->group('/category', function() {
        $this->post('/new', function($request, $response) {
            $body = $response->getBody();
            if (isset($_POST['name'])) {
                $name = $_POST['name'];
                $content = isset($_POST['content']) ? $_POST['content'] : null;
                $parent = isset($_POST['parent']) ? intval($_POST['parent']) : null;
                $query = "INSERT INTO categories(name, parent, content) VALUES (?, ?, ?)";
                if (query($query, array($name, $parent, $content)) == 1) {
                    $body->write('true');
                } else {
                    $body->write('false');
                }
            } else {
                $body->write('false');
            }
            return $response;
        });
        $this->get('/list', make_query_result("SELECT * FROM categories"));
    });
});

$app->get('/page/{slug}', function($request, $response, $args) {
    $body = $response->getBody();
    $data = query("SELECT * FROM pages WHERE slug = ?", array($args['slug']));
    if (count($data) == 1) {
        $data = $data[0];
        $body->write(render($request, 'page.html', array(
            'body' => $data['content'],
            'title' => $data['title']
        )));
    } else {
        throw new \Slim\Exception\NotFoundException($request, $response);
    }
    return $response;
});
//$files = $request->getUploadedFiles();
//$files[0]->moveTo($targetPath);

$app->run();
