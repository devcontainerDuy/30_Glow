<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Attempting;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class ValidateUserStatus
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Attempting $event)
    {
        $email = $event->credentials['email'];
        $user = \App\Models\User::where('email', $email)->first();

        if ($user && $user->status !== 1) {
            return false;
        }
    }
}
