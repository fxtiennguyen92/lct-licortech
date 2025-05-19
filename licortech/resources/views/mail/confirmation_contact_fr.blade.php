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
                            <p>Bonjour <b>{{ $contact->name }}</b>,</p>
                            @if ($contact->type == 1)
                                <p style="margin-bottom:20px">Nous vous confirmons que votre demande d'appel a été enregistrée.
                                </p>

                                <p style="margin-left:20px">Téléphone:
                                    <b>{{ $contact->phone }}</b>
                                </p>
                                <p style="margin-left:20px">Date : <b>{{ $contact->reserved_at->format('d-m-Y') }}</b></p>
                                <p style="margin-left:20px">Heure : <b>{{ $contact->reserved_at->format('H:i A') }}</b></p>
                                <p style="margin-left:20px">Durée : <b>60 mins</b></p>
                            @else
                                <p>Nous vous confirmons que votre message a bien été reçu. Nous reviendrons vers vous le plus rapidement possible.</p>
                            @endif
                            <p style="margin: 20px 0 0 0">Nous vous remercions de votre confiance,</p>
                            <p style="margin: 0">L’équipe Licortech </p>
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
