<?php

function slug($title, $replace=array(), $delimiter='-') {
    setlocale(LC_ALL, 'en_US.UTF8');
    if (!empty($replace)) {
        $str = str_replace((array)$replace, ' ', $title);
    }
    $clean = iconv('UTF-8', 'ASCII//TRANSLIT', $title);
    $clean = preg_replace("/[^a-zA-Z0-9\/_|+ -]/", '', $clean);
    $clean = strtolower(trim($clean, '-'));
    $clean = preg_replace("/[\/_|+ -]+/", $delimiter, $clean);
    return $clean;
}

function baseURI($request) {
    $uri = $request->getUri();
    return $uri->getBasePath();
}

function redirect($request, $response, $url) {
    return $response->withStatus(302)->withHeader('Location', baseURI($request) . $url);
}

function now() {
    return date("d-m-Y H:i:s");
}

function write_log($message, $filename) {
    $lines = array_map(function($line) {
        return "[" . now() . "] " . $line;
    }, explode("\n", $message));
    $file = fopen("logs/" . $filename, "a");
    fwrite($file, implode("\n", $lines) . "\n");
    fclose($file);
}

function log_error($message) {
    write_log($message, "error.log");
}

function request_url($request) {
    $uri = $request->getURI();
    $query = $uri->getQuery();
    return $uri->getPath() . ($query ? "?" . $query : '');
}

function match($a, $b) {
    return count(array_diff($a, $b)) == 0 && count(array_diff($b, $a)) == 0;
}

function required_tables() {
    $sql = file_get_contents("sql/create-tables.sql");
    if (preg_match_all("/create table(?: if not exists)? ([^(]+)/i", $sql, $matches)) {
        return array_map('trim', $matches[1]);
    }
}

function split_sql($sql) {
    $sql = preg_replace("/\s+/", " ", $sql);
    if (preg_match("/CREATE TABLE(?: IF NOT\ EXISTS)? ([^(\s]+)\s*\((.+)\)/", $sql, $match)) {
        return array(
            'fields' => array_map(function($sql) {
                return trim(strtolower($sql));
            }, explode(",", $match[2])),
            'name' => $match[1]
        );
    }
}

function get_required_sql() {
    return explode(";", preg_replace("/;\s+$/", "", file_get_contents("sql/create-tables.sql")));
}

function get_table_sql($name) {
    global $app;
    $data = $app->query("SELECT sql FROM sqlite_master WHERE type = 'table' and name = ?", array($name));
    if (count($data) == 1) {
        return $data[0]['sql'];
    }
}

/* return array of alter querires for SQLite unfortunetely you can't remove column
 * https://stackoverflow.com/a/8442173/387194
 */
function get_alter_queries() {
    $required = array_map('split_sql', get_required_sql());
    $result = array();
    foreach ($required as $table) {
        $table['name'];
        $given = split_sql(get_table_sql($table['name']));
        foreach (array_diff($table['fields'], $given['fields']) as $field) {
            $result[] = "ALTER " . $table['name'] . " ADD COLUMN " . $field;
        }
    }
    return $result;
}

function array_pluck($array, $field) {
    return array_map(function($row) {
        return $row[$field];
    }, $array);
}

function tables() {
    global $app;
    $query = "SELECT name FROM sqlite_master WHERE type='table' and name != " .
             "'sqlite_sequence'";
    return array_map(function($assoc) {
        return $assoc['name'];
    }, $app->query($query));
}

function clean($array) {
    return array_filter(array_map('trim', $array), function($item) {
        return $item != '';
    });
}

function installed() {
    return file_exists('config.json') && match(required_tables(), tables());
}

function render($request, $page, $data = array()) {
    global $app;
    return $app->render($request, $page, $data);
}

function query($query, $data = null) {
    global $app;
    return $app->query($query, $data);
}

function load_gettext_domains($root, $lang) {
    if (!preg_match("%" . DIRECTORY_SEPARATOR . "$%", $root)) {
        $root .= DIRECTORY_SEPARATOR;
    }
    $lang = preg_replace("/\.[^.]+$/", "", $lang);
    $path = $root . DIRECTORY_SEPARATOR .
            $lang . DIRECTORY_SEPARATOR . "LC_MESSAGES";
    if (file_exists($path)) {
        foreach (scandir($path) as $file) {
            if (preg_match("/(.*)\.mo$/", $file, $match)) {
                bindtextdomain($match[1], $root);
            }
        }
    }
}

function session_timeout($time) {
    session_set_cookie_params($time, "/");
}

function write($fname, $text) {
    $file = fopen($fname, 'w');
    $ret = fwrite($file, $text);
    fclose($file);
    return $ret;
}

function tidy($html) {
    $config = array(
        'indent' => true,
        'input-xml' => true,
        'output-xhtml' => true,
        'wrap' => 200,
        'merge-spans' => false
    );
    $tidy = tidy_parse_string($html, $config, 'utf8');
    $tidy->cleanRepair();
    return $tidy;
}

?>
