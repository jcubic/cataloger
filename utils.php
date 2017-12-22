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

// based on:
// http://www.akemapa.com/2008/07/10/php-gd-resize-transparent-image-png-gif/
function resize($img, $size, $newfilename) {

    //Check if GD extension is loaded
    if (!extension_loaded('gd') && !extension_loaded('gd2')) {
        trigger_error("GD is not loaded", E_USER_WARNING);
        return false;
    }

    //Get Image size info
    $imgInfo = getimagesize($img);
    switch ($imgInfo[2]) {
        case 1: $im = imagecreatefromgif($img); break;
        case 2: $im = imagecreatefromjpeg($img);  break;
        case 3: $im = imagecreatefrompng($img); break;
        default:  trigger_error('Unsupported filetype!', E_USER_WARNING);  break;
    }

    //If image dimension is smaller, do not resize
    if ($imgInfo[0] <= $size && $imgInfo[1] <= $size) {
        $nHeight = $imgInfo[1];
        $nWidth = $imgInfo[0];
    } else {
        //yeah, resize it, but keep it proportional
        if ($imgInfo[0] > $imgInfo[1]) {
            $nWidth = $size;
            $nHeight = $imgInfo[1]*($size/$imgInfo[0]);
        } else {
            $nWidth = $imgInfo[0]*($size/$imgInfo[1]);
            $nHeight = $size;
        }
    }
    $nWidth = round($nWidth);
    $nHeight = round($nHeight);

    $newImg = imagecreatetruecolor($nWidth, $nHeight);

    /* Check if this image is PNG or GIF, then set if Transparent*/
    if(($imgInfo[2] == 1) OR ($imgInfo[2]==3)){
        imagealphablending($newImg, false);
        imagesavealpha($newImg,true);
        $transparent = imagecolorallocatealpha($newImg, 255, 255, 255, 127);
        imagefilledrectangle($newImg, 0, 0, $nWidth, $nHeight, $transparent);
    }
    imagecopyresampled($newImg, $im, 0, 0, 0, 0, $nWidth, $nHeight, $imgInfo[0], $imgInfo[1]);

    //Generate the file, and rename it to $newfilename
    switch ($imgInfo[2]) {
        case 1: imagegif($newImg,$newfilename); break;
        case 2: imagejpeg($newImg,$newfilename);  break;
        case 3: imagepng($newImg,$newfilename); break;
        default:  trigger_error('Failed resize image!', E_USER_WARNING);  break;
    }
    imagedestroy($newImg);
    imagedestroy($im);

    return $newfilename;
}

function is_image($name) {
    return preg_match("/^[^.]+\.(jpe?g|gif|png)$/i", $name);
}



function missing_image_path() {
    global $app;
    $templates_dir = $app->root . 'templates' . DIRECTORY_SEPARATOR;
    if (isset($app->config->template) && $app->config->template != 'default') {
        $fname = $templates_dir . $app->config->template . DIRECTORY_SEPARATOR .
                 "images" . DIRECTORY_SEPARATOR .
                 "image-missing.png";
        if (file_exists($fname)) {
            return $fname;
        }
    }
    $fname = $templates_dir . "default" . DIRECTORY_SEPARATOR .
             "images" . DIRECTORY_SEPARATOR .
             "image-missing.png";
    if (file_exists($fname)) {
        return $fname;
    }
}

function load_plugins() {
    $plugin_path = "plugins";

    $dir = opendir($plugin_path);
    if ($dir) {
        while (($file = readdir($dir)) !== false) {
            $path = $plugin_path . DIRECTORY_SEPARATOR . $file . DIRECTORY_SEPARATOR;
            $fname = $path . $file . ".php";
            if (!preg_match("/^\.{1,2}$/", $file) && is_dir($path) && is_file($fname)) {
                require_once($fname);
            }
        }
    }
}

function kill_session() {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
    session_destroy();
    session_write_close();
}

?>
