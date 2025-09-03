<?php
namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

class PostController extends Controller
{
    /**
     * Require authentication for all post operations
     * Why: Only logged-in users should manage posts
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Get all posts (with caching)
     * Why: Users want to see all posts, and caching makes it fast
     */
    public function index()
    {
        $cacheKey = 'posts:all';
        
        // Step 1: Check if posts are cached in Redis
        $cachedPosts = Redis::get($cacheKey);

        if ($cachedPosts) {
            // Return cached data if available (faster!)
            return response()->json(json_decode($cachedPosts, true));
        }

        // Step 2: If not cached, get from database
        $posts = Post::with('user')->get(); // 'with' loads user data too
        
        // Step 3: Cache the results for 5 minutes (300 seconds)
        Redis::setex($cacheKey, 300, json_encode($posts));

        return response()->json($posts);
    }

    /**
     * Create a new post
     * Why: Users need to be able to create content
     */
    public function store(Request $request)
    {
        // Step 1: Validate the incoming data
        $this->validate($request, [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        // Step 2: Create the post with current user's ID
        $post = Post::create([
            'title' => $request->title,
            'content' => $request->content,
            'user_id' => auth()->id(), // Get the logged-in user's ID
        ]);

        // Step 3: Clear the cache since we have new data
        Redis::del('posts:all');

        // Step 4: Return the created post with user info
        return response()->json($post->load('user'), 201);
    }

    /**
     * Get a single post (with caching)
     * Why: Users want to view individual posts in detail
     */
    public function show($id)
    {
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
