<?php

use Laravel\Lumen\Testing\TestCase as BaseTestCase;

class ExampleTest extends BaseTestCase
{
    public function createApplication()
    {
        return require __DIR__.'/../bootstrap/app.php';
    }

    public function test_that_base_endpoint_returns_a_successful_response()
    {
        $this->get('/');
        $this->seeJson(['message' => 'EnergeX API is running!']);
    }
}
