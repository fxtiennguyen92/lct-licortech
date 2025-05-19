@extends('landingpage.index')

@push('page_name')
    {{ $service->{'name' . $curLanguage} }}
@endpush

@push('content')
    <!-- HERO BANNER ONE -->
    @php $banner = $data->sections->firstWhere('code', 'service_banner'); @endphp
    <div class="rts-hosting-banner rts-hosting-banner-bg banner-default-height">
        <div class="container">
            <div class="row justify-content-sm-center">
                <div class="banner-area">
                    <div class="rts-hosting-banner rts-hosting-banner__content">
                        <span class="starting__price">{{ $banner->texts[0]->{'title' . $curLanguage} }}</span>
                        <h1 class="banner-title">{{ $service->{'name' . $curLanguage} }}</h1>
                        <p class="slogan">{!! $service->{'short_description' . $curLanguage} !!}</p>
                        <div class="hosting-action">
                            <a href="{{ route($banner->buttons[0]->redirect) }}"
                                class="btn__two secondary__bg secondary__color">{{ $banner->buttons[0]->{'text' . $curLanguage} }}
                                <i class="fa-regular fa-arrow-right"></i></a>
                        </div>
                    </div>
                    <div class="rts-hosting-banner__image wordpress-banner__image">
                        <img src="{{ $banner->images[0]->src }}" alt="service">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- HERO BANNER ONE END -->

    <!-- FIRST SECTION -->
    @php $sectionOne = $data->sections->firstWhere('code', 'section_one'); @endphp
    <div class="rts-hosting-feature section__padding">
        <div class="container">
            <div class="row gy-40 justify-content-md-center">
                <div class="col-lg-6 col-md-10">
                    <div class="hosting-feature-image">
                        <div class="hosting-feature-image__image">
                            <img src="{{ $sectionOne->images[0]->src }}" height="428" alt="service">
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 col-md-10">
                    <div class="hosting-feature">
                        <h3 class="hosting-feature__title font-40 sal-animate" data-sal="slide-down" data-sal-delay="100"
                            data-sal-duration="800">{{ $sectionOne->texts[0]->{'title' . $curLanguage} }}</h3>
                        <p class="hosting-feature__desc sal-animate" data-sal="slide-down" data-sal-delay="300"
                            data-sal-duration="800">{{ $sectionOne->texts[0]->{'sub_title' . $curLanguage} }}</p>
                        <div class="feature">
                            <ul class="feature__list sal-animate" data-sal="slide-down" data-sal-delay="400"
                                data-sal-duration="800">
                                {!! $sectionOne->texts[0]->{'content' . $curLanguage} !!}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- FIRST SECTION END -->

    <!-- SECOND SECTION -->
    @php $sectionTwo = $data->sections->firstWhere('code', 'section_two'); @endphp
    @if ($sectionTwo)
    <div class="rts-support black__friday--support">
        <div class="container">
            <div class="row">
                <div class="rts-support__wrapper">
                    <div class="rts-support__wrapper--content">
                        <h3 class="title sal-animate" data-sal="slide-down" data-sal-delay="100" data-sal-duration="800">
                            {{ $sectionTwo->texts[0]->{'title' . $curLanguage} }}</h3>
                        <p data-sal="slide-down" data-sal-delay="200" data-sal-duration="800" class="sal-animate">
                            {{ $sectionTwo->texts[0]->{'sub_title' . $curLanguage} }}
                        </p>
                        <div class="feature sal-animate" data-sal="slide-down" data-sal-delay="300" data-sal-duration="800">
                            <ul class="feature__list">
                                {!! $sectionTwo->texts[0]->{'content' . $curLanguage} !!}
                            </ul>
                        </div>
                    </div>
                    <div class="rts-support__wrapper--image sal-animate" data-sal="slide-left" data-sal-delay="400"
                        data-sal-duration="800">
                        <img src="{{ $sectionTwo->images[0]->src }}" alt="service">
                    </div>
                </div>
            </div>
        </div>
    </div>
    @endif
    <!-- SECOND SECTION END -->

    <!-- CONTACT -->
    <div class="rts-cta-two">
        <div class="container">
            <div class="row">
                <div class="rts-cta-two__wrapper">
                    <div class="cta__shape"></div>
                    <div class="cta-content sal-animate" data-sal="slide-down" data-sal-delay="100" data-sal-duration="800">
                        <span>{{ $contactSection->texts[0]->{'title' . $curLanguage} }}</span>
                        <h4>{{ $contactSection->texts[0]->{'content' . $curLanguage} }}</h4>
                    </div>
                    <div class="cta-btn">
                        <a href="{{ route('contact') }}" class="contact__us rts-btn rts-btn-secondary">
                            {{ $contactSection->buttons[0]->{'text' . $curLanguage} }}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- CONTACT END -->
@endpush
