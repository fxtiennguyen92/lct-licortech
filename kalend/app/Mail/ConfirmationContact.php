<?php

namespace App\Mail;

use App\Models\ClientContact;
use App\Models\SysCommon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\App;

class ConfirmationContact extends Mailable
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
        return $this->view('mail.confirmation_contact_'.App::getLocale())
            ->subject('['.config('app.name').'] Confirmation')
            ->with([
                'contact' => $this->contact,
                'logo' => config('app.url').$logo->value,
            ]);
    }
}
