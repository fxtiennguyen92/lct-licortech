<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AccountController extends Controller
{
    public function view()
    {
        return view('cms.accounts.list', array(
            'list' => User::get(),
        ));
    }

    public function resetPassword($id)
    {
        if (Auth::user()->id == $id) {
            abort(404);
        }

        try {
            $tempPass = strtoupper(bin2hex(random_bytes(5)));

            $user = User::find($id);
            if (!$user) {
                abort(404);
            }

            $user->password_temp = $tempPass;
            $user->password = Hash::make($tempPass);
            $user->save();

            return redirect()->back()->with('info', trans('message.update_success'));
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function editPassword()
    {
        return view('cms.accounts.edit-password');
    }

    public function changePassword(Request $request)
    {
        $validator = $this->validateInput($request->except('_token'));
        if ($validator->fails()) {
            return redirect()->back()->with('error', $validator->errors()->first());
        }

        try {
            $user = User::find(Auth::user()->id);
            if (!$user) {
                abort(404);
            }

            $user->password_temp = null;
            $user->password = Hash::make($request->password);
            $user->save();

            return redirect()->back()->with('info', trans('message.update_success'));
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Validate reset password
     *
     * @param array $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validateInput(array $data)
    {
        $rules = [
            'password' => 'required|min:8|max:100',
        ];

        $messages = [
            'password.required' => trans('validation.required', ['attribute' => trans('cms.password')]),
            'password.min' => trans('validation.min.string', ['attribute' => trans('cms.password'), 'min' => 8]),
            'password.max' => trans('validation.max.string', ['attribute' => trans('cms.password'), 'max' => 100]),
        ];

        $validator = Validator::make($data, $rules, $messages);
        return $validator;
    }
}
