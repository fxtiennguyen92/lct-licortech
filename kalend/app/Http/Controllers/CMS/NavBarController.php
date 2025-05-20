<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Language;
use App\Models\NavBar;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class NavBarController extends Controller
{
    public function view(Request $request)
    {
        return view('cms.navbars.list', array(
            'page' => Page::getByCode('navbars'),
            'web' => NavBar::getForLandingPage(),
            'cms' => NavBar::getForCMSPage()
        ));
    }

    public function new()
    {
        return view('cms.navbars.new', array(
            'page' => Page::getByCode('navbars'),
            'webNavBars' => NavBar::getForLandingPage(),
            'cmsNavBars' => NavBar::getForCMSPage(),
            'webPages' => Page::getAvailableList(false),
            'cmsPages' => Page::getAvailableList(true),
        ));
    }

    public function create(Request $request)
    {
        // Validation
        $validator = $this->validateInput($request->except('_token'));
        if ($validator->fails()) {
            return redirect()->back()->withInput()->with('error', $validator->errors()->first());
        }

        // Check parent menu
        $cmsFlg = ($request->has('cms_flg') ? (int) $request->cms_flg : 0);
        if ($request->parent != '') {
            $nav = NavBar::find($request->parent);
            if (!$nav) {
                return redirect()->back()->withInput()->with('error', trans('message.create_failed'));
            }

            $cmsFlg = (int) $nav->cms_flg;
        }

        // Check page id
        if ($request->page != '') {
            if (!Page::find($request->page)) {
                return redirect()->back()->withInput()->with('error', trans('message.create_failed'));
            }
        }

        // Create
        try {
            $data = NavBar::create([
                'name' => $request->name,
                'parent_id' => $request->parent,
                'page_id' => $request->page,
                'redirect' => $request->redirect,
                'icon' => $request->icon,
                'order_dsp' => (int) $request->order_dsp,
                'content_flg' => ($request->has('content_flg') ? 1 : 0),
                'cms_flg' => $cmsFlg,
            ]);
            return redirect()->route('cms.navbars.edit', $data->id)->with('info', trans('message.create_success'));
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return redirect()->back()->withInput()->with('error', $e->getMessage());
        }
    }

    public function edit(int $id)
    {
        $data = NavBar::getById($id);
        if (!$data) {
            abort(404);
        }

        return view('cms.navbars.edit', array(
            'page' => Page::getByCode('navbars'),
            'data' => $data,
            'availablePages' => Page::getAvailableList($data->cms_flg)
        ));
    }

    public function update(int $id, Request $request)
    {
        $data = NavBar::find($id);
        if (!$data) {
            abort(404);
        }

        // Validation
        $validator = $this->validateInput($request->except('_token'), $id);
        if ($validator->fails()) {
            return redirect()->back()->withInput()->with('error', $validator->errors()->first());
        }

        // Check page id
        if ($data->page_id != $request->page) {
            if (!Page::find($request->page)) {
                return redirect()->back()->withInput()->with('error', trans('message.update_failed'));
            }
        }

        // Update
        try {
            $curLanguage = Language::getCodeForView(App::getLocale());

            $data->{'name'.$curLanguage} = $request->name;
            $data->page_id = $request->page;
            $data->redirect = $request->redirect;
            $data->order_dsp = (int) $request->order_dsp;
            $data->icon = $request->icon;
            $data->content_flg = ($request->has('content_flg') ? 1 : 0);
            $data->save();

            return redirect()->back()->withInput()->with('success', trans('message.update_success'));
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', $e->getMessage());
        }
    }

    public function delete(int $id)
    {
        $data = NavBar::find($id);
        if (!$data) {
            abort(404);
        }

        // Delete
        $data->forceDelete();
        return redirect()->back()->with('info', trans('message.delete_success'));
    }

    /**
     * Validation
     */
    protected function validateInput(array $data, int $currentId = null)
    {
        Validator::extend('without_spaces', function($attr, $value){
            return preg_match('/^\S*$/u', $value);
        });

        $rules = [
            'name' => 'required|max:50',
            'redirect' => 'nullable|without_spaces|max:255',
            'icon' => 'nullable|max:100',
            'order_dsp' => 'nullable|integer',
        ];

        $messages = [
            'name.required' => trans('validation.required', ['attribute' => trans('text.name')]),
            'name.max' => trans('validation.max.string', ['attribute' => trans('text.name'), 'max' => 50]),

            'redirect.max' => trans('validation.max.string', ['attribute' => trans('text.redirect'), 'max' => 255]),
            'redirect.without_spaces' => trans('validation.invalid', ['attribute' => trans('text.redirect')]),

            'icon.max' => trans('validation.max.string', ['attribute' => trans('text.icon'), 'max' => 100]),
            'order_dsp.integer' => trans('validation.integer', ['attribute' => trans('text.order_dsp')]),
        ];

        $validator = Validator::make($data, $rules, $messages);

        return $validator;
    }
}
