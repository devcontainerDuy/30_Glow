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
            return
                [
                    'id' => $item->id,
                    'user' => $item->user ? [
                        'uid' => $item->user->uid,
                        'name' => $item->user->name,
                        'email' => $item->user->email,
                        'phone' => $item->user->phone,
                        'address' => $item->user->address,
                    ] : null,
                    'customer' => $item->customer ? [
                        'uid' => $item->customer->uid,
                        'name' => $item->customer->name,
                        'email' => $item->customer->email,
                        'phone' => $item->customer->phone,
                        'address' => $item->customer->address,
                    ] : null,
                    'time' => $item->time,
                    'service' => $item->service ? $item->service->map(function ($service) {
                        return [
                            'id' => $service->id,
                            'name' => $service->name,
                            'slug' => $service->slug,
                            'price' => $service->price,
                            'compare_price' => $service->compare_price,
                            'discount' => $service->discount,
                            'summary' => $service->summary,
                            'image' => asset('storage/services/' . $service->image),
                            'content' => $service->content,
                            'highlighted' => $service->highlighted,
                            "collection" => $service->collection ? [
                                'id' => $service->collection->id,
                                'name' => $service->collection->name,
                                'slug' => $service->collection->slug,
                                'highlighted' => $service->collection->highlighted,
                            ] : null,
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
