<?php
namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Cache;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class PostController extends Controller
{
    public function index(Request $request)
    {
        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['error' => 'User not found'], 404);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Token invalid or missing'], 401);
        }

        $cacheKey = 'posts:all';
        $cachedPosts = Cache::get($cacheKey);

        if ($cachedPosts) {
            return response()->json(json_decode($cachedPosts, true));
        }

        $posts = Post::with('user')->get();
        Cache::put($cacheKey, $posts, 300);

        return response()->json($posts);
    }

    public function store(Request $request)
    {
        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['error' => 'User not found'], 404);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Token invalid or missing'], 401);
        }

        $this->validate($request, [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $post = Post::create([
            'title' => $request->title,
            'content' => $request->content,
            'user_id' => $user->id,
        ]);

        Cache::forget('posts:all');

        try {
            Redis::publish('post:created', json_encode($post->load('user')));
        } catch (\Exception $e) {
            error_log('Failed to publish WebSocket event: ' . $e->getMessage());
        }

        return response()->json($post->load('user'), 201);
    }

    public function show($id, Request $request)
    {
        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['error' => 'User not found'], 404);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Token invalid or missing'], 401);
        }

        $cacheKey = "posts:{$id}";
        $cachedPost = Cache::get($cacheKey);

        if ($cachedPost) {
            return response()->json(json_decode($cachedPost, true));
        }

        $post = Post::with('user')->findOrFail($id);
        Cache::put($cacheKey, $post, 300);

        return response()->json($post);
    }

    /**
     * Update a post (Admin only)
     */
    public function update(Request $request, $id)
    {
        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['error' => 'User not found'], 404);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Token invalid or missing'], 401);
        }

        $this->validate($request, [
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
        ]);

        $post = Post::findOrFail($id);
        $post->update($request->all());

        // Clear cache
        Cache::forget('posts:all');
        Cache::forget("posts:{$id}");

        // Publish WebSocket event for real-time updates
        try {
            Redis::publish('post:updated', json_encode($post->load('user')));
        } catch (\Exception $e) {
            error_log('Failed to publish WebSocket event: ' . $e->getMessage());
        }

        return response()->json($post->load('user'));
    }

    /**
     * Delete a post (Admin only)
     */
    public function destroy($id)
    {
        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['error' => 'User not found'], 404);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Token invalid or missing'], 401);
        }

        $post = Post::findOrFail($id);
        $postId = $post->id;
        $post->delete();

        // Clear cache
        Cache::forget('posts:all');
        Cache::forget("posts:{$id}");

        // Publish WebSocket event for real-time updates
        try {
            Redis::publish('post:deleted', json_encode(['id' => $postId]));
        } catch (\Exception $e) {
            error_log('Failed to publish WebSocket event: ' . $e->getMessage());
        }

        return response()->json(['message' => 'Post deleted successfully']);
    }
}
