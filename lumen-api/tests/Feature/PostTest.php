<?php

use Laravel\Lumen\Testing\TestCase as BaseTestCase;
use Laravel\Lumen\Testing\DatabaseMigrations;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;

class PostTest extends BaseTestCase
{
    use DatabaseMigrations;

    protected $user;
    protected $token;

    public function createApplication()
    {
        return require __DIR__.'/../../bootstrap/app.php';
    }

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a test user and get token
        $this->user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => app('hash')->make('password123'),
        ]);
        
        $this->token = JWTAuth::fromUser($this->user);
    }

    public function testCreatePost()
    {
        $response = $this->post('/api/posts', [
            'title' => 'Test Post',
            'content' => 'This is a test post content',
        ], [
            'Authorization' => 'Bearer ' . $this->token
        ]);

        $response->assertResponseStatus(201);
        $response->seeJsonStructure(['id', 'title', 'content', 'user_id', 'user']);
    }

    public function testGetAllPosts()
    {
        // Create a post first
        $this->post('/api/posts', [
            'title' => 'Test Post',
            'content' => 'Test content',
        ], [
            'Authorization' => 'Bearer ' . $this->token
        ]);

        $response = $this->get('/api/posts', [
            'Authorization' => 'Bearer ' . $this->token
        ]);

        $response->assertResponseStatus(200);
        $response->seeJsonStructure([['id', 'title', 'content', 'user_id']]);
    }

    public function testUnauthorizedAccess()
    {
        $response = $this->get('/api/posts');
        $response->assertResponseStatus(401);
    }
}
