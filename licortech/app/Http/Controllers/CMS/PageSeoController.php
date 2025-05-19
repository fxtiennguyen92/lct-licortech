<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\SeoTag;
use Illuminate\Http\Request;

class PageSeoController extends Controller
{
    public function viewPageList(Request $request)
    {
        return view('cms.seo.page-list', array(
            'page' => Page::getByCode('seo'),
            'list' => Page::getListForContent(),
        ));
    }

    public function view(int $id)
    {
        $data = Page::find($id);
        if (!$data) {
            abort(404);
        }

        $seo = SeoTag::getByPage($data->id);
        if (sizeof($seo) <= 0) {
            SeoTag::create([
                'page_id' => $data->id,
                'name' => 'description',
                'content' => 'Web description'
            ]);
            SeoTag::create([
                'page_id' => $data->id,
                'name' => 'keywords',
                'content' => 'Web keywords'
            ]);
            SeoTag::create([
                'page_id' => $data->id,
                'property' => 'og:image',
                'content' => '',
            ]);
        }

        return view('cms.seo.edit', array(
            'page' => Page::getByCode('seo'),
            'data' => Page::getByCode($data->code)
        ));
    }

    public function update(int $id, Request $request)
    {
        $page = Page::find($id);
        if (!$page) {
            abort(404);
        }

        if ($request->has('image')) {
            $seoTagImage = SeoTag::getByPageAndProperty($id, 'og:image');
            if (is_uploaded_file($request->image)) {
                // Save file
                $fileName = config('app.prefix_upload_image') . '_og_image_'. time() . '.' . $request->image->extension();
                $request->image->move(public_path(config('app.upload_image_folder_dir')), $fileName);

                // Delete the old file
                if ($seoTagImage->content && file_exists(public_path($seoTagImage->content))) {
                    unlink(public_path($seoTagImage->content));
                }

                // Save data
                $seoTagImage->content = config('app.upload_image_folder_dir') . '/' . $fileName;
                $seoTagImage->save();
            }
        }

        $seoTagList = SeoTag::getByPage($id);
        try {
            foreach ($seoTagList as $seoTag)
            if ($request->has('seo_'.$seoTag->id)) {
                $seoTag->content = $request->{'seo_'.$seoTag->id};
                $seoTag->save();
            }
            return redirect()->back()->with('info', trans('message.update_success'));
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
