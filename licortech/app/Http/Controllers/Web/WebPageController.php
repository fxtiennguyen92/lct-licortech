<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Mail\CMSNotificationClientContact;
use App\Mail\ConfirmationContact;
use App\Models\ClientContact;
use App\Models\Page;
use App\Models\Post;
use App\Models\Section;
use App\Models\Service;
use App\Models\SysCommon;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class WebPageController extends Controller
{
    public function landingpage()
    {
        return view('landingpage.home', array(
            'data' => Page::getByCode('home'),
        ));
    }

    public function aboutPage()
    {
        return view('landingpage.about', array(
            'data' => Page::getByCode('about'),
            'contactSection' => Section::getByCode('home_contact_banner'),
        ));
    }

    public function servicePage($code)
    {
        // dd(Page::getByCode('service_' . $code)->toArray());

        return view('landingpage.service', array(
            'service' => Service::getByRoute($code),
            'data' => Page::getByCode('service_' . $code),
            'contactSection' => Section::getByCode('home_contact_banner'),
        ));
    }

    public function  redirectDefaultServicePage()
    {
        return redirect()->route('services.page', 'fastweb');
    }

    public function thanksPage()
    {
        return view('landingpage.thanks', array(
            'data' => Page::getByCode('thanks'),
        ));
    }

    public function contactPage()
    {
        return redirect()->route('call');

        return view('landingpage.contact', array(
            'data' => Page::getByCode('contact'),
            'enabledDates' => $this->listEnableDates(),
            'enabledHours' => $this->listEnableHours()
        ));
    }

    public function submitContact(Request $request)
    {
        try {
            $recaptcha = 'g-recaptcha-response';

            if ($request->$recaptcha) {
                $gResponseToken = $request->$recaptcha;

                $response = Http::asForm()->post(
                    'https://www.google.com/recaptcha/api/siteverify',
                    ['secret' => config('app.recaptcha_secret_key'), 'response' => $gResponseToken]
                );

                if (!json_decode($response->body(), true)['success']) {
                    return back()->withInput()->with('error', trans('message.submit_contact_recaptcha_invalid'));
                }
            } else {
                return back()->withInput()->with('error', trans('message.submit_contact_recaptcha_invalid'));
            }


            if ($request->name && $request->content) {
                $contact = ClientContact::create([
                    'name' => $request->name,
                    'phone' => $request->phone,
                    'email' => $request->email,
                    'country_code' => $request->country_code,
                    'content' => $request->content
                ]);

                $this->sendConfirmationEmail($contact);

                return redirect()->route('thanks');
            }

            return back()->withInput()->with('error', trans('message.submit_contact_failed'));
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return back()->withInput()->with('error', trans('message.submit_contact_failed'));
        }
    }

    public function callPage()
    {
        return view('landingpage.call', array(
            'data' => Page::getByCode('book-a-call'),
            'enabledDates' => $this->listEnableDates(),
            'enabledHours' => $this->listEnableHours()
        ));
    }

    public function submitCallBooking(Request $request)
    {
        try {
            if ($request->name && $request->phone && $request->date) {
                $rDateString = $request->date . '' . ($request->time ?? '09:00');
                $rDate = DateTime::createFromFormat('Y-m-d H:i', $rDateString);

                $contact = ClientContact::create([
                    'name' => $request->name,
                    'phone' => $request->phone,
                    'email' => $request->email,
                    'country_code' => $request->country_code,
                    'reserved_at' => $rDate,
                    'type' => 1,
                ]);

                $this->sendConfirmationEmail($contact);

                return redirect()->route('thanks');
            }

            return redirect()->back()->with('success', trans('message.submit_contact_failed'));
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return redirect()->back()->with('error', trans('message.submit_contact_failed'));
        }
    }

    protected function listEnableDates()
    {
        $tomorrow = new DateTime('tomorrow');
        $list = array();

        for ($i = 0; $i < 14; $i++) {
            $list[] = $tomorrow->format('Y-m-d');
            $tomorrow->modify('+1 day');
        }

        return $list;
    }

    protected function listEnableHours()
    {
        $start_time = new DateTime('09:00');
        $end_time = new DateTime('16:00');

        // Initialize an empty array to store the hours
        $list = array();

        // Loop to get the hours from start to end
        $current_time = clone $start_time;
        while ($current_time <= $end_time) {
            $list[] = $current_time->format('H:i');
            $current_time->modify('+1 hour');
        }

        return $list;
    }

    protected function sendConfirmationEmail(ClientContact $contact)
    {
        Mail::to($contact->email)->send(new ConfirmationContact($contact));

        // Notification
        $email = SysCommon::getByCode('email_notification_client_contact');
        Mail::to($email->value)->send(new CMSNotificationClientContact($contact));
    }
}
