<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Office;
use App\Models\Page;
use App\Models\SysCommon;
use Illuminate\Http\Request;

class PageInfoController extends Controller
{
    public static function view()
    {
        return view('cms.content.info', array(
            'page' => Page::getByCode('info'),
            'data' => (object) array(
                'web_name' => SysCommon::getByCode('web_name'),
                'web_icon' => SysCommon::getByCode('web_icon'),
                'web_logo' => SysCommon::getByCode('web_logo'),
                'web_logo_2' => SysCommon::getByCode('web_logo_2'),
                'footer_text' => SysCommon::getByCode('footer_text'),
                'facebook' => SysCommon::getByCode('facebook'),
                'x' => SysCommon::getByCode('x'),
                'linkedin' => SysCommon::getByCode('linkedin'),
                'offices' => Office::get(),
            ),
        ));
    }

    public static function update(Request $request)
    {
        try {
            // Icon
            if (is_uploaded_file($request->web_icon)) {
                // Save file
                $fileName = config('app.prefix_upload_image') . '_icon_'. time() . '.' . $request->web_icon->extension();
                $request->web_icon->move(public_path(config('app.upload_image_folder_dir')), $fileName);

                $icon = SysCommon::getByCode('web_icon');

                // Delete the old file
                if ($icon->value && file_exists(public_path($icon->value))) {
                    unlink(public_path($icon->value));
                }

                // Save data
                $icon->value = config('app.upload_image_folder_dir') . '/' . $fileName;
                $icon->save();
            }

            // Web logo
            if (is_uploaded_file($request->web_logo)) {
                // Save file
                $fileName = config('app.prefix_upload_image') . '_logo_'. time() . '.' . $request->web_logo->extension();
                $request->web_logo->move(public_path(config('app.upload_image_folder_dir')), $fileName);

                $logo = SysCommon::getByCode('web_logo');

                // Delete the old file
                if ($logo->value && file_exists(public_path($logo->value))) {
                    unlink(public_path($logo->value));
                }

                // Save data
                $logo->value = config('app.upload_image_folder_dir') . '/' . $fileName;
                $logo->save();
            }

            // Web logo 2
            if (is_uploaded_file($request->web_logo_2)) {
                // Save file
                $fileName = config('app.prefix_upload_image') . '_logo_2_'. time() . '.' . $request->web_logo_2->extension();
                $request->web_logo_2->move(public_path(config('app.upload_image_folder_dir')), $fileName);

                $logo = SysCommon::getByCode('web_logo_2');

                // Delete the old file
                if ($logo->value && file_exists(public_path($logo->value))) {
                    unlink(public_path($logo->value));
                }

                // Save data
                $logo->value = config('app.upload_image_folder_dir') . '/' . $fileName;
                $logo->save();
            }

            if ($request->has('web_name')) {
                $syscommon = SysCommon::getByCode('web_name');
                $syscommon->value = $request->web_name;
                $syscommon->save();
            }

            if ($request->has('facebook')) {
                $syscommon = SysCommon::getByCode('facebook');
                $syscommon->value = $request->facebook;
                $syscommon->save();
            }

            if ($request->has('instagram')) {
                $syscommon = SysCommon::getByCode('instagram');
                $syscommon->value = $request->instagram;
                $syscommon->save();
            }

            if ($request->has('youtube')) {
                $syscommon = SysCommon::getByCode('youtube');
                $syscommon->value = $request->youtube;
                $syscommon->save();
            }

            if ($request->has('footer_text')) {
                $syscommon = SysCommon::getByCode('footer_text');
                $syscommon->value = $request->footer_text;
                $syscommon->save();
            }

            return redirect()->back()->withInput()->with('success', trans('message.update_success'));
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', $e->getMessage());
        }
    }

    public static function updateOffice(int $id, Request $request)
    {
        $data = Office::find($id);
        if (!$data) {
            abort(404);
        }


        try {
            $data->name = $request->name;
            $data->sub_name = $request->sub_name;
            $data->address_1 = $request->address_1;
            $data->address_2 = $request->address_2;
            $data->phone_1 = $request->phone_1;
            $data->phone_2 = $request->phone_2;
            $data->email_1 = $request->email_1;
            $data->email_2 = $request->email_2;
            $data->save();

            return redirect()->back()->withInput()->with('success', trans('message.update_success'));
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', $e->getMessage());
        }
    }
}
