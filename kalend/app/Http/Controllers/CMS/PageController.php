<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Language;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class PageController extends Controller
{
    public function view(Request $request)
    {
        // Get search text and page
        $search = '';
        $page = 1;
        if ($request->has('search')) {
            $search = $request->search;
        }
        if ($request->has('page')) {
            $page = intval($request->page);
            $page = ($page == 0) ? 1 : $page;
        }

        return view('cms.pages.list', array(
            'page' => Page::getByCode('pages'),
            'list' => Page::getAll(),
        ));
    }

    public function new()
    {
        return view('cms.pages.new', array(
            'page' => Page::getByCode('pages'),
        ));
    }

    public function create(Request $request)
    {
        // Validation
        $validator = $this->validateInput($request->except('_token'));
        if ($validator->fails()) {
            return redirect()->back()->withInput()->with('error', $validator->errors()->first());
        }

        // Create
        try {
            $data = Page::create([
                'code' => $request->code,
                'name' => $request->name,
                'head_title' => $request->head_title,
                'route' => $request->route,
                'order_dsp' => (int) $request->order_dsp,
                'active_flg' => ($request->has('active_flg') ? 1 : 0),
                'cms_flg' => ($request->has('cms_flg') ? 1 : 0),
            ]);
            return redirect()->route('cms.pages.edit', $data->id)->with('info', trans('message.create_success'));
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return redirect()->back()->withInput()->with('error', $e->getMessage());
        }
    }

    public function edit(int $id)
    {
        $data = Page::find($id);
        if (!$data) {
            abort(404);
        }

        return view('cms.pages.edit', array(
            'page' => Page::getByCode('pages'),
            'data' => $data
        ));
    }

    public function update(int $id, Request $request)
    {
        $data = Page::find($id);
        if (!$data) {
            abort(404);
        }

        // Validation
        $validator = $this->validateInput($request->except('_token'), $id);
        if ($validator->fails()) {
            return redirect()->back()->withInput()->with('error', $validator->errors()->first());
        }

        // Get current language code
        $curLanguage = Language::getCodeForView(App::getLocale());
        // Update
        try {
            $data->code = $request->code;
            $data->{'name' . $curLanguage} = $request->name;
            $data->{'head_title' . $curLanguage} = $request->head_title;
            $data->route = $request->route;
            $data->order_dsp = (int) $request->order_dsp;
            $data->active_flg = ($request->has('active_flg') ? 1 : 0);
            $data->cms_flg = ($request->has('cms_flg') ? 1 : 0);
            $data->save();

            return redirect()->back()->withInput()->with('success', trans('message.update_success'));
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', $e->getMessage());
        }
    }

    public function delete(int $id)
    {
        $data = Page::withTrashed()->find($id);
        if (!$data) {
            abort(404);
        }

        // Restore
        if ($data->trashed()) {
            $data->restore();
            return redirect()->back()->with('info', trans('message.restore_success'));
        }

        // Delete
        $data->delete();
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

        $uniqueRule = '';
        if ($currentId) {
            $uniqueRule = ',code,' . $currentId;
        }

        $rules = [
            'code' => 'required|max:50|unique:pages' . $uniqueRule,
            'name' => 'required|max:255',
            'head_title' => 'nullable|max:255',
            'route' => 'nullable|without_spaces|max:255',
            'order_dsp' => 'nullable|integer',
        ];

        $messages = [
            'code.unique' => trans('validation.unique', ['attribute' => 'Code']),
            'code.required' => trans('validation.required', ['attribute' => 'Code']),
            'code.max' => trans('validation.max.string', ['attribute' => 'Code', 'max' => 50]),

            'name.required' => trans('validation.required', ['attribute' => trans('text.name')]),
            'name.max' => trans('validation.max.string', ['attribute' => trans('text.name'), 'max' => 255]),

            'head_title.max' => trans('validation.max.string', ['attribute' => trans('text.head_title'), 'max' => 255]),

            'route.max' => trans('validation.max.string', ['attribute' => 'Route', 'max' => 255]),
            'route.without_spaces' => trans('validation.invalid', ['attribute' => 'Route']),

            'order_dsp.integer' => trans('validation.integer', ['attribute' => trans('text.order_dsp')]),
        ];

        $validator = Validator::make($data, $rules, $messages);

        return $validator;
    }
}
