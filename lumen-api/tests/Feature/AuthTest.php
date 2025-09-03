<?php

use Laravel\Lumen\Testing\TestCase as BaseTestCase;
use Laravel\Lumen\Testing\DatabaseMigrations;

class AuthTest extends BaseTestCase
{
    use DatabaseMigrations;

    public function createApplication()
    {
        return require __DIR__.'/../../bootstrap/app.php';
    }

    public function testUserRegistration()
    {
        $response = $this->post('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertResponseStatus(201);
        $response->seeJsonStructure(['message', 'user', 'token']);
        $response->seeJson(['message' => 'User registered successfully']);
    }

    public function testUserLogin()
    {
        // First register a user
        $this->post('/api/register', [
            'name' => 'Login Test User',
            'email' => 'logintest@example.com',
            'password' => 'password123',
        ]);

        // Then try to login
        $response = $this->post('/api/login', [
            'email' => 'logintest@example.com',
            'password' => 'password123',
        ]);

        $response->assertResponseStatus(200);
        $response->seeJsonStructure(['message', 'token', 'user']);
        $response->seeJson(['message' => 'Login successful']);
    }

    public function testInvalidLogin()
    {
        $response = $this->post('/api/login', [
            'email' => 'nonexistent@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertResponseStatus(401);
        $response->seeJson(['error' => 'Unauthorized']);
    }
}
