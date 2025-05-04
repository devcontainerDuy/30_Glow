<?php

namespace App\Events\Contacts;

use App\Models\Contacts;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ContactsEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $contact;

    /**
     * Tạo mới một event.
     *
     * @param Contacts $parameters
     * @return void
     */
    public $ContactsData;
    public function __construct($parameters)
    {
        $this->ContactsData = $parameters->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'email' => $item->email,
                'phone' => $item->phone,
                'message'=> $item->message,
                'note' => $item->note,
                'created_at' => $item->created_at,
                'status' => $item->status,
            ];
        });
    }
    

    /**
     * Các kênh mà event sẽ được broadcast.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('channelContacts');
    }

    /**
     * Tên sự kiện phát sóng.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'ContactsCreated';
    }
}
