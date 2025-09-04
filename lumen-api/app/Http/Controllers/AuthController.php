<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    /**
     * Register a new user
     * Why: We need a way for users to create accounts
     */
    public function register(Request $request)
    {
        // Step 1: Validate the incoming data
        $this->validate($request, [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'sometimes|string|in:user,admin' 
        ]);

        // Step 2: Create the user in database
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'user'
        ]);

        // Step 3: Generate a JWT token for immediate login
        $token = JWTAuth::fromUser($user);

        // Step 4: Return success response
        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    public function me()
    {
        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['error' => 'User not found'], 404);
            }
            
            return response()->json($user);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Token invalid'], 401);
        }
    }
    /**
     * Login existing user
     * Why: Users need to authenticate to access protected routes
     */
    public function login(Request $request)
    {
        // Step 1: Get email and password from request
        $credentials = $request->only(['email', 'password']);

        // Step 2: Try to authenticate with JWT
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Step 3: Return token if login successful
        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => auth()->user()
        ]);
    }
}
