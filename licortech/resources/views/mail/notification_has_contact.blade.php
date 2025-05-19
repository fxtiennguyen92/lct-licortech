<div
    style="font-family:Google Sans,Roboto,Helvetica Neue,Helvetica,Arial,sans-serif;color:#3c4043;line-height:1.5;font-size:14px; width: 100%; background: #f2f4f8; padding: 50px 20px;">
    <div style="max-width:700px; margin: 0px auto; font-size: 14px">
        <table style="border-collapse: collapse; border: 0; width: 100%; margin-bottom: 20px">
            <tbody>
                <tr>
                    <td style="vertical-align: top;">
                        <img src="{{ $logo }}" alt="{{ config('app.name') }}" style="height: 40px">
                    </td>
                </tr>
            </tbody>
        </table>

        <div style="padding: 40px 40px 20px 40px; background: #fff;">
            <table style="border-collapse: collapse; border: 0; width: 100%;">
                <tbody>
                    <tr>
                        <td>
                            <p>Hi <b>Licortech team</b>,</p>
                            <p style="margin-bottom:20px">There is new client contact, please check and reply!.
                            </p>
                            @if ($contact->type == 1)
                                <p style="margin-left:20px"><b>Reserver a call</b></p>
                                <p style="margin-left:20px">Name:
                                    <b>{{ $contact->name }}</b>
                                </p>
                                <p style="margin-left:20px">Phone:
                                    <b>{{ $contact->phone }}</b>
                                </p>
                                <p style="margin-left:20px">Date: <b>{{ $contact->reserved_at->format('d-m-Y') }}</b>
                                </p>
                                <p style="margin-left:20px">Time: <b>{{ $contact->reserved_at->format('H:i A') }}</b>
                                </p>
                                <p style="margin-left:20px">Duration: <b>60 mins</b></p>
                            @else
                                <p style="margin-left:20px"><b>Message</b></p>
                                <p style="margin-left:20px">Name:
                                    <b>{{ $contact->name }}</b>
                                </p>
                                <p style="margin-left:20px">
                                    {{ $contact->content }}
                                </p>
                            @endif
                            <p style="margin-left:20px">UTC: <b>{{ config('regions.utc.' . $contact->country_code) }}</b>
                            </p>
                            <p style="margin: 20px 0 0 0">Sincerely,</p>
                            <p style="margin: 0">Licortech System</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div style="text-align: center; font-size: 12px; color: #a09bb9; margin-top: 20px">
            <p>
                © {{ now()->year }} {{ config('app.name') }}
            </p>
        </div>
    </div>
</div>
