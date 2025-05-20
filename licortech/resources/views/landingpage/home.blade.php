@extends('landingpage.index')

@push('page_name')
    {{ $data->{'head_title' . $curLanguage} }}
@endpush

@push('meta')
    <meta property="og:title" content="{{ $data->head_title }}" />
    <meta property="og:url" content="{{ config('app.url') }}" />

    @foreach ($data->seo as $seo)
        @if ($seo->name == 'description')
            <meta property="og:description" content="{{ $seo->content }}" />
            <meta name="description" content="{{ $seo->content }}" />
        @elseif ($seo->property == 'og:image')
            <meta property="og:image" content="{{ config('app.url') . $seo->content }}" />
        @else
            <meta @if ($seo->name) name="{{ $seo->name }}" @endif
                @if ($seo->property) property="{{ $seo->property }}" @endif content="{{ $seo->content }}" />
        @endif
    @endforeach
@endpush

@push('content')
    <!-- HERO BANNER ONE -->
    @php $banner = $data->sections->firstWhere('code', 'home_banner'); @endphp
    <section class="rts-hero-two rts-hero-two__bg">
        <div class="container">
            <div class="row justify-content-md-center">
                <div class="col-xl-6 col-lg-7 col-md-9 order-md-2 order-lg-0">
                    <div class="rts-hero-two__content">
                        <h1 class="title">
                            {!! $banner->texts[0]->{'content' . $curLanguage} !!}
                        </h1>
                        <div class="rts-hero-two__content--btn">
                            <a href="{{ route($banner->buttons[0]->redirect) }}"
                                class="rts-btn btn__long secondary__bg secondary__color">
                                {!! $banner->buttons[0]->{'text' . $curLanguage} !!}</a>
                            <a href="{{ route($banner->buttons[1]->redirect) }}"
                                class="rts-btn btn__long border__white white__color">
                                {!! $banner->buttons[1]->{'text' . $curLanguage} !!}</a>
                        </div>
                    </div>
                </div>
                <div class="col-xl-5 offset-xl-1 col-lg-5 col-md-10">
                    <div class="rts-hero-two__images mobile-margin-top-100">
                        <img src="images/minimize/hero__two__illustration.svg" alt="{{ $banner->code }}">
                        <img class="shape-image one left-right-top-bottom"
                            src="assets/images/banner/two/hero__two__illustration-sm1.svg" alt="{{ $banner->code }}">
                        <img class="shape-image two" src="assets/images/banner/two/hero__two__illustration-sm2.svg"
                            alt="{{ $banner->code }}">
                        <img class="shape-image three" src="assets/images/banner/two/hero__two__illustration-sm3.svg"
                            alt="{{ $banner->code }}">
                        <img class="shape-image four" src="assets/images/banner/two/hero__two__illustration-sm4.svg"
                            alt="{{ $banner->code }}">
                        <img class="shape-image five" src="assets/images/banner/two/hero__two__illustration-sm5.svg"
                            alt="{{ $banner->code }}s">
                    </div>
                </div>
            </div>
        </div>
        <div class="shape">
            <div class="shape__one">
                <img src="assets/images/banner/banner__two__shape.svg" alt="{{ $banner->code }}">
            </div>
        </div>
    </section>
    <!-- HERO BANNER ONE END -->

    <!-- ABOUT US -->
    @php $aboutSection = $data->sections->firstWhere('code', 'home_about_us'); @endphp
    <div class="rts-hosting-feature-area pt--100 pb-100">
        <div class="container">
            <div class="section-inner">
                <div class="row g-5">
                    <div class="col-lg-5">
                        <div class="left-side-image">
                            <img class="lazyload" src="{{ $aboutSection->images[0]->src }}" alt="about">
                        </div>
                    </div>
                    <div class="col-lg-7">
                        <div class="right-side-content">
                            <div class="section-title-area text-start">
                                <h3 class="section-title sal-animate mb--40">
                                    {{ $aboutSection->texts[0]->{'title' . $curLanguage} }}</h3>
                                <p class="desc sal-animate mb--50">{!! $aboutSection->texts[0]->{'content' . $curLanguage} !!}</p>
                                <div class="rts-testimonial__single">
                                    <div class="quote-icon mb--10">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="33" height="27"
                                            viewBox="0 0 33 27" fill="none">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M3.12927 12.9165H11.1667C11.8905 12.9165 12.5847 13.204 13.0965 13.7159C13.6083 14.2277 13.8958 14.9219 13.8958 15.6457V23.8332C13.8958 24.557 13.6083 25.2512 13.0965 25.763C12.5847 26.2748 11.8905 26.5623 11.1667 26.5623H2.97917C2.25535 26.5623 1.56117 26.2748 1.04935 25.763C0.537536 25.2512 0.25 24.557 0.25 23.8332V14.7587C0.250828 12.2879 0.861546 9.85559 2.02796 7.67749C3.19437 5.49939 4.88041 3.6429 6.93646 2.27275L9.37906 0.635254L10.8801 2.90046L8.4375 4.53796C7.01878 5.48869 5.81394 6.72487 4.89994 8.16753C3.98594 9.61019 3.38288 11.2276 3.12927 12.9165ZM22.2333 12.9165H30.2707C30.9945 12.9165 31.6887 13.204 32.2005 13.7159C32.7123 14.2277 32.9998 14.9219 32.9998 15.6457V23.8332C32.9998 24.557 32.7123 25.2512 32.2005 25.763C31.6887 26.2748 30.9945 26.5623 30.2707 26.5623H22.0832C21.3594 26.5623 20.6652 26.2748 20.1534 25.763C19.6415 25.2512 19.354 24.557 19.354 23.8332V14.7587C19.3548 12.2879 19.9656 9.85559 21.132 7.67749C22.2984 5.49939 23.9844 3.6429 26.0405 2.27275L28.4967 0.635254L29.9841 2.90046L27.5415 4.53796C26.1228 5.48869 24.9179 6.72487 24.0039 8.16753C23.0899 9.61019 22.4869 11.2276 22.2333 12.9165Z"
                                                fill="#4C5671"></path>
                                        </svg>
                                    </div>
                                    <div class="content">
                                        <p>{!! $aboutSection->texts[0]->{'content_2' . $curLanguage} !!}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- ABOUT US END -->

    <!-- SERVICE -->
    @php $serviceSection = $data->sections->firstWhere('code', 'home_service'); @endphp
    <div class="rts-service-two cultured__white section__padding pricing__bg">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="rts-section section-style-two">
                        <div class="rts-section__two">
                            <h2 class="title">
                                {{ $serviceSection->texts[0]->{'title' . $curLanguage} }}</h2>
                            <p class="description mb-0">
                                {{ $serviceSection->texts[0]->{'sub_title' . $curLanguage} }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row gy-30">
                @foreach ($navServices as $key => $service)
                    @if ($key == 0)
                        <div class="col-xl-8 col-lg-7 col-md-12">
                            <div class="service-two">
                                <div class="service-two__content">
                                    <span class="sub__title">{{ $service->{'name' . $curLanguage} }}</span>
                                    <h4 class="title">{{ $service->{'short_description' . $curLanguage} }}</h4>
                                    {{-- <a href="{{ route('services.page', $service->route) }}" class="primary__btn btn__two"
                                        aria-label="{{ __('button.read_more') }}"
                                        style="padding: 8px 12px;">{{ __('text.view_more') }}</a> --}}
                                </div>
                                <div class="service-two__image">
                                    <img class="lazyload" data-src="{{ $service->image }}" width="142" alt="service">
                                </div>
                            </div>
                        </div>
                    @elseif ($key == 1)
                        <div class="col-xl-4 col-lg-5 col-md-6">
                            <div class="service-two-small">
                                <div class="service-two-small__content">
                                    <div class="service-icon">
                                        <img class="lazyload" data-src="{{ $service->image }}" alt="service">
                                    </div>
                                    <a href="{{ route('services.page', $service->route) }}"
                                        class="service-title">{{ $service->{'name' . $curLanguage} }}</a>
                                    <p class="description min-height">{{ $service->{'short_description' . $curLanguage} }}</p>
                                    {{-- <a href="{{ route('services.page', $service->route) }}" class="service-btn"
                                        aria-label="{{ __('button.read_more') }}"><i
                                            class="fa-regular fa-arrow-right"></i></a> --}}
                                </div>
                            </div>
                        </div>
                    @else
                        <div class="col-lg-3 col-md-6">
                            <div class="service-two-small">
                                <div class="service-two-small__content">
                                    <div class="service-icon">
                                        <img class="lazyload" data-src="{{ $service->image }}" alt="service">
                                    </div>
                                    <a href="{{ route('services.page', $service->route) }}"
                                        class="service-title">{{ $service->{'name' . $curLanguage} }}</a>
                                    <p class="description min-height">{{ $service->{'short_description' . $curLanguage} }}
                                    </p>
                                    {{-- <a href="{{ route('services.page', $service->route) }}" class="service-btn"
                                        aria-label="{{ __('button.read_more') }}"><i
                                            class="fa-regular fa-arrow-right"></i></a> --}}
                                </div>
                            </div>
                        </div>
                    @endif
                @endforeach
            </div>
        </div>
    </div>
    <!-- SERVICE END -->

    <!-- FEATURE -->
    @php $whyUsSection = $data->sections->firstWhere('code', 'home_why_us'); @endphp
    <div class="rts-feature-area pb-100">
        <div class="container">
            <div class="section-title-btn-area">
                <div class="section-title-area text-start">
                    <h3 class="section-title font-40 sal-animate">
                        {{ $whyUsSection->texts[4]->{'title' . $curLanguage} }}</h3>
                    <p class="desc sal-animate">
                        {{ $whyUsSection->texts[4]->{'content' . $curLanguage} }}</p>
                </div>
            </div>
            <div class="section-inner">
                <div class="feature-wrapper">
                    <div class="row mt--60 inner-separator">
                        @for ($i = 0; $i < 4; $i++)
                            <div class="col-lg-3 col-md-6 col-sm-6 mt--0 pt--50">
                                <div class="feature-wrapper text-center">
                                    <div class="overlay"></div>
                                    <div class="icon">
                                        <img class="lazyload" data-src="{{ $whyUsSection->images[$i]->src }}"
                                            height="60" alt="feature">
                                    </div>
                                    <div class="content">
                                        <h4 class="title">{{ $whyUsSection->texts[$i]->{'title' . $curLanguage} }}</h4>
                                        <p class="desc">{!! $whyUsSection->texts[$i]->{'content' . $curLanguage} !!}</p>
                                    </div>
                                </div>
                            </div>
                        @endfor
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- FEATURE END -->

    <!-- SUPPORT -->
    @php $supportSection = $data->sections->firstWhere('code', 'home_support'); @endphp
    <div class="rts-support black__friday--support">
        <div class="container">
            <div class="row">
                <div class="rts-support__wrapper">
                    <div class="rts-support__wrapper--content">
                        <h3 class="title sal-animate">
                            {{ $supportSection->texts[0]->{'title' . $curLanguage} }}</h3>
                        <p class="sal-animate">
                            {!! $supportSection->texts[0]->{'content' . $curLanguage} !!}
                        </p>
                        <div class="feature sal-animate">
                            {!! $supportSection->texts[0]->{'content_2' . $curLanguage} !!}
                        </div>
                    </div>
                    <div class="rts-support__wrapper--image sal-animate" data-sal="slide-left">
                        <img class="lazyload" data-src="assets/images/support/support__image.svg" alt="support">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- SUPPORT END -->

    <!-- CLIENTS -->
    @php $clientSection = $data->sections->firstWhere('code', 'home_clients'); @endphp
    <div class="rts-brand rts-brand__bg--section pt-100 pb-100">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="rts-brand__wrapper--text text-center mb--40">
                        <h3>{!! $clientSection->texts[0]->{'content' . $curLanguage} !!}</h3>
                    </div>
                    <div class="rts-brand__wrapper">
                        <div class="rts-brand__slider swiper-initialized swiper-horizontal swiper-pointer-events">
                            <div class="swiper-wrapper" id="swiper-wrapper-aa34b6b172dc52e2" aria-live="polite"
                                style="transform: translate3d(-297.333px, 0px, 0px); transition-duration: 0ms;">
                                @foreach ($clientSection->images as $key => $client)
                                    <div class="swiper-slide swiper-slide-next" role="group"
                                        aria-label="{{ $key + 1 }} / {{ sizeof($clientSection->images) }}"
                                        data-swiper-slide-index="{{ $key }}"
                                        style="width: 108.667px; margin-right: 40px;">
                                        <div class="rts-brand__slider--single">
                                            <a href="{{ $client->redirect }}" target="_blank"
                                                aria-label="{{ $client->name }}"><img class="lazyload"
                                                    data-src="{{ $client->src }}" alt="{{ $client->name }}"></a>
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                            <span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- CLIENTS END -->

    <!-- CONTACT -->
    @php $contactSection = $data->sections->firstWhere('code', 'home_contact_banner'); @endphp
    <div class="rts-cta-two cultured__white pb-100">
        <div class="container">
            <div class="row">
                <div class="rts-cta-two__wrapper">
                    <div class="cta__shape"></div>
                    <div class="cta-content sal-animate">
                        <span>{{ $contactSection->texts[0]->{'title' . $curLanguage} }}</span>
                        <h4>{{ $contactSection->texts[0]->{'content' . $curLanguage} }}</h4>
                    </div>
                    <div class="cta-btn">
                        <a href="{{ route($contactSection->buttons[0]->redirect) }}" class="contact__us rts-btn rts-btn-secondary">
                            {{ $contactSection->buttons[0]->{'text' . $curLanguage} }}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- CONTACT US -->


@endpush
