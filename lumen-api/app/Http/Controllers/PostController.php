<?php
namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class PostController extends Controller
{
    /**
     * Get all posts (with caching and manual auth check)
     */
    public function index(Request $request)
    {
        // Manual auth check
        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['error' => 'User not found'], 404);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Token invalid or missing'], 401);
        }

        $cacheKey = 'posts:all';
        
        // Step 1: Check if posts are cached in Redis
        $cachedPosts = Redis::get($cacheKey);

        if ($cachedPosts) {
            // Return cached data if available (faster!)
            return response()->json(json_decode($cachedPosts, true));
        }

        // Step 2: If not cached, get from database
        $posts = Post::with('user')->get();
        
        // Step 3: Cache the results for 5 minutes (300 seconds)
        Redis::setex($cacheKey, 300, json_encode($posts));

        return response()->json($posts);
    }

    /**
     * Create a new post
     */
    public function store(Request $request)
    {
        // Manual auth check
        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['error' => 'User not found'], 404);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Token invalid or missing'], 401);
        }

        // Step 1: Validate the incoming data
        $this->validate($request, [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        // Step 2: Create the post with authenticated user's ID
        $post = Post::create([
            'title' => $request->title,
            'content' => $request->content,
            'user_id' => $user->id,
        ]);

        // Step 3: Clear the cache since we have new data
        Redis::del('posts:all');

        // Step 4: Return the created post with user info
        return response()->json($post->load('user'), 201);
    }

    /**
     * Get a single post (with caching)
     */
    public function show($id, Request $request)
    {
        // Manual auth check
        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['error' => 'User not found'], 404);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Token invalid or missing'], 401);
        }

        $cacheKey = "posts:{$id}";
        
        // Step 1: Check cache first
        $cachedPost = Redis::get($cacheKey);

        if ($cachedPost) {
            return response()->json(json_decode($cachedPost, true));
        }

        // Step 2: Get from database if not cached
        $post = Post::with('user')->findOrFail($id);
        
        // Step 3: Cache it for next time
        Redis::setex($cacheKey, 300, json_encode($post));

        return response()->json($post);
    }
}
