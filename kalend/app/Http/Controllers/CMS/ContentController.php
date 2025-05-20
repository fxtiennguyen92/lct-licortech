<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Button;
use App\Models\Image;
use App\Models\Language;
use App\Models\Page;
use App\Models\Text;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class ContentController extends Controller
{
    public function viewPageList(Request $request)
    {
        return view('cms.content.page-list', array(
            'page' => Page::getByCode('content'),
            'list' => Page::getListForContent(), // TODO: add permission
        ));
    }

    public function view(int $id)
    {
        $data = Page::find($id);
        if (!$data) {
            abort(404);
        }

        return view('cms.content.list', array(
            'page' => Page::getByCode('content'),
            'data' => Page::getByCode($data->code)
        ));
    }

    public function update(int $id, Request $request)
    {
        $data = Page::find($id);
        if (!$data) {
            abort(404);
        }

        // Get current language code
        $curLanguage = Language::getCodeForView(App::getLocale());

        // Texts - Update
        if ($request->has('texts')) {
            $arrTextId = array_keys($request->texts);
            foreach ($arrTextId as $textId) {
                // Check exist
                $text = Text::find($textId);
                if (!$text) {
                    continue;
                }

                // Update
                $inputText = $request->texts[$textId];
                $text->{'title' . $curLanguage} = array_key_exists('title', $inputText) ? $inputText['title'] : '';
                $text->{'sub_title' . $curLanguage} = array_key_exists('sub_title', $inputText) ? $inputText['sub_title'] : '';
                $text->{'sub_title_2' . $curLanguage} = array_key_exists('sub_title_2', $inputText) ? $inputText['sub_title_2'] : '';
                $text->{'content' . $curLanguage} = array_key_exists('content', $inputText) ? $inputText['content'] : '';
                $text->{'content_2' . $curLanguage} = array_key_exists('content_2', $inputText) ? $inputText['content_2'] : '';
                $text->save();

                if (in_array('image', $text->list_dsp) && array_key_exists('image', $inputText)) {
                    if (is_uploaded_file($inputText['image'])) {
                        // Save file
                        $fileName = config('app.prefix_upload_image') . '_t' . $text->id . '_' . time() . '.' . $inputText['image']->extension();
                        $inputText['image']->move(public_path(config('app.upload_image_folder_dir')), $fileName);

                        // Delete the old file
                        if ($text->image && file_exists(public_path($text->image))) {
                            unlink(public_path($text->image));
                        }

                        // Save data
                        $text->image = config('app.upload_image_folder_dir') . '/' . $fileName;
                        $text->save();
                    }
                }
            }
        }

        // Buttons - Update
        if ($request->has('buttons')) {
            $arrButtonId = array_keys($request->buttons);
            foreach ($arrButtonId as $btnId) {
                // Check exist
                $button = Button::find($btnId);
                if (!$button) {
                    continue;
                }

                // Update
                $inputButton = $request->buttons[$btnId];
                $button->{'text' . $curLanguage} = $inputButton['text'];
                $button->redirect = $inputButton['redirect'];
                $button->save();
            }
        }

        // Images - Update
        if ($request->has('images')) {
            $arrImageId = array_keys($request->images);
            foreach ($arrImageId as $imgId) {
                // Check exist
                $image = Image::find($imgId);
                if (!$image) {
                    continue;
                }

                $inputImage = $request->images[$imgId];
                if (array_key_exists('src', $inputImage) && is_uploaded_file($inputImage['src'])) {
                    // Save file
                    $fileName = config('app.prefix_upload_image') . '_i' . $image->id . '_' . time() . '.' . $inputImage['src']->extension();
                    $inputImage['src']->move(public_path(config('app.upload_image_folder_dir')), $fileName);

                    // Delete the old file
                    if ($image->src && file_exists(public_path($image->src))) {
                        unlink(public_path($image->src));
                    }

                    // Save data
                    $image->src = config('app.upload_image_folder_dir') . '/' . $fileName;
                    $image->save();
                }

                // Update
                $image->{'name' . $curLanguage} = array_key_exists('name', $inputImage) ? $inputImage['name'] : '';
                $image->{'content' . $curLanguage} = array_key_exists('content', $inputImage) ? $inputImage['content'] : '';
                $image->redirect = array_key_exists('redirect', $inputImage) ? $inputImage['redirect'] : '';
                $image->save();
            }
        }

        return redirect()->back()->withInput()->with('success', trans('message.update_success'));
    }
}
