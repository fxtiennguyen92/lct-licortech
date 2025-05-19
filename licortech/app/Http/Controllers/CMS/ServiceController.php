<?php

namespace App\Http\Controllers\CMS;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Language;
use App\Models\Page;
use App\Models\Service;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ServiceController extends Controller
{
    public function view(Request $request)
    {
        return view('cms.services.list', array(
            'page' => Page::getByCode('services'),
            'list' => Service::getAll(),
        ));
    }

    public function create(Request $request)
    {
        $validator = $this->validateInput($request->except('_token'));
        if ($validator->fails()) {
            return redirect()->back()->withInput()->with('error', $validator->errors()->first());
        }

        $curLanguage = Language::getCodeForView(App::getLocale());
        try {
            $service = Service::create([
                'route' => $request->route,
                'order_dsp' => $request->order_dsp,
            ]);

            $service->{'name' . $curLanguage} = $request->name;
            $service->{'short_description' . $curLanguage} = $request->short_description;

            if (is_uploaded_file($request->image)) {
                $fileName = config('app.prefix_upload_image') . '_service_' . $service->route . time() . '.' . $request->image->extension();
                $request->image->move(public_path(config('app.upload_image_folder_dir')), $fileName);

                // Save data
                $service->image = config('app.upload_image_folder_dir') . '/' . $fileName;
            }
            $service->save();

            return redirect()->back()->with('info', __('message.create_success'));
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return redirect()->back()->withInput()->with('error', $e->getMessage());
        }
    }

    public function update($id, Request $request)
    {
        $service = Service::find($id);
        if (!$service) {
            return abort(404);
        }

        $validator = $this->validateInput($request->except('_token'), $id);
        if ($validator->fails()) {
            return redirect()->back()->with('error', $validator->errors()->first());
        }

        $curLanguage = Language::getCodeForView(App::getLocale());
        try {
            $service->route = $request->route;
            $service->order_dsp = $request->order_dsp;

            $service->{'name' . $curLanguage} = $request->name;
            $service->{'short_description' . $curLanguage} = $request->short_description;

            if (is_uploaded_file($request->image)) {
                $fileName = config('app.prefix_upload_image') . '_service_' . $service->route . time() . '.' . $request->image->extension();
                $request->image->move(public_path(config('app.upload_image_folder_dir')), $fileName);

                // Delete the old file
                if ($service->image && file_exists(public_path($service->image))) {
                    unlink(public_path($service->image));
                }

                // Save data
                $service->image = config('app.upload_image_folder_dir') . '/' . $fileName;
            }
            $service->save();

            return redirect()->back()->with('info', __('message.update_success'));
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return redirect()->back()->with('error', __('message.update_failed'));
        }
    }

    protected function validateInput(array $data, int $currentId = null)
    {
        Validator::extend('without_spaces', function ($attr, $value) {
            return preg_match('/^\S*$/u', $value);
        });

        $uniqueRule = '';
        if ($currentId) {
            $uniqueRule = ',route,' . $currentId;
        }

        $rules = [
            'name' => 'nullable|max:250',
            'route' => 'required|without_spaces|max:100|unique:services' . $uniqueRule,
            'order_dsp' => 'nullable|integer',
        ];

        $messages = [
            'name.max' => __('validation.max.string', ['attribute' => __('text.name')]),

            'route.unique' => __('validation.unique'),
            'route.max' => __('validation.max.string'),
            'route.without_spaces' => __('validation.invalid'),

            'order_dsp.integer' => __('validation.integer', ['attribute' => __('text.order_dsp')]),
        ];

        $validator = Validator::make($data, $rules, $messages);

        return $validator;
    }
}
