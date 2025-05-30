<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class LanguageManager
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if (session()->has('locale')) {
            App::setLocale(session()->get('locale'));
        } else {
            // Get from user brower
            $preferredLanguages = $request->getLanguages();
            $preferredLanguage = reset($preferredLanguages);

            // Check in acceptable languages
            if (in_array($preferredLanguage, config('app.locales'))) {
                App::setLocale($preferredLanguage);
            }
        }

        return $next($request);
    }
}
