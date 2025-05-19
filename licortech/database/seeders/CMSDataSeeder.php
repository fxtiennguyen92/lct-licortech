<?php

namespace Database\Seeders;

use App\Models\Button;
use App\Models\Language;
use App\Models\NavBar;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\Section;
use App\Models\SysCommon;
use App\Models\Text;
use Illuminate\Database\Seeder;

class CMSDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // System common vars
        SysCommon::create([
            'code' => 'copyright',
            'value' => 'Copyright © 2024'
        ]);
        SysCommon::create([
            'code' => 'web_name',
            'value' => 'Licortech',
        ]);
        SysCommon::create([
            'code' => 'web_name_before',
            'value' => '1',
        ]);
        SysCommon::create([
            'code' => 'web_name_separator_symbol',
            'value' => '|',
        ]);
        SysCommon::create([
            'code' => 'web_icon',
            'value' => 'favicon.ico',
        ]);
        SysCommon::create([
            'code' => 'web_logo',
            'value' => 'logo.svg',
        ]);
        SysCommon::create([
            'code' => 'has_web_logo_2',
            'value' => false,
        ]);
        SysCommon::create([
            'code' => 'web_logo_2',
            'value' => '',
        ]);
        SysCommon::create([
            'code' => 'src_tag_head',
            'value' => '',
        ]);
        SysCommon::create([
            'code' => 'src_tag_body_top',
            'value' => '',
        ]);
        SysCommon::create([
            'code' => 'src_tag_body_bottom',
            'value' => '',
        ]);
        SysCommon::create([
            'code' => 'has_footer_text',
            'value' => true,
        ]);
        SysCommon::create([
            'code' => 'footer_text',
            'value' => 'Lorem ipsum dolor sit amit,consectetur eiusmdd tempory incididunt ut labore et dolore magna elit',
        ]);
        SysCommon::create([
            'code' => 'facebook',
            'value' => '######',
        ]);
        SysCommon::create([
            'code' => 'instagram',
            'value' => '######',
        ]);
        SysCommon::create([
            'code' => 'youtube',
            'value' => '######',
        ]);
        SysCommon::create([
            'code' => 'show_web_name_in_cms',
            'value' => true,
        ]);
        SysCommon::create([
            'code' => 'multi_language',
            'value' => true,
        ]);

        // Login layout
        $loginPage = Page::create([
            'code' => 'login',
            'name' => 'Sign In',
            'head_title' => 'Sign In',
            'route' => 'login',
            'active_flg' => 1,
            'cms_flg' => 1
        ]);
        $loginSection = Section::create([
            'code' => 'login_view',
            'name' => 'Login View',
        ]);
        PageSection::create([
            'page_id' => $loginPage->id,
            'section_id' => $loginSection->id,
        ]);
        Text::create([
            'section_id' => $loginSection->id,
            'title' => 'Content Management',
            'list_dsp' => ['title'],
        ]);
        Button::create([
            'section_id' => $loginSection->id,
            'code' => 'btn_login',
            'text' => 'Sign In',
        ]);

        // CMS Layouts
        $dashboardPage = Page::create([
            'code' => 'dashboard',
            'name' => 'Dashboard',
            'head_title' => 'Dashboard',
            'route' => 'cms.dashboard',
            'active_flg' => 1,
            'cms_flg' => 1,
        ]);
        $systemPage = Page::create([
            'code' => 'system',
            'name' => 'System',
            'head_title' => 'System Settings',
            'route' => 'cms.system',
            'active_flg' => 1,
            'cms_flg' => 1,
        ]);
        $commonInfoPage = Page::create([
            'code' => 'info',
            'name' => 'General Info',
            'head_title' => 'General Info',
            'route' => 'cms.info',
            'active_flg' => 1,
            'cms_flg' => 1,
        ]);
        $pagePage = Page::create([
            'code' => 'pages',
            'name' => 'Pages',
            'head_title' => 'Pages',
            'route' => 'cms.pages',
            'active_flg' => 1,
            'cms_flg' => 1,
        ]);
        $navPage = Page::create([
            'code' => 'navbars',
            'name' => 'Navigator',
            'head_title' => 'Navigator',
            'route' => 'cms.navbars',
            'active_flg' => 1,
            'cms_flg' => 1,
        ]);
        $contentPage = Page::create([
            'code' => 'content',
            'name' => 'Content',
            'head_title' => 'Content',
            'route' => 'cms.content',
            'active_flg' => 1,
            'cms_flg' => 1,
        ]);
        $seoPage = Page::create([
            'code' => 'seo',
            'name' => 'SEO Tag',
            'head_title' => 'SEO Tag',
            'route' => 'cms.seo',
            'active_flg' => 1,
            'cms_flg' => 1,
        ]);
        $scriptPage = Page::create([
            'code' => 'script',
            'name' => 'Script',
            'head_title' => 'Script',
            'route' => 'cms.script',
            'active_flg' => 1,
            'cms_flg' => 1,
        ]);
        $contactPage = Page::create([
            'code' => 'client-contact',
            'name' => 'Clients',
            'head_title' => 'Clients',
            'route' => 'cms.contact',
            'active_flg' => 1,
            'cms_flg' => 1,
        ]);

        // Nav
        NavBar::create([
            'name' => 'Dashboard',
            'name_en' => 'Dashboard',
            'name_fr' => 'Tableau de bord',
            'page_id' => $dashboardPage->id,
            'order_dsp' => 1,
            'cms_flg' => 1,
            'icon' => 'fe fe-grid',
            'content_flg' => 1,
        ]);
        NavBar::create([
            'name' => 'System',
            'name_en' => 'System',
            'name_fr' => 'Système',
            'page_id' => $systemPage->id,
            'order_dsp' => 2,
            'cms_flg' => 1,
            'icon' => 'fe fe-git-pull-request',
        ]);
        NavBar::create([
            'name' => 'Overview',
            'name_en' => 'Overview',
            'name_fr' => 'Aperçu',
            'page_id' => $commonInfoPage->id,
            'order_dsp' => 3,
            'cms_flg' => 1,
            'icon' => 'fe fe-layout',
            'content_flg' => 1,
        ]);
        NavBar::create([
            'name' => 'Pages',
            'name_en' => 'Pages',
            'name_fr' => 'Pages',
            'page_id' => $pagePage->id,
            'order_dsp' => 5,
            'cms_flg' => 1,
            'icon' => 'fe fe-layers',
        ]);
        NavBar::create([
            'name' => 'Navigator',
            'name_en' => 'Navigator',
            'name_fr' => 'Barre de menu',
            'page_id' => $navPage->id,
            'order_dsp' => 6,
            'cms_flg' => 1,
            'icon' => 'fe fe-menu',
        ]);
        NavBar::create([
            'name' => 'Content',
            'name_en' => 'Content',
            'name_fr' => 'Contenu',
            'page_id' => $contentPage->id,
            'order_dsp' => 7,
            'cms_flg' => 1,
            'icon' => 'fe fe-type',
            'content_flg' => 1,
        ]);
        NavBar::create([
            'name' => 'SEO',
            'name_en' => 'SEO',
            'name_fr' => 'SEO',
            'page_id' => $seoPage->id,
            'order_dsp' => 8,
            'cms_flg' => 1,
            'icon' => 'fe fe-trending-up',
            'content_flg' => 1,
        ]);
        NavBar::create([
            'name' => 'Script',
            'name_en' => 'Script',
            'name_fr' => 'Script',
            'page_id' => $scriptPage->id,
            'order_dsp' => 9,
            'cms_flg' => 1,
            'icon' => 'fe fe-terminal',
            'content_flg' => 1,
        ]);

        // Languages
        Language::create([
            'code' => 'vi',
            'name' => 'Tiếng Việt',
            'default_db_flg' => true,
        ]);
        Language::create([
            'code' => 'en',
            'name' => 'English',
            'order_dsp' => 2
        ]);
        Language::create([
            'code' => 'fr',
            'name' => 'Français',
            'order_dsp' => 3,
        ]);
    }
}
