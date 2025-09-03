<?php

return [
    'default' => env('CACHE_DRIVER', 'redis'),
    
    'stores' => [
        'redis' => [
            'driver' => 'redis',
            'connection' => 'default',
        ],
        'array' => [
            'driver' => 'array',
        ],
    ],
    
    'prefix' => env('CACHE_PREFIX', 'energex_cache'),
];
