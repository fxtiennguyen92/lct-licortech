<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Button;
use App\Models\Image;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\Section;
use App\Models\Text;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PageContentController extends Controller
{
    const TEXT_LIST_DSP = ["title", "sub_title", "content", "sub_title_2", "content_2", "image"];
    const IMAGE_LIST_DSP = ["name", "content", "redirect"];
    const TEXT_SAMPLE = "Lorem Ipsum";

    public function view(int $id)
    {
        $data = Page::find($id);
        if (!$data) {
            abort(404);
        }

        return view('cms.pages.content-list', array(
            'page' => Page::getByCode('content'),
            'list_dsp' => (object) array(
                'text' => $this::TEXT_LIST_DSP,
                'image' => $this::IMAGE_LIST_DSP,
            ),
            'data' => Page::getByCode($data->code)
        ));
    }

    public function update(int $id, Request $request)
    {
        $page = Page::find($id);
        if (!$page) {
            abort(404);
        }

        $section = new Section();
        if ($request->section_id) {
            // Get exist section
            $section = Section::find($request->section_id);
            if (!$section) {
                abort(404);
            }
        } else {
            // Validation
            $validator = $this->validateInput(array('code' => $request->section_code, 'name' => $request->section_name));
            if ($validator->fails()) {
                return redirect()->back()->withInput()->with('error', $validator->errors()->first());
            }

            // Create new section
            $section->code = $request->section_code;
            $section->name = $request->section_name;
            $section->save();

            PageSection::create([
                'page_id' => $page->id,
                'section_id' => $section->id
            ]);
        }

        try {
            // Texts
            $textAmount = intval($request->text_amount);
            $textListDsp = ($request->text_list_dsp) ? array_keys($request->text_list_dsp) : ["title"];
            if ($textAmount && $textAmount > 0) {
                for ($i = 1; $i <= $textAmount; $i++) {
                    Text::create([
                        'section_id' => $section->id,
                        'title' => $this::TEXT_SAMPLE,
                        'list_dsp' => $textListDsp,
                        'order_dsp' => 1
                    ]);
                }
            }

            // Buttons
            $buttonAmount = intval($request->button_amount);
            if ($buttonAmount && $buttonAmount > 0) {
                for ($i = 1; $i <= $buttonAmount; $i++) {
                    Button::create([
                        'section_id' => $section->id,
                        'text' => $this::TEXT_SAMPLE,
                        'order_dsp' => 1
                    ]);
                }
            }

            // Texts
            $imageAmount = intval($request->image_amount);
            $imageListDsp = ($request->image_list_dsp) ? array_keys($request->image_list_dsp) : [];
            if ($imageAmount && $imageAmount > 0) {
                for ($i = 1; $i <= $imageAmount; $i++) {
                    Image::create([
                        'section_id' => $section->id,
                        'list_dsp' => $imageListDsp,
                        'order_dsp' => 1
                    ]);
                }
            }

            return redirect()->back()->with('info', trans('message.update_success'));
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function deleteSection(int $sectionId)
    {
        $data = Section::find($sectionId);
        if (!$data) {
            abort(404);
        }

        // Delete
        DB::beginTransaction();
        try {
            DB::table('sections')->where('id', $data->id)->delete();
            DB::table('page_section')->where('section_id', $data->id)->delete();
            DB::table('texts')->where('section_id', $data->id)->delete();
            DB::table('buttons')->where('section_id', $data->id)->delete();
            DB::table('images')->where('section_id', $data->id)->delete();
            DB::commit();

            return redirect()->back()->with('info', trans('message.delete_success'));
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function deleteText(int $textId)
    {
        $data = Text::find($textId);
        if (!$data) {
            abort(404);
        }

        // Delete
        DB::beginTransaction();
        try {
            $data->delete();
            DB::commit();

            return redirect()->back()->with('info', trans('message.delete_success'));
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function deleteButton(int $buttonId)
    {
        $data = Button::find($buttonId);
        if (!$data) {
            abort(404);
        }

        // Delete
        DB::beginTransaction();
        try {
            $data->delete();
            DB::commit();

            return redirect()->back()->with('info', trans('message.delete_success'));
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function deleteImage(int $imageId)
    {
        $data = Image::find($imageId);
        if (!$data) {
            abort(404);
        }

        // Delete
        DB::beginTransaction();
        try {
            $data->delete();
            DB::commit();

            return redirect()->back()->with('info', trans('message.delete_success'));
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    protected function validateInput(array $data)
    {
        Validator::extend('without_spaces', function($attr, $value){
            return preg_match('/^\S*$/u', $value);
        });

        $rules = [
            'code' => 'required|without_spaces|max:150',
            'name' => 'nullable|max:250'
        ];

        $messages = [
            'code.required' => trans('validation.required', ['attribute' => 'Code']),
            'code.without_spaces' => trans('validation.invalid', ['attribute' => 'Code']),
            'code.max' => trans('validation.max.string', ['attribute' => 'Code', 'max' => 150]),

            'name.max' => trans('validation.max.string', ['attribute' => trans('text.name'), 'max' => 150]),
        ];

        $validator = Validator::make($data, $rules, $messages);

        return $validator;
    }
}
