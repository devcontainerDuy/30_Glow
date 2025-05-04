<?php

namespace App\Events\Customers;

use App\Models\Customers;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PhoneChanged
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $customer;

    /**
     * Tạo mới sự kiện.
     *
     * @param Customers $customer
     * @return void
     */
    public function __construct(Customers $customer)
    {
        $this->customer = $customer;
    }
    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        return [new Channel('channelPhoneChanged')];
    }
    public function broadcastAs()
    {
        return 'phoneChanged';
    }
}
