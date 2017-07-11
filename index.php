<?php

error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE);
ini_set('display_errors', 'On');

require_once('vendor/autoload.php');

$root = __DIR__ . DIRECTORY_SEPARATOR;

if (!file_exists('config.json')) {
    exit();
}
$config = json_decode(file_get_contents('config.json'));

$template = isset($config->template) ? $config->template : 'default';

$loader = new Twig_Loader_Filesystem($root . 'templates' . DIRECTORY_SEPARATOR . $template);
$twig = new Twig_Environment($loader);
/*
   array(
   'cache' =>  $root . 'cache',
   )
 */

function redirect($request, $response, $url) {
    $uri = $request->getUri();
    $base = $uri->getBasePath();
    return $response->withStatus(302)->withHeader('Location', $base . $url);
}

$app = new \Slim\App([
    'settings' => [
        'displayErrorDetails' => true
    ]
]);
session_start();

$app->get('/', function($request, $response) {
    $response->getBody()->write("index");
    return $response;
});

$app->any('/login', function($request, $response, $args) use($twig, $config) {
    $body = $response->getBody();
    if (isset($_POST['username']) && isset($_POST['password'])) {
        if ($_POST['username'] != $config->username) {
            $page = $twig->render('login.html', array('error' => "Wrong username"));
        } elseif ($_POST['password'] != $config->password) {
            $page = $twig->render('login.html', array('error' => "Wrong password"));
        } else {
            $_SESSION['logged'] = true;
            return redirect($request, $response, '/admin');
        }
    } else {
        $page = $twig->render('login.html');
    }
    if ($page) {
        $body->write($page);
    }
    return $response;
});

$app->get('/logout', function($request, $response) {
    unset($_SESSION['logged']);
    return redirect($request, $response, '/');
});

$app->get('/admin', function($request, $response) use($twig, $config) {
    if ($_SESSION['logged']) {
        $response->getBody()->write("admin");
    } else {
        return redirect($request, $response, '/login');
    }
    return $response;
});
//$files = $request->getUploadedFiles();
//$files[0]->moveTo($targetPath);

$app->run();
