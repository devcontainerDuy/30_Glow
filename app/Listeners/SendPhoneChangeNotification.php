<?php

namespace App\Listeners;

use App\Events\Customers\PhoneChanged;
use App\Mail\PhoneChangedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendPhoneChangeNotification
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
    public function handle(PhoneChanged $event)
    {
        Mail::to($event->customer->email)->send(new PhoneChangedNotification($event->customer));
    }
}
