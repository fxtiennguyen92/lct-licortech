<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    public function viewBlog()
    {
        return view('cms.blog.list', array(
            'page' => Page::getByCode('blog'),
            'list' => Post::getAllByAdmin()
        ));
    }

    public function new()
    {
        return view('cms.blog.new', array(
            'page' => Page::getByCode('blog'),
        ));
    }

    public function create(Request $request)
    {
        try {
            $post = Post::create([
                'title' => $request->title,
                'route' => $request->route,
                'content' => $request->content,
                'meta_description' => $request->meta_description,
                'meta_keywords' => $request->meta_keywords,
                'meta_tags' => $request->meta_tags,
                'active_flg' => ($request->has('active_flg') ? 1 : 0),
                'featured_flg' => ($request->has('featured_flg') ? 1 : 0),
                'user_id' => Auth::user()->id,
            ]);

            if ($request->has('image')) {
                if (is_uploaded_file($request->image)) {
                    // Save file
                    $fileName = config('app.prefix_upload_image') . '_post_' . time() . '.' . $request->image->extension();
                    $request->image->move(public_path(config('app.upload_image_folder_dir')), $fileName);

                    // Save data
                    $post->image = config('app.upload_image_folder_dir') . '/' . $fileName;
                    $post->save();
                }
            }

            return redirect()->route('cms.post.edit', $post->id)->with('info', trans('message.create_success'));
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', $e->getMessage());
        }
    }

    public function edit(int $id)
    {
        $data = Post::find($id);
        if (!$data) {
            abort(404);
        }

        return view('cms.blog.edit', array(
            'page' => Page::getByCode('blog'),
            'data' => $data
        ));
    }

    public function update(int $id, Request $request)
    {
        $post = Post::find($id);
        if (!$post) {
            abort(404);
        }

        try {
                $post->title = $request->title;
                $post->route = $request->route;
                $post->content = $request->content;
                $post->meta_description = $request->meta_description;
                $post->meta_keywords = $request->meta_keywords;
                $post->meta_tags = $request->meta_tags;
                $post->active_flg = ($request->has('active_flg') ? 1 : 0);
                $post->featured_flg = ($request->has('featured_flg') ? 1 : 0);
                $post->user_id = Auth::user()->id;
                $post->save();

            if ($request->has('image')) {
                if (is_uploaded_file($request->image)) {
                    // Save file
                    $fileName = config('app.prefix_upload_image') . '_post_'. time() . '.' . $request->image->extension();
                    $request->image->move(public_path(config('app.upload_image_folder_dir')), $fileName);

                    // Delete the old file
                    if ($post->image && file_exists(public_path($post->image))) {
                        unlink(public_path($post->image));
                    }

                    // Save data
                    $post->image = config('app.upload_image_folder_dir') . '/' . $fileName;
                    $post->save();
                }
            }

            return redirect()->route('cms.post.edit', $post->id)->with('info', trans('message.update_success'));
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', $e->getMessage());
        }
    }

    public function delete(int $id)
    {
        $post = Post::find($id);
        if (!$post) {
            abort(404);
        }

        $post->forceDelete();
        return redirect()->back()->with('info', trans('message.delete_success'));
    }
}

