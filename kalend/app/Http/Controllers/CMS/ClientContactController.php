<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\ClientContact;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClientContactController extends Controller
{
    public function view()
    {
        return view('cms.client-contacts.list', array(
            'page' => Page::getByCode('client-contact'),
            'list' => ClientContact::get(),
        ));
    }

    public function reply($id) {
        $client = ClientContact::find($id);
        $client->status = 1;
        $client->replied_by = Auth::user()->id;
        $client->save();

        return back()->with('success', __('message.update_success'));
    }

    public function delete($id) {
        $client = ClientContact::find($id);
        $client->delete();

        return back()->with('success', __('message.delete_success'));
    }
}
