<?php

namespace App\Mail;

use App\Models\ClientContact;
use App\Models\SysCommon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CMSNotificationClientContact extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(private ClientContact $contact)
    {
        //
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $logo = SysCommon::getByCode('web_logo');
        return $this->view('mail.notification_has_contact')
            ->subject('['.config('app.name').'] Notification client contact')
            ->with([
                'contact' => $this->contact,
                'logo' => config('app.url').$logo->value,
            ]);
    }
}
