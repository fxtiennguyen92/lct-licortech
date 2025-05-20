<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\App;

class LanguageController extends Controller
{
    public function change(string $lang)
    {
        if (!in_array($lang, config('app.locales'))) {
            $lang = 'vi';
        }

        App::setLocale($lang);
        session()->put('locale', $lang);

        return redirect()->back();
    }
}
