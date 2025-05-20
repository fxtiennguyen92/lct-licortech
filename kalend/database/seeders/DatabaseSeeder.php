<?php

namespace Database\Seeders;

use App\Models\Button;
use App\Models\Image;
use App\Models\NavBar;
use App\Models\Office;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\Section;
use App\Models\SeoTag;
use App\Models\SysCommon;
use App\Models\Text;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Account
        User::create([
            'name' => 'Super Admin',
            'email' => 'super@licortech.com',
            'password' => Hash::make('Thanhtienn@150819921'),
            'email_verification_token' => Str::random(20),
            'email_verified_at' => now(),
            'remember_token' => Str::random(20),
            'super_flg'=> 1,
            'admin_flg' => 1,
            'content_flg' => 1
        ]);
        User::create([
            'name' => 'Admin Account',
            'email' => 'admin@licortech.com',
            'password' => Hash::make('licortech@123'),
            'email_verification_token' => Str::random(20),
            'email_verified_at' => now(),
            'remember_token' => Str::random(20),
            'super_flg'=> 0,
            'admin_flg' => 1,
            'content_flg' => 1
        ]);

        // Pages
        $homePage = Page::create([
            'code' => 'home',
            'name' => 'Trang chủ',
            'head_title' => 'Trang chủ',
            'route' => '',
            'active_flg' => 1,
        ]);
        $aboutPage = Page::create([
            'code' => 'about',
            'name' => 'Về chúng tôi',
            'head_title' => 'Về chúng tôi',
            'route' => 'about',
            'active_flg' => 1,
        ]);
        $newsPage = Page::create([
            'code' => 'news',
            'name' => 'Tin tức',
            'head_title' => 'Tin tức',
            'route' => 'blog',
            'active_flg' => 1,
        ]);
        $contactPage = Page::create([
            'code' => 'contact',
            'name' => 'Liên hệ',
            'head_title' => 'Liên hệ',
            'route' => 'lien-he',
            'active_flg' => 1,
        ]);

        // Sections
        $homeSection1 = Section::create([
            'code' => 'home_banner',
            'name' => 'Banner',
        ]);
        PageSection::create([
            'page_id' => $homePage->id,
            'section_id' => $homeSection1->id,
        ]);
        Text::create([
            'section_id' => $homeSection1->id,
            'title' => 'Hello World',
            'list_dsp' => ['title', 'sub_title', 'content', 'sub_title_2', 'content_2', 'image']
        ]);
        Button::create([
            'section_id' => $homeSection1->id,
            'code' => 'btn_home_1_1',
            'text' => 'Sample Button',
            'order_dsp' => 1,
        ]);
        Image::create([
            'section_id' => $homeSection1->id,
            'code' => 'img_home_1_1',
            'order_dsp' => 1,
            'list_dsp' => ['name', 'content', 'redirect']
        ]);

        // Nav
        NavBar::create([
            'name' => 'Trang chủ',
            'page_id' => $homePage->id,
            'order_dsp' => 1,
        ]);
        NavBar::create([
            'name' => 'Về chúng tôi',
            'order_dsp' => 2,
        ]);
        $serviceNav = NavBar::create([
            'name' => 'Dịch vụ',
            'order_dsp' => 3,
        ]);
        NavBar::create([
            'name' => 'Dịch vụ A',
            'parent_id' => $serviceNav->id,
            'order_dsp' => 1,
        ]);
        NavBar::create([
            'name' => 'Dịch vụ B',
            'parent_id' => $serviceNav->id,
            'order_dsp' => 2,
        ]);
        NavBar::create([
            'name' => 'Tin tức',
            'page_id' => $newsPage->id,
            'order_dsp' => 4,
        ]);
        NavBar::create([
            'name' => 'Liên hệ',
            'page_id' => $contactPage->id,
            'order_dsp' => 7,
        ]);

        // Office
        Office::create([
            'name' => 'Sample Company',
            'address_1' => '1 Lorem ipsum dolor sit amitm, ...',
            'phone_1' => '00 88 99 88 33',
            'email_1' => 'sample@smaplecompany.com',
        ]);

        // Add more data for CMS
        $this->call([
            CMSDataSeeder::class
        ]);
    }
}
