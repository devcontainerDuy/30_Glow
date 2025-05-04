<?php

namespace Tests;

use Faker\Factory;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    public function setUp(): void
    {
        parent::setUp();
    }

    public function tearDown(): void
    {
        parent::tearDown();
    }

    protected function signIn($user = null)
    {
        $user = $user ?: Factory::create(\App\Models\User::class);

        $this->actingAs($user);

        return $this;
    }
}
