<?php

// controllers = [ controller => [ ...actions ] ]
$controllers = [
    'ad' => [
        'index',
        'create',
        'delete',
        'edit'
    ],
    'auth' => [
        'login',
        'register',
        'logout'
    ],
    'pages' => [
        'index',
        'error',
        'success'
    ],
    'user' => [
        'index',
        'edit'
    ],
    'comment' => [
        'index',
        'create',
        'delete'
    ]
];

function call(?string $controller, ?string $action, string $message = null)
{
    global $controllers;

    if (!$controller || !$action) {
        $controller = 'pages';
        $action = 'index';
    }

    if (!array_key_exists($controller, $controllers) && in_array($action, $controllers[$controller])) {
        $controller = 'pages';
        $action = 'error';
    }

    $controller = ucfirst($controller);
    $requireController = __DIR__ . '/../controllers/' . $controller . 'Controller.php';
    $requireModel = __DIR__ . '/../models/' . $controller . 'Model.php';

    require_once $requireController;
    require_once $requireModel;

    $controller = 'App\\controllers\\' . $controller . 'Controller';
    $controller = new $controller;

    if ($message)
        $controller->{$action}($message);
    else
        $controller->{$action}();
}

// from view/index.php
if (isset(get_defined_vars()['controller']) && isset(get_defined_vars()['action'])) {
    list('controller' => $controller, 'action' => $action) = get_defined_vars();
    call($controller, $action);
} else
    call(null, null);
