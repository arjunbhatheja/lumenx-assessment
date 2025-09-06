<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Post;
use Illuminate\Support\Facades\Hash;

class DefaultUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create default admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@lumenx.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin'
        ]);

        // Create sample users
        $users = [
            [
                'name' => 'User One',
                'email' => 'user@lumenx.com',
                'password' => Hash::make('user123'),
                'role' => 'user'
            ],
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah@example.com',
                'password' => Hash::make('user123'),
                'role' => 'user'
            ],
            [
                'name' => 'Mike Chen',
                'email' => 'mike@example.com',
                'password' => Hash::make('user123'),
                'role' => 'user'
            ],
            [
                'name' => 'Emma Rodriguez',
                'email' => 'emma@example.com',
                'password' => Hash::make('user123'),
                'role' => 'user'
            ],
            [
                'name' => 'David Thompson',
                'email' => 'david@example.com',
                'password' => Hash::make('user123'),
                'role' => 'user'
            ],
            [
                'name' => 'Lisa Wang',
                'email' => 'lisa@example.com',
                'password' => Hash::make('user123'),
                'role' => 'user'
            ]
        ];

        $createdUsers = [];
        foreach ($users as $userData) {
            $createdUsers[] = User::create($userData);
        }

        // Create diverse sample posts
        $posts = [
            [
                'title' => 'Welcome to LumenX Assessment Platform',
                'content' => 'This full-stack application demonstrates modern web development practices with React frontend, Lumen PHP API, real-time WebSocket integration, and comprehensive admin features. Test the authentication system and explore the admin dashboard!',
                'user_id' => $admin->id
            ],
            [
                'title' => 'Real-Time Updates with WebSocket',
                'content' => 'Experience the power of real-time communication! This application uses WebSocket technology to instantly update posts across all connected clients. Open multiple browser tabs to see live updates in action.',
                'user_id' => $createdUsers[0]->id
            ],
            [
                'title' => 'Modern React UI Components',
                'content' => 'Built with Material-UI v5, this application features responsive design, dark/light theme toggle, and professional component architecture. The interface adapts seamlessly to different screen sizes and user preferences.',
                'user_id' => $createdUsers[1]->id
            ],
            [
                'title' => 'Secure JWT Authentication',
                'content' => 'Security is paramount in modern applications. This system implements JWT-based authentication with role-based access control (RBAC), ensuring that admin functions are properly protected while maintaining a smooth user experience.',
                'user_id' => $createdUsers[2]->id
            ],
            [
                'title' => 'High-Performance Redis Caching',
                'content' => 'Performance optimization through intelligent caching! The application leverages Redis to cache frequently accessed data, reducing database load and improving response times. Cache invalidation ensures data consistency.',
                'user_id' => $admin->id
            ],
            [
                'title' => 'Dockerized Microservices Architecture',
                'content' => 'This application showcases containerized microservices with Docker and Docker Compose. Each service runs in isolation with proper networking, making deployment and scaling straightforward across different environments.',
                'user_id' => $createdUsers[3]->id
            ],
            [
                'title' => 'Comprehensive Testing & Documentation',
                'content' => 'Professional development includes thorough testing and documentation. This project features unit tests, integration tests, SwaggerHub API documentation, and comprehensive deployment guides for seamless onboarding.',
                'user_id' => $createdUsers[4]->id
            ]
        ];

        foreach ($posts as $postData) {
            Post::create($postData);
        }
    }
}
