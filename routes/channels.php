<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('App.Models.Customer.{id}', function ($customer, $id) {
    return (int) $customer->id === (int) $id;
});

Broadcast::channel('channelBookings', function ($user, int $id) {
    return true;
});
Broadcast::channel('channelContacts', function ($user) {
    return true;
});
