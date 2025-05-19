<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\SysCommon;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;

class LoginController extends Controller
{
    public function view()
    {
        Auth::logout();

        return view('auth.login', array(
            'page' => Page::getByCode('login')
        ));
    }

    /**
     * Login
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function login(Request $request)
    {
        try {
            // Validate
            $validator = $this->validateInput($request->only('email', 'password'));
            if ($validator->fails()) {
                return redirect()->back()->with('error', $validator->errors()->first())
                    ->withInput($request->except('password'));
            }

            // Authenticate
            $credentials = $request->only('email', 'password');
            if (Auth::attempt($credentials)) {
                User::updateSignInDatetime(Auth::user()->id);
                return redirect('cms/dashboard');
            }

            // Unauthorized
            return redirect()->back()->with('error', trans('auth.failed'))
                ->withInput($request->except('password'));
        } catch (\Exception $e) {
            return redirect()->back()->with('error', trans('message.error_system'))
                ->withInput($request->except('password'));
        }
    }

    /**
     * Logout
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function logout()
    {
        Session::flush();
        Auth::logout();
        return redirect()->route('login');
    }

    /**
     * Validation
     *
     * @param array $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validateInput(array $data)
    {
        $rules = [
            'email' => 'required|email|max:255',
            'password' => 'required|max:255',
        ];

        $messages = [
            'email.required' => trans('validation.required', ['attribute' => trans('cms.email')]),
            'email.email' => trans('validation.email'),
            'email.max' => trans('validation.required', ['attribute' => trans('cms.email')]),
            'password.required' => trans('validation.required', ['attribute' => trans('cms.password')]),
            'password.max' => trans('validation.required', ['attribute' => trans('cms.password')]),
        ];

        $validator = Validator::make($data, $rules, $messages);

        return $validator;
    }
}
