<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\SysCommon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class SystemController extends Controller
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

        return view('cms.system.list', array(
            'page' => Page::getByCode('system'),
            'list' => SysCommon::getList($search, $page)
        ));
    }

    public function new()
    {
        return view('cms.system.new', array(
            'page' => Page::getByCode('system'),
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
            $data = SysCommon::create([
                'code' => $request->code,
                'value' => $request->value
            ]);
            return redirect()->route('cms.system.edit', $data->id)->with('info', trans('message.create_success'));
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return redirect()->back()->withInput()->with('error', $e->getMessage());
        }
    }

    public function edit(int $id)
    {
        $data = SysCommon::find($id);
        if (!$data) {
            abort(404);
        }

        return view('cms.system.edit', array(
            'page' => Page::getByCode('system'),
            'data' => $data
        ));
    }

    public function update(int $id, Request $request)
    {
        $data = SysCommon::find($id);
        if (!$data || !$request->has('code') || !$request->has('value')) {
            abort(404);
        }

        // Validation
        $validator = $this->validateInput($request->only('code', 'value'), $id);
        if ($validator->fails()) {
            return redirect()->back()->withInput()->with('error', $validator->errors()->first());
        }

        // Update
        try {
            $data->code = $request->code;
            $data->value = $request->value;
            $data->save();

            return redirect()->back()->withInput()->with('success', trans('message.update_success'));
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', $e->getMessage());
        }
    }

    public function delete(int $id)
    {
        $data = SysCommon::withTrashed()->find($id);
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
        $uniqueRule = '';
        if ($currentId) {
            $uniqueRule = ',code,' . $currentId;
        }

        $rules = [
            'code' => 'required|max:50|unique:sys_commons' . $uniqueRule,
        ];

        $messages = [
            'code.unique' => trans('validation.unique', ['attribute' => 'Code']),
            'code.required' => trans('validation.required', ['attribute' => 'Code']),
            'code.max' => trans('validation.max.string', ['attribute' => 'Code', 'max' => 50]),
        ];

        $validator = Validator::make($data, $rules, $messages);

        return $validator;
    }
}
