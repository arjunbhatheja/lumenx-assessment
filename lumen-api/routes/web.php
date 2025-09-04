<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/
// Handle preflight OPTIONS requests
$router->options('{route:.*}', function () {
    return response('', 200);
});
// Basic health check route
$router->get('/', function () use ($router) {
    return response()->json([
        'message' => 'EnergeX API is running!',
        'version' => $router->app->version()
    ]);
});

// API Routes Group
$router->group(['prefix' => 'api'], function () use ($router) {
    // Public routes
    $router->post('register', 'AuthController@register');
    $router->post('login', 'AuthController@login');
    
    // User routes (any authenticated user)
    $router->group(['middleware' => 'auth'], function () use ($router) {
        $router->get('posts', 'PostController@index');
        $router->get('posts/{id}', 'PostController@show');
        $router->post('posts', 'PostController@store');
        // Get current user profile
        $router->get('profile', 'AuthController@me');
    });
    
    // Admin only routes
    $router->group(['middleware' => ['auth', 'role:admin']], function () use ($router) {
        $router->put('posts/{id}', 'PostController@update');
        $router->delete('posts/{id}', 'PostController@destroy');
        $router->get('admin/users', 'AdminController@users');
        $router->get('admin/stats', 'AdminController@stats');
    });
});
