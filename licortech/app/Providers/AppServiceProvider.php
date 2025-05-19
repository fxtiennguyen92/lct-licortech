<?php

namespace App\Providers;

use App\Models\Language;
use App\Models\NavBar;
use App\Models\Office;
use App\Models\Service;
use App\Models\SysCommon;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        View::share('common', SysCommon::getAll());
        View::share('nav', NavBar::getForLandingPage());
        View::share('navServices', Service::getAll());
        View::share('office', Office::first());
        View::share('languages', Language::getForPage());

        view()->composer(['cms.*'], function ($view) {
            $view->with('cmsNav', NavBar::getForCMSPage());
        });
        view()->composer(['*'], function ($view) {
            $view->with('curLanguage', Language::getCodeForView(App::getLocale()));
            $view->with('language', Language::getByCode(App::getLocale()));
        });
    }
}
