<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class RoleMiddleware
{
    public function handle($request, Closure $next, ...$roles)
    {
        $response = null;

        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                $response = response()->json(['error' => 'User not found'], 404);
            } elseif (!in_array($user->role, $roles)) {
                $response = response()->json(['error' => 'Insufficient permissions'], 403);
            } else {
                $response = $next($request);
            }
        } catch (JWTException $e) {
            $response = response()->json(['error' => 'Token invalid'], 401);
        }

        return $response;
    }
}
