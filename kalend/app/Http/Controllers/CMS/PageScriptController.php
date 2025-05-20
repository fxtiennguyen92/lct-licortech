<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\SysCommon;
use Illuminate\Http\Request;

class PageScriptController extends Controller
{
    public static function view()
    {
        return view('cms.script.edit', array(
            'page' => Page::getByCode('script'),
            'data' => (object) array(
                'head' => SysCommon::getByCode('src_tag_head'),
                'body_top' => SysCommon::getByCode('src_tag_body_top'),
                'body_bottom' => SysCommon::getByCode('src_tag_body_bottom'),
            ),
        ));
    }

    public static function update(Request $request)
    {
        if (!$request->has('src_tag_head')) {
            abort(404);
        }

        try {
            if ($request->has('src_tag_head')) {
                $syscommon = SysCommon::getByCode('src_tag_head');
                $syscommon->value = $request->src_tag_head;
                $syscommon->save();
            }

            if ($request->has('src_tag_body_top')) {
                $syscommon = SysCommon::getByCode('src_tag_body_top');
                $syscommon->value = $request->src_tag_body_top;
                $syscommon->save();
            }

            if ($request->has('src_tag_body_bottom')) {
                $syscommon = SysCommon::getByCode('src_tag_body_bottom');
                $syscommon->value = $request->src_tag_body_bottom;
                $syscommon->save();
            }

            return redirect()->back()->withInput()->with('success', trans('message.update_success'));
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', $e->getMessage());
        }
    }
}
