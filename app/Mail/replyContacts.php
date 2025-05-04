<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Queue\SerializesModels;

class replyContacts extends Mailable
{
    use Queueable, SerializesModels;

    protected $data;

    /**
     * Tạo một instance mới của message.
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Lấy Envelope của message.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address('no-reply@example.com', '30Glow'), 
            subject: 'Trả lời liên hệ từ 30Glow',
        );
    }

    /**
     * Lấy content của message.
     */
    public function content(): Content
    {
        return new Content(
            view: 'mail.replyContacts',
            with: [
                'name' => $this->data['name'],
                'email' => $this->data['email'],
                'replyMessage' => $this->data['replyMessage'],
            ],
        );
    }

    /**
     * Đính kèm file cho email.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}

