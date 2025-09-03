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
    
    // Authentication Routes (No auth required)
    // POST /api/register - Register a new user
    $router->post('register', 'AuthController@register');
    
    // POST /api/login - Login existing user
    $router->post('login', 'AuthController@login');
    
    // Post Routes (Auth required - handled by PostController constructor)
    // GET /api/posts - Get all posts (cached)
    $router->get('posts', 'PostController@index');
    
    // POST /api/posts - Create new post
    $router->post('posts', 'PostController@store');
    
    // GET /api/posts/123 - Get single post by ID (cached)
    $router->get('posts/{id}', 'PostController@show');
});
