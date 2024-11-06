<?php

namespace App\Events\Bookings;

use App\Models\Bookings;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BookingEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     * 
     * @return void
     * @param Bookings $parameters
     */
    public $bookingData;
    public function __construct($parameters)
    {
        // Assuming $booking is a collection of booking instances
        $this->bookingData = $parameters->map(function ($item) {
            return [
                'id' => $item->id,
                'user' => $item->user ? [
                    'uid' => $item->user->uid,
                    'name' => $item->user->name,
                ] : null,
                'customer' => $item->customer ? [
                    'uid' => $item->customer->uid,
                    'name' => $item->customer->name,
                ] : null,
                'time' => $item->time,
                'service' => $item->service ? $item->service->map(function ($service) {
                    return [
                        'uid' => $service->uid,
                        'name' => $service->name,
                    ];
                })->toArray() : null,
                'note' => $item->note,
                'status' => $item->status,
            ];
        });
    }


    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        return [new Channel('channelBookings')];
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'BookingCreated';
    }
}
