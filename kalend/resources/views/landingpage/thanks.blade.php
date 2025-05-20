@extends('landingpage.index_no_body')

@push('page_name')
    {{ $data->{'head_title' . $curLanguage} }}
@endpush

@push('body')
    <body class="maintenance-home">
        <div class="rts-error-section maintenance">
            <div class="section-inner">
                <img src="{{ $data->sections[0]->images[0]->src }}" width="400" alt="thanks">
                <div class="wrapper-para mt--50">
                    <h3 class="title">{{ $data->sections[0]->texts[0]->{'title' . $curLanguage} }}</h3>
                    <p class="disc">{!! $data->sections[0]->texts[0]->{'content' . $curLanguage} !!}</p>
                    <a href="{{ route('home') }}" class="rts-btn btn__long btn-primary m-auto">{{ $data->sections[0]->buttons[0]->{'text' . $curLanguage} }}</a>
                </div>
            </div>
        </div>
    </body>
@endpush
