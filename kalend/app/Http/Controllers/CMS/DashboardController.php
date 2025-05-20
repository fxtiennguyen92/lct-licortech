<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\ClientContact;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function view()
    {
        return view('cms.dashboard', array(
            'total' => ClientContact::where('status', 1)->count(),
            'unreply' => ClientContact::where('type', 0)->where('status', 0)->count(),
            'reserve' => ClientContact::where('type', 1)->where('status', 0)->count(),
        ));
    }
}
