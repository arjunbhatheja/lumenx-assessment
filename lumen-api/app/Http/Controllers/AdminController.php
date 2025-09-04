<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AdminController extends Controller
{
    /**
     * Get all users (Admin only)
     */
    public function users()
    {
        try {
            // Get authenticated user
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['error' => 'User not found'], 404);
            }

            // Double check admin role (middleware should handle this, but be safe)
            if ($user->role !== 'admin') {
                return response()->json(['error' => 'Insufficient permissions'], 403);
            }

            // Get all users
            $users = User::select('id', 'name', 'email', 'role', 'created_at', 'updated_at')->get();

            return response()->json([
                'message' => 'Users retrieved successfully',
                'users' => $users,
                'total' => $users->count()
            ]);

        } catch (JWTException $e) {
            return response()->json(['error' => 'Token invalid or missing'], 401);
        }
    }

    /**
     * Get user statistics (Admin only)
     */
    public function stats()
    {
        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['error' => 'User not found'], 404);
            }

            if ($user->role !== 'admin') {
                return response()->json(['error' => 'Insufficient permissions'], 403);
            }

            $totalUsers = User::count();
            $adminUsers = User::where('role', 'admin')->count();
            $regularUsers = User::where('role', 'user')->count();

            return response()->json([
                'total_users' => $totalUsers,
                'admin_users' => $adminUsers,
                'regular_users' => $regularUsers
            ]);

        } catch (JWTException $e) {
            return response()->json(['error' => 'Token invalid or missing'], 401);
        }
    }
}
