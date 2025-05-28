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
        $packages = [
            'basic' => [
                'popular_flg' => false,
                'icon' => 'assets/images/pricing/basic.svg',
                'name' => __('packages.basic.name'),
                'description' => __('packages.basic.description'),
                'price_month' => 19.99,
                'price_year' => 215.99,
                'details' => [
                    'reservation' => true,
                    'client' => false,
                    'google_business' => true,
                    'support' => true,
                    'web' => false,
                    'domain' => false,
                    'ssl' => false,
                    'email' => false,
                ],
                'exts' => [
                    'noti' => false,
                    'feedback' => false,
                ]
            ],
            'premium' => [
                'popular_flg' => true,
                'icon' => 'assets/images/pricing/business.svg',
                'name' => __('packages.premium.name'),
                'description' => __('packages.premium.description'),
                'price_month' => 34.99,
                'price_year' => 377.99,
                'details' => [
                    'reservation' => true,
                    'client' => true,
                    'google_business' => true,
                    'support' => true,
                    'web' => true,
                    'domain' => true,
                    'ssl' => true,
                    'email' => true,
                ],
                'exts' => [
                    'noti' => true,
                    'feedback' => true,
                ]
            ]
        ];

        $options = ['web_pro', 'sms', 'branch'];

        return view('landingpage.home', array(
            'data' => Page::getByCode('home'),
            'packages' => $packages,
            'options' => $options,
        ));
    }

    public function legalNoticePage() {
        return view('landingpage.legal_notice');
    }

    public function privacyPolicyPage() {
        return view('landingpage.privacy_policy');
    }

    public function termsConditionsPage() {
        return view('landingpage.terms_conditions');
    }

    public function cookiePolicyPage() {
        return view('landingpage.cookie_policy');
    }

    public function thanksPage()
    {
        return view('landingpage.thanks', array(
            'data' => Page::getByCode('thanks'),
        ));
    }

    public function submitContact(Request $request)
    {
        try {
            $recaptchaToken = $request->input('recaptcha_token');
            $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret'   => config('app.recaptcha_secret_key'),
                'response' => $recaptchaToken,
            ]);

            $result = $response->json();

            if (!($result['success'] ?? false) || ($result['score'] ?? 0) < 0.5) {
                return back()->withInput()->with('error', trans('message.submit_contact_recaptcha_invalid'));
            }


            if ($request->name) {
                $contact = ClientContact::create([
                    'name' => $request->name,
                    'phone' => $request->phone,
                    'email' => $request->email,
                    'country_code' => $request->country_code,
                ]);

                return redirect()->route('thanks');
            }

            return back()->withInput()->with('error', trans('message.submit_contact_failed'));
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return back()->withInput()->with('error', trans('message.submit_contact_failed'));
        }
    }
}
