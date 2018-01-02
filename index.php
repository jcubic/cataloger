<?php

require_once('vendor/autoload.php');

class Cataloger {
    function __construct($lang = NULL) {
        header_remove("X-Powered-By");
        header("X-Frame-Options: Deny");
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
        if (!isset($this->config->session_name)) {
            $this->config->session_name= 'CSID';
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
        $this->twig->addFilter(new Twig_Filter('price', function($price) use ($app) {
            return new Twig_Markup(sprintf($app->config->price, $price), 'UTF-8');
        }));
        $this->twig->addFilter(new Twig_Filter('html', function($input) {
            return clean_html($input);
        }, array('is_safe' => array('html'))));
        require_once('Text.php');
        $this->twig->addExtension(new Twig_Extensions_Extension_Text());
        function menu($base, $items, $parent = "0") {
            $html = '';
            foreach ($items as $item) {
                if ($item['parent'] == $parent) {
                    $html .= '<li><a href="' . $base . '/category/' . $item['slug'] . '">' . $item['name'] . '</a>';
                    if ($item['children'] != 0) {
                        $html .= '<ul>' . menu($base, $items, $item['id']) . "</ul>";
                    }
                    $html .= "</li>";
                }
            }
            return $html;
        }
        $this->twig->addFunction(new Twig_Function('menu', function($base, $items) {
            return new Twig_Markup(menu($base, $items), 'UTF-8');
        }));
        $container['notFoundHandler'] = function ($c) use ($app) {
            return function ($request, $response) use ($c, $app) {
                return $app->error_page($request, $response, 404);
            };
        };
        $container['notAllowedHandler'] = function ($c) use ($app) {
            return function ($request, $response) use ($c, $app) {
                return $app->error_page($request, $response, 405);
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
                if ($this->config->debug) {
                    $data = array(
                        'error' => array(
                            'type' => $type,
                            'line' => $line,
                            'file' => $file,
                            'stack' => $stack,
                            'message' => $message
                        )
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
    function install($request, $response) {
        $update = file_exists($this->config_name);
        if (!$update) {
            $file = fopen($filename, 'w+');
            fwrite($file, json_encode(array(
                'username' => $_POST['username'],
                'password' => $_POST['password'],
                'template' => 'default',
                'debug' => false,
                'tidy' => true,
                'display_error_detail' => false,
                'default_locale' => 'en',
                'compress_html' => false,
                'secure' => false,
                'price' => '$%s',
                'session_timeout' => 86400
            )));
            fclose($file);
        }
        $tables_to_create = array_diff(required_tables(), tables());
        $alter_queries = get_alter_queries();
        if (count($tables_to_create)) {
            $re = "/CREATE TABLE IF NOT EXISTS (" . implode("|", $tables_to_create) . ")/";
            $queries = clean(explode(";", file_get_contents("sql/create-tables.sql")));
            foreach ($queries as $query) {
                if (preg_match($re, $query)) {
                    $this->query($query);
                }
            }
        }
        if (count($alter_queries)) {
            foreach ($alter_queries as $query) {
                $this->query($query);
            }
        }
        if (count($tables_to_create) || count($alter_queries)) {
            $response->getBody()->write(render($request, 'install.html', array(
                'completed' => true,
                'update' => $update
            )));
        }
        return $response;
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
        if ($this->config->compress_html) {
            if ($this->config->tidy) {
                $html = tidy($html, array('wrap' => -1, 'indent' => false));
            }
            $html = compress($html);
        } elseif ($this->config->tidy) {
            $html = tidy($html, (array)$this->config->tidy_options);
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
    function error_page($request, $response, $code) {
        $uri = $request->getUri();
        $page = $this->render($request, "$code.html", array(
            'page' => "/" . $uri->getPath()
        ));
        return $response->withStatus($code)
                        ->withHeader('Content-Type', 'text/html')
                        ->write($page);
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


if ($app->config->debug) {
    error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE);
    ini_set('display_errors', 'On');
}

$app->add(function($request, $response, $next) use ($app) {
    $uri = $request->getUri();
    $path = $uri->getPath();
    if (!installed() && !preg_match("/install/", $path)) {
        return redirect($request, $response, "/install");
    }
    $login = preg_match("/^login/", $path);
    if (preg_match("/^(admin|api|login|logout|upload)/", $path)) {
        if ($login && !isset($_GET['logout']) || !$login) {
            session_timeout($app->config->session_timeout);
            session_name($app->config->session_name);
            ini_set('session.cookie_httponly', 1);
            ini_set('session.use_only_cookies', 1);
            if ($app->config->secure) {
                $timeout = $app->config->session_timeout;
                header('Strict-Transport-Security: max-age=' . $timeout);
                if (strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') ||
                    preg_match("/rv:[0-9.]+\)/", $_SERVER['HTTP_USER_AGENT'])) {
                }
                if ($uri->getScheme() != "https") {
                    return redirect($request, $response, $uri->withScheme('https'));
                }
                ini_set('session.cookie_secure', 1);
            }
            session_start();
        }
    }
    if (preg_match("/api/", $path)) {
        $response = $response->withAddedHeader('Content-Type', 'application/json');
        if (!$request->isGet()) {
            if (!isset($_SESSION['logged'])) {
                $response = $response->withJson(array(
                    "error" => "You need to be logged in to use this method"
                ), 403);
            } else {
                /* TODO: update api to use json to prevent CSRF
                $headers = $request->getHeaders();
                $type = $request->getHeader('Content-type');
                if ($type != "application/json") {
                    $response = $response->withJson(array(
                        "error" => "Wrong Content-Type only application/json accepted"
                    ), 403);
                }
                */
            }
        }
    }
    return $next($request, $response);
});


$app->get('/', function($request, $response) {
    $response->getBody()->write(render($request, 'index.html'));
    return $response;
});

$app->any('/login', function($request, $response, $args) use ($app) {
    if (isset($_SESSION['logged'])) {
        return redirect($request, $response, '/admin');
    }
    textdomain("admin");
    $body = $response->getBody();
    if (isset($_POST['username']) && isset($_POST['password'])) {
        if ($app->config->login_timeout > 0) {
            $ip = ip2long($_SERVER['REMOTE_ADDR']);
            $attempts = query("SELECT * FROM login_attempts WHERE ip = ?", array($ip));
            if (count($attempts) > 0 && $attempts[0]['attempts'] > 3) {
                $power = $attempts[0]['attempts'] - 3;
                $time = pow($app->config->login_timeout, $power);
                if (time() - $attempts[0]['time'] < $time) {
                    log_login_attempt($attempts[0]['attempts']);
                    $body->write(render($request, 'login.html', array(
                        'error' => sprintf(_('%d attempts, you need to wait %d seconds'), $attempts[0]['attempts'], $time)
                    )));
                    return $response;
                }
            }
            if ($_POST['username'] != $app->config->username ||
                $_POST['password'] != $app->config->password) {
                if (count($attempts) > 0) {
                    $query = "UPDATE login_attempts SET attempts = ?, time = ? WHERE ip = ?";
                    query($query, array($attempts[0]['attempts'] + 1, time(), $ip));
                    log_login_attempt($attempts[0]['attempts']);
                } else {
                    $query = "INSERT INTO login_attempts(ip, attempts, time) VALUES(?, ?, ?)";
                    query($query, array($ip, 1, time()));
                    log_login_attempt(1);
                }
                $page = render($request, 'login.html', array(
                    'error' => _('Wrong username or password')
                ));
            } else {
                $_SESSION['logged'] = true;
                if (count($attempts) > 0) {
                    query("DELETE FROM login_attempts WHERE ip = ?", array($ip));
                }
                return redirect($request, $response, '/admin');
            }
        } else {
            if ($_POST['username'] != $app->config->username ||
                $_POST['password'] != $app->config->password) {
                $page = render($request, 'login.html', array(
                    'error' => _('Wrong username or password')
                ));
            } else {
                $_SESSION['logged'] = true;
                return redirect($request, $response, '/admin');
            }
        }
    } else {
        $page = render($request, 'login.html');
    }
    if ($page) {
        $body->write($page);
    }
    return $response;
});

$app->get('/logout', function($request, $response) use ($app) {
    unset($_SESSION['logged']);
    kill_session();
    return redirect($request, $response, '/login?logout=true');
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

load_plugins();

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
    if ($request->isPost()) {
        return $app->install($request, $response);
    } elseif (installed()) {
        $body->write(render($request, 'install.html', array(
            'completed' => true
        )));
    } else {
        $body->write(render($request, 'install.html', array(
            'update' => file_exists($app->config_name)
        )));
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

function id($table, $slug) {
    $rows = query("SELECT id FROM $table WHERE slug = ?", array($slug));
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
        if (id('pages', $slug) != null) {
            $body->write(json_encode(array("result" => false, "error" => "slug exists")));
        } else {
            $result = query("INSERT INTO pages(slug, title, content) VALUES(?, ?, ?)", array(
                $slug,
                $_POST['title'],
                $_POST['content']
            ));
            if ($result == 1) {
                $id = id('pages', $slug);
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
function make_delete_entry($table) {
    return function($request, $response) use ($table) {
        $id = $request->getAttribute('id');
        $body = $response->getBody();
        if (is_numeric($id)) {
            $result = query("DELETE FROM $table WHERE id = ?", array($id));
            if ($result == 0) {
                $body->write('{"result": false}');
            } else {
                $body->write('{"result": true}');
            }
        } else {
            $body->write('{"result": false}');
        }
        return $response;
    };
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
        $this->delete('/{id}', make_delete_entry("pages"));
        $this->get('/list', make_query_result("SELECT * FROM pages"));
    });

    $this->group('/product', function() {
        $this->post('/', function($request, $response) {
            $body = $response->getBody();
            if (isset($_POST['name'])) {
                $name = $_POST['name'];
                $slug = slug($name);
                $content = isset($_POST['content']) ? $_POST['content'] : null;
                if (isset($_POST['category'])) {
                    $category = intval($_POST['category']);
                } else {
                    $category = null;
                }
                $price = isset($_POST['price']) ? $_POST['price'] : null;
                $image_name = isset($_POST['image_name']) ? $_POST['image_name'] : null;
                $data = array($name, $category, $content, $slug, $price, $image_name);
                if (isset($_POST['id'])) {
                    $data[] = $_POST['id'];
                    $query = "UPDATE products SET name = ?, category = ?, content = ?, slug = ?, price = ?, image_name = ? WHERE id = ?";
                } else {
                    $query = "INSERT INTO products(name, category, content, slug, price, image_name) VALUES (?, ?, ?, ?, ?, ?)";
                }
                $result = query($query, $data);
                if ($result == 1) {
                    $id = id('products', $slug);
                    // TODO: remove query
                    $body->write(json_encode(
                        array(
                            'result' => array(
                                $id,
                                $slug,
                                query("SELECT id FROM products WHERE slug = ?", array($slug))
                            )
                        )
                    ));
                } else {
                    $body->write(json_encode(array(
                        "result" => false,
                        "data" => $result
                    )));
                }
            } else {
                $body->write(json_encode(array(
                    "result" => false,
                    "error" => "Wrong request"
                )));
            }
        });
        $this->delete('/{id}', make_delete_entry("products"));
        $this->get('/list', make_query_result("SELECT * FROM products"));
    });

    $this->group('/category', function() {
        $this->post('/', function($request, $response) {
            $body = $response->getBody();
            if (isset($_POST['name'])) {
                $name = $_POST['name'];
                $slug = slug($name);
                $content = isset($_POST['content']) ? $_POST['content'] : null;
                $parent = isset($_POST['parent']) ? intval($_POST['parent']) : null;
                $data = array($name, $parent, $content, $slug);
                if (isset($_POST['id'])) {
                    $data[] = $_POST['id'];
                    $query = "UPDATE categories SET name = ?, parent = ?, content = ?, slug = ? WHERE id = ?";
                } else {
                    $query = "INSERT INTO categories(name, parent, content, slug) VALUES (?, ?, ?, ?)";
                }
                $result = query($query, $data);
                if ($result == 1) {
                    $id = id('categories', $slug);
                    // TODO: remove query
                    $body->write(json_encode(
                        array(
                            'result' => array(
                                $id,
                                $slug,
                                query("SELECT id FROM pages WHERE slug = ?", array($slug))
                            )
                        )
                    ));
                } else {
                    $body->write(json_encode(array(
                        "result" => false,
                        "data" => $result
                    )));
                }
            }
            return $response;
        });
        $this->delete('/{id}', make_delete_entry("categories"));
        $this->get('/list', make_query_result("SELECT * FROM categories"));
    });
    $this->get('/images', function($request, $response) {
        $body = $response->getBody();
        $dir = opendir("uploads");
        $files = array();
        if ($dir) {
            while (($file = readdir($dir)) !== false) {
                if (is_image($file)) {
                    $files[] = $file;
                }
            }
        }
        return $body->write(json_encode($files));
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

function get_all_subcategories($category_id) {
    global $app;
    $data = query("SELECT id FROM categories WHERE parent = ?");
}


$app->get('/category/{slug}', function($request, $response, $args) {
    $body = $response->getBody();
    $data = query("SELECT * FROM categories WHERE slug = ?", array($args['slug']));
    if (count($data) == 1) {
        $data = $data[0];
        $id = $data['id'];
        $sub = query("select * from categories a where parent == ?", array($id));
        $products = query("select * from products WHERE category = ?", array($id));
        $body->write(render($request, 'category.html', array(
            'description' => $data['content'],
            'sub_categories' => $sub,
            'products' => $products,
            'title' => $data['name'],
            'bread_crumbs' =>  bread_crumbs($data)
        )));
    } else {
        throw new \Slim\Exception\NotFoundException($request, $response);
    }
    return $response;
});

$app->get('/product/{slug}', function($request, $response, $args) {
    $body = $response->getBody();
    $data = query("SELECT * FROM products WHERE slug = ?", array($args['slug']));
    if (count($data) == 1) {
        $data = $data[0];
        if ($data['category'] != 0) {
            $category = query("SELECT * FROM categories WHERE id = ?", array($data['id']));
            if (count($category) == 1) {
                $category = $category[0];
            } else {
                $category = array();
            }
        } else {
            $category = array();
        }
        $body->write(render($request, 'product.html', array(
            'description' => $data['content'],
            'image' => $data['image_name'],
            'price' => $data['price'],
            'slug' => $data['slug'],
            'title' => $data['name'],
            'category' => $category,
            'bread_crumbs' => bread_crumbs($category)
        )));
    } else {
        throw new \Slim\Exception\NotFoundException($request, $response);
    }
    return $response;
});

$app->get('/image/{size}/{name}', function($request, $response) {
    $body = $response->getBody();

    $size = $request->getAttribute('size');
    $name = $request->getAttribute('name');
    $fname = "uploads/$name";
    if (!file_exists($fname)) {
        $fname = missing_image_path();
    }
    $ext = pathinfo($fname, PATHINFO_EXTENSION);
    if ($ext == 'jpeg' || $ext == 'jpg') {
        $response = $response->withAddedHeader("Content-Type", "image/jpeg");
    } else if ($ext == 'png') {
        $response = $response->withAddedHeader("Content-Type", "image/png");
    } else if ($ext == 'gif') {
        $response = $response->withAddedHeader("Content-Type", "image/gif");
    } else {
        throw new \Slim\Exception\NotFoundException($request, $response);
    }
    $tmp_fname = tempnam("/tmp", "image");
    resize($fname, $size, $tmp_fname);
    $body->write(file_get_contents($tmp_fname));
    unlink($tmp_fname);
    return $response;
});

$app->post('/upload', function($request, $response) use ($app) {
    if ($_SESSION['logged']) {
        $files = $request->getUploadedFiles();
        if (isset($files['file'])) {
            $body = $response->getBody();
            $file = $files['file'];
            $path = $app->root . DIRECTORY_SEPARATOR . "uploads" . DIRECTORY_SEPARATOR;
            $fname = $file->getClientFilename();
            if (is_image($fname) && !preg_match("/\.\./", $fname)) {
                // just in case if someone try to upload php file with embeded php code
                if (!preg_match("/<\?.*?(?!\?" . ">)>/", file_get_conents($fname))) {
                    $file->moveTo($path . $fname);
                    $body->write(json_encode(array("result" => true)));
                }
            }
        }
        $body->write(json_encode(array("result" => false)));
    } else {
        return redirect($request, $response, '/login');
    }
});



$app->run();
