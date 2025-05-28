<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\CMS\AccountController;
use App\Http\Controllers\CMS\ClientContactController;
use App\Http\Controllers\CMS\ContentController;
use App\Http\Controllers\CMS\DashboardController;
use App\Http\Controllers\CMS\NavBarController;
use App\Http\Controllers\CMS\PageContentController;
use App\Http\Controllers\CMS\PageController;
use App\Http\Controllers\CMS\PageInfoController;
use App\Http\Controllers\CMS\PageScriptController;
use App\Http\Controllers\CMS\PageSeoController;
use App\Http\Controllers\CMS\PostController;
use App\Http\Controllers\CMS\ServiceController;
use App\Http\Controllers\CMS\SystemController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\SitemapXmlController;
use App\Http\Controllers\Web\WebPageController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// CMS
Route::get('cms', function() {
    return redirect()->route('login.view');
});
Route::controller(LoginController::class)->group(function() {
    Route::get('login', 'view')->name('login.view');

    Route::post('login', 'login')->name('login');
    Route::get('logout', 'logout')->name('logout');
});

Route::middleware('auth')->prefix('cms')->name('cms.')->group(function() {
    Route::controller(DashboardController::class)->group(function() {
        Route::get('dashboard', 'view')->name('dashboard');
    });

    Route::controller(AccountController::class)->middleware('auth.admin')->group(function() {
        Route::get('admin-accounts', 'view')->name('accounts');
        Route::put('admin-accounts/{id}/reset', 'resetPassword')->name('accounts.reset');
    });
    Route::controller(AccountController::class)->middleware('auth')->group(function() {
        Route::get('account/password', 'editPassword')->name('accounts.edit-password');
        Route::put('account/changePassword', 'changePassword')->name('accounts.change-password');
    });


    Route::controller(SystemController::class)->middleware('auth.admin')->group(function() {
        Route::get('system', 'view')->name('system');
        Route::get('system/new', 'new')->name('system.new');
        Route::post('system/new', 'create')->name('system.create');
        Route::get('system/{id}', 'edit')->name('system.edit');
        Route::put('system/{id}', 'update')->name('system.update');
        Route::delete('system/{id}', 'delete')->name('system.delete');
    });

    Route::controller(PageController::class)->middleware('auth.admin')->group(function() {
        Route::get('pages', 'view')->name('pages');
        Route::get('pages/new', 'new')->name('pages.new');
        Route::post('pages/new', 'create')->name('pages.create');
        Route::get('pages/{id}', 'edit')->name('pages.edit');
        Route::put('pages/{id}', 'update')->name('pages.update');
        Route::delete('pages/{id}', 'delete')->name('pages.delete');
    });

    Route::controller(PageContentController::class)->middleware('auth.admin')->group(function() {
        Route::get('pages/{id}/contents', 'view')->name('pages.contents');
        Route::post('pages/{id}/contents', 'update')->name('pages.contents.update');

        Route::delete('sections/{sectionId}', 'deleteSection')->name('sections.delete');
        Route::delete('texts/{textId}', 'deleteText')->name('texts.delete');
        Route::delete('buttons/{buttonId}', 'deleteButton')->name('buttons.delete');
        Route::delete('images/{imageId}', 'deleteImage')->name('images.delete');
    });

    Route::controller(NavBarController::class)->middleware('auth.admin')->group(function() {
        Route::get('navbars', 'view')->name('navbars');
        Route::get('navbars/new', 'new')->name('navbars.new');
        Route::post('navbars/new', 'create')->name('navbars.create');
        Route::get('navbars/{id}', 'edit')->name('navbars.edit');
        Route::put('navbars/{id}', 'update')->name('navbars.update');
        Route::delete('navbars/{id}', 'delete')->name('navbars.delete');
    });

    Route::controller(PageInfoController::class)->middleware('auth.content')->group(function() {
        Route::get('info', 'view')->name('info');
        Route::put('info', 'update')->name('info.update');
        Route::put('office/{id}', 'updateOffice')->name('office.update');
    });

    Route::controller(ContentController::class)->middleware('auth.content')->group(function() {
        Route::get('content', 'viewPageList')->name('content');
        Route::get('content/pages/{id}/content', 'view')->name('content.page');
        Route::put('content/pages/{id}/content', 'update')->name('content.page.update');
    });

    Route::controller(PageSeoController::class)->middleware('auth.content')->group(function() {
        Route::get('seo', 'viewPageList')->name('seo');
        Route::get('content/pages/{id}/seo', 'view')->name('seo.page');
        Route::put('seo/{id}', 'update')->name('seo.page.update');
        Route::delete('seo/{id}', 'delete')->name('seo.page.delete');
    });

    Route::controller(PageScriptController::class)->middleware('auth.content')->group(function() {
        Route::get('script', 'view')->name('script');
        Route::put('script', 'update')->name('script.update');
    });

    Route::controller(PostController::class)->middleware('auth.content')->group(function() {
        Route::get('blog', 'viewBlog')->name('blog');
        Route::get('blog/post', 'new')->name('post.new');
        Route::post('blog/post', 'create')->name('post.create');
        Route::get('post/{id}', 'edit')->name('post.edit');
        Route::put('post/{id}', 'update')->name('post.update');
        Route::delete('post/{id}', 'delete')->name('post.delete');
    });

    Route::controller(PageScriptController::class)->middleware('auth.content')->group(function() {
        Route::get('script', 'view')->name('script');
        Route::put('script', 'update')->name('script.update');
    });

    Route::controller(ClientContactController::class)->middleware('auth.content')->group(function() {
        Route::get('contacts', 'view')->name('contacts');
        Route::get('contacts/{id}/reply', 'reply')->name('contacts.reply');
        Route::get('contacts/{id}/delete', 'delete')->name('contacts.delete');
    });

    Route::controller(ServiceController::class)->middleware('auth.content')->group(function() {
        Route::get('services', 'view')->name('services');
        Route::post('services', 'create')->name('services.create');
        Route::put('services/{id}', 'update')->name('services.update');
        Route::delete('services/{id}', 'delete')->name('services.delete');
    });
});

// Web
Route::controller(WebPageController::class)->group(function() {
    Route::get('', 'landingpage')->name('home');

    Route::get('legal-notice', 'legalNoticePage')->name('legal-notice');
    Route::get('privacy-policy', 'privacyPolicyPage')->name('privacy-policy');
    Route::get('terms-conditions', 'termsConditionsPage')->name('terms-conditions');
    Route::get('cookie-policy', 'cookiePolicyPage')->name('cookie-policy');
    

    // Route::get('about', 'aboutPage')->name('about');

    // Route::get('services', 'redirectDefaultServicePage')->name('services');
    // Route::get('services/{route}', 'servicePage')->name('services.page');

    // Route::get('blog', 'blogPage')->name('blog');
    // Route::get('post/{route}', 'postPage')->name('post');

    // Route::get('contact', 'contactPage')->name('contact');
    Route::post('contact', 'submitContact')->name('contact');

    Route::get('thanks', 'thanksPage')->name('thanks');
});
Route::controller(SitemapXmlController::class)->group(function() {
    Route::get('sitemap.xml', 'index');
});
Route::controller(LanguageController::class)->group(function() {
    Route::get('locale/{lang}', 'change')->name('locale.change');
});
