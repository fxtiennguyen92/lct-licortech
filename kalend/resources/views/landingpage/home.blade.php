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
    <section class="hero-banner-slide position-relative fix">
        <div class="rts-hero-banner banner-six">
            <div class="container">
                <div class="row justify-content-md-center">
                    <div class="col-xl-6 col-lg-6 col-md-10 order-md-2 order-lg-0">
                        <div class="rts-hero-two__content">
                            <h1 class="title">
                                {!! $banner->texts[0]->{'content' . $curLanguage} !!}
                            </h1>
                            <p class="description-banner">{!! $banner->texts[1]->{'content' . $curLanguage} !!}</p>
                            <div class="rts-hero-two__content--btn">
                                <a href="{{ $banner->buttons[0]->redirect }}"
                                    class="rts-btn btn__long secondary__bg secondary__color">
                                    {!! $banner->buttons[0]->{'text' . $curLanguage} !!}</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-4 offset-xl-1 col-lg-5 col-md-10">
                        <div class="hero-image-big">
                            <img src="images/banner/home.png" alt="{{ $banner->code }}">
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </section>
    <!-- HERO BANNER ONE END -->



    <!-- ABOUT US -->
    @php $about = $data->sections->firstWhere('code', 'about'); @endphp
    <section class="rts-feature-six section__padding sevice-tab-section-bg">
        <div class="container">
            <div class="row">
                <div class="rts-section text-center">
                    <h2 class="rts-section__title sal-animate" data-sal="slide-down" data-sal-delay="100"
                        data-sal-duration="800">{!! $about->texts[0]->{'title' . $curLanguage} !!}</h2>
                    <p class="rts-section__description sal-animate w-570" data-sal="slide-down" data-sal-delay="300"
                        data-sal-duration="800">{!! $about->texts[0]->{'content' . $curLanguage} !!}</p>
                </div>
            </div>
            <div class="row gy-30">
                <div class="col-lg-3 col-md-6 sal-animate" data-sal="slide-down" data-sal-delay="700"
                    data-sal-duration="800">
                    <div class="single__feature">
                        <div class="single__feature--box">
                            <div class="single__feature--box-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="#2D3C58">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                                </svg>
                            </div>
                            <h5 class="single__feature--box-title">{!! $about->texts[1]->{'title' . $curLanguage} !!}</h5>
                            <p class="single__feature--box-description">{!! $about->texts[1]->{'content' . $curLanguage} !!}</p>
                        </div>
                    </div>
                </div>

                <div class="col-lg-3 col-md-6 sal-animate" data-sal="slide-down" data-sal-delay="600"
                    data-sal-duration="800">
                    <div class="single__feature">
                        <div class="single__feature--box">
                            <div class="single__feature--box-icon">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M19.8333 0C30.787 0 39.6667 8.87969 39.6667 19.8333C39.6667 30.787 30.787 39.6667 19.8333 39.6667C8.87969 39.6667 0 30.787 0 19.8333C0 8.87969 8.87969 0 19.8333 0ZM19.8333 2.08772C10.0327 2.08772 2.08772 10.0327 2.08772 19.8333C2.08772 29.634 10.0327 37.579 19.8333 37.579C29.634 37.579 37.579 29.634 37.579 19.8333C37.579 10.0327 29.634 2.08772 19.8333 2.08772ZM31.0101 8.65662C31.3864 9.03291 31.4542 9.71168 31.0101 10.1329L23.4307 17.7122C23.798 18.3339 24.0088 19.059 24.0088 19.8333C24.0088 22.1394 22.1394 24.0088 19.8333 24.0088C17.5273 24.0088 15.6579 22.1394 15.6579 19.8333C15.6579 17.5273 17.5273 15.6579 19.8333 15.6579C20.6077 15.6579 21.3328 15.8687 21.9545 16.236L29.5338 8.65662C29.9415 8.24897 30.6024 8.24897 31.0101 8.65662ZM19.8333 17.7456C18.6803 17.7456 17.7456 18.6803 17.7456 19.8333C17.7456 20.9864 18.6803 21.9211 19.8333 21.9211C20.9864 21.9211 21.9211 20.9864 21.9211 19.8333C21.9211 18.6803 20.9864 17.7456 19.8333 17.7456ZM32.1693 14.1715C32.9788 15.9325 33.4035 17.8539 33.4035 19.8333C33.4035 20.4098 32.9362 20.8772 32.3597 20.8772C31.7831 20.8772 31.3158 20.4098 31.3158 19.8333C31.3158 18.1565 30.9568 16.5323 30.2724 15.0435C30.0316 14.5197 30.2611 13.8998 30.7849 13.659C31.3087 13.4183 31.9285 13.6477 32.1693 14.1715ZM19.8333 6.26316C21.831 6.26316 23.7696 6.6958 25.5435 7.51973C26.0664 7.76258 26.2934 8.38331 26.0506 8.90617C25.8077 9.42904 25.187 9.65604 24.6641 9.41319C23.1642 8.71657 21.5257 8.35088 19.8333 8.35088C13.4918 8.35088 8.35088 13.4918 8.35088 19.8333C8.35088 20.4098 7.88353 20.8772 7.30702 20.8772C6.73051 20.8772 6.26316 20.4098 6.26316 19.8333C6.26316 12.3387 12.3387 6.26316 19.8333 6.26316Z"
                                        fill="#2D3C58"></path>
                                </svg>
                            </div>
                            <h5 class="single__feature--box-title">{!! $about->texts[2]->{'title' . $curLanguage} !!}</h5>
                            <p class="single__feature--box-description">{!! $about->texts[2]->{'content' . $curLanguage} !!}</p>
                        </div>
                    </div>
                </div>

                <div class="col-lg-3 col-md-6 sal-animate" data-sal="slide-down" data-sal-delay="500"
                    data-sal-duration="800">
                    <div class="single__feature">
                        <div class="single__feature--box">
                            <div class="single__feature--box-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="#2D3C58">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185ZM9.75 9h.008v.008H9.75V9Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008V13.5Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>

                            </div>
                            <h5 class="single__feature--box-title">{!! $about->texts[3]->{'title' . $curLanguage} !!}</h5>
                            <p class="single__feature--box-description">{!! $about->texts[3]->{'content' . $curLanguage} !!}</p>
                        </div>
                    </div>
                </div>

                <div class="col-lg-3 col-md-6 sal-animate" data-sal="slide-down" data-sal-delay="800"
                    data-sal-duration="800">
                    <div class="single__feature">
                        <div class="single__feature--box">
                            <div class="single__feature--box-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="#2D3C58">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                                </svg>

                            </div>
                            <h5 class="single__feature--box-title">{!! $about->texts[4]->{'title' . $curLanguage} !!}</h5>
                            <p class="single__feature--box-description">{!! $about->texts[4]->{'content' . $curLanguage} !!}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>


    <!-- PRICING PLAN START -->
    @php $pkg = $data->sections->firstWhere('code', 'Package'); @endphp
    <div id="packages" class="rts-pricing-plan alice__blue section__padding">
        <div class="container">
            <div class="row justify-content-center">
                <div class="rts-section w-490 text-center">
                    <h2 class="rts-section__title " data-sal="slide-down" data-sal-delay="100" data-sal-duration="800">
                        {!! $pkg->texts[0]->{'title' . $curLanguage} !!}</h2>
                    <p class="rts-section__description" data-sal="slide-down" data-sal-delay="300"
                        data-sal-duration="800">{!! $pkg->texts[0]->{'content' . $curLanguage} !!}</p>
                </div>
            </div>
            <div class="row">
                <div class="row justify-content-center" data-sal="slide-down" data-sal-delay="400"
                    data-sal-duration="800">
                    <div class="col-lg-5 col-md-7">
                        <div class="rts-pricing-plan__tab plan__tab">
                            <div class="tab__button">
                                <div class="tab__button__item">
                                    <button class="active tab__price" data-tab="monthly">{{ __('monthly') }}</button>
                                    <button class="tab__price" data-tab="yearly">{{ __('yearly') }}</button>
                                </div>
                            </div>
                            <div class="discount">
                                <span class="line"><img src="assets/images/pricing/offer__vactor.svg" height="20"
                                        width="85" alt=""></span>
                                <p>{{ __('save') }} 10%</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- PRICING PLAN MONTHLY -->
                <div class="price__content open" id="monthly">
                    <div class="row monthly">
                        <div class="col-lg-2"></div>
                        @foreach ($packages as $pkey => $package)
                            <!-- single card -->
                            <div class="offset-lg-0 col-lg-4 offset-md-3 col-md-6 col-sm-12 mb-4">
                                <div class="card-plan {{ $package['popular_flg'] ? 'active' : '' }}">
                                    <div class="card-plan__package">
                                        <div class="icon">
                                            <img src="{{ $package['icon'] }}" height="30" width="30"
                                                alt="{{ $package['name'] }}">
                                        </div>
                                        <h4 class="package__name">{{ $package['name'] }}</h4>
                                    </div>
                                    <p class="card-plan__desc">{!! $package['description'] !!}</p>

                                    <h5 class="card-plan__price">
                                        {{ $package['price_month'] }}<sup>€ TTC</sup> <sub>/ {{ __('month') }}</sub>
                                    </h5>
                                    <div class="card-plan__cartbtn">
                                        <a href="#contact">{{ __('btn.contact') }}</a>
                                    </div>
                                    <div class="card-plan__feature">
                                        <ul class="card-plan__feature--list">
                                            @foreach ($package['details'] as $dkey => $dtl)
                                                <li class="card-plan__feature--list-item">
                                                    <span class="text"><i
                                                            class="fa-regular {{ $dtl ? 'fa-check' : 'fa-xmark' }}"></i>
                                                        {{ __('packages.details.' . $dkey) }}</span>
                                                    <span class="tolltip" data-bs-toggle="tooltip"
                                                        data-bs-placement="bottom"
                                                        title="{{ __('packages.details.' . $dkey . '_i') }}"><i
                                                            class="fa-light fa-circle-question"></i></span>
                                                </li>
                                            @endforeach

                                            <li class="card-plan__feature--list-trigered">
                                                <span class="text">{{ __('btn.more_feature') }} <i
                                                        class="fa-sharp fa-regular fa-chevron-down"></i>
                                                </span>
                                            </li>
                                        </ul>
                                        <ul class="card-plan__feature--list more__feature">
                                            @foreach ($package['exts'] as $dkey => $dtl)
                                                <li class="card-plan__feature--list-item">
                                                    <span class="text"><i
                                                            class="fa-regular {{ $dtl ? 'fa-check' : 'fa-xmark' }}"></i>
                                                        {{ __('packages.exts.' . $dkey) }}</span>
                                                    <span class="tolltip" data-bs-toggle="tooltip"
                                                        data-bs-placement="bottom"
                                                        title="{{ __('packages.exts.' . $dkey . '_i') }}"><i
                                                            class="fa-light fa-circle-question"></i></span>
                                                </li>
                                            @endforeach

                                            <li class="card-plan__feature--list-trigered">
                                                <span class="text">{{ __('btn.less_feature') }} <i
                                                        class="fa-sharp fa-regular fa-chevron-up"></i>
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <!-- single card end -->
                        @endforeach
                    </div>
                </div>

                <!-- PRICING PLAN -->
                <div class="price__content" id="yearly">
                    <div class="row yearly">
                        <div class="col-lg-2"></div>
                        @foreach ($packages as $pkey => $package)
                            <!-- single card -->
                            <div class="offset-lg-0 col-lg-4 offset-md-3 col-md-6 col-sm-12 mb-4">
                                <div class="card-plan {{ $package['popular_flg'] ?? 'active' }}">
                                    @if ($package['popular_flg'])
                                        <div class="popular-tag">{{ __('most_popular') }}</div>
                                    @endif
                                    <div class="card-plan__package">
                                        <div class="icon">
                                            <img src="{{ $package['icon'] }}" height="30" width="30"
                                                alt="{{ $package['name'] }}">
                                        </div>
                                        <h4 class="package__name">{{ $package['name'] }}</h4>
                                    </div>
                                    <p class="card-plan__desc">{!! $package['description'] !!}</p>
                                    <h5 class="card-plan__price">
                                        {{ $package['price_year'] }}<sup>€ TTC</sup> <sub>/ {{ __('year') }}</sub>
                                    </h5>
                                    <div class="card-plan__cartbtn">
                                        <a href="#contact">{{ __('btn.contact') }}</a>
                                    </div>
                                    <div class="card-plan__feature">
                                        <ul class="card-plan__feature--list">
                                            @foreach ($package['details'] as $dkey => $dtl)
                                                <li class="card-plan__feature--list-item">
                                                    <span class="text"><i
                                                            class="fa-regular {{ $dtl ? 'fa-check' : 'fa-xmark' }}"></i>
                                                        {{ __('packages.details.' . $dkey) }}</span>
                                                    <span class="tolltip" data-bs-toggle="tooltip"
                                                        data-bs-placement="bottom"
                                                        title="{{ __('packages.details.' . $dkey . '_i') }}"><i
                                                            class="fa-light fa-circle-question"></i></span>
                                                </li>
                                            @endforeach

                                            <li class="card-plan__feature--list-trigered">
                                                <span class="text">{{ __('btn.more_feature') }} <i
                                                        class="fa-sharp fa-regular fa-chevron-down"></i>
                                                </span>
                                            </li>
                                        </ul>
                                        <ul class="card-plan__feature--list more__feature">
                                            @foreach ($package['exts'] as $dkey => $dtl)
                                                <li class="card-plan__feature--list-item">
                                                    <span class="text"><i
                                                            class="fa-regular {{ $dtl ? 'fa-check' : 'fa-xmark' }}"></i>
                                                        {{ __('packages.exts.' . $dkey) }}</span>
                                                    <span class="tolltip" data-bs-toggle="tooltip"
                                                        data-bs-placement="bottom"
                                                        title="{{ __('packages.exts.' . $dkey . '_i') }}"><i
                                                            class="fa-light fa-circle-question"></i></span>
                                                </li>
                                            @endforeach

                                            <li class="card-plan__feature--list-trigered">
                                                <span class="text">{{ __('btn.less_feature') }} <i
                                                        class="fa-sharp fa-regular fa-chevron-up"></i>
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <!-- single card end -->
                        @endforeach
                    </div>
                </div>
            </div>

            <div class="row justify-content-center">
                <div class="rts-section w-490 text-center pt--50">
                    <h2 class="rts-section__title " data-sal="slide-down" data-sal-delay="100" data-sal-duration="800">
                        {!! $pkg->texts[1]->{'title' . $curLanguage} !!}</h2>
                    <p class="rts-section__description" data-sal="slide-down" data-sal-delay="300"
                        data-sal-duration="800">{!! $pkg->texts[1]->{'content' . $curLanguage} !!}</p>
                </div>
            </div>
            <div class="row g-30">
                <!-- Pro Package -->
                <div class="col-lg-3"></div>
                <div class="offset-lg-0 col-lg-6 offset-md-3 col-md-6 col-sm-12 mb-4">
                    <div class="card-plan">
                        <div class="card-plan__package">
                            <div class="icon">
                                <img src="assets/images/pricing/premium.svg" height="30" width="30"
                                    alt="">
                            </div>
                            <h4 class="package__name">{{ __('packages.option.name') }}</h4>
                        </div>
                        <p class="card-plan__desc">{!! __('packages.option.description') !!}</p>
                        <h5 class="card-plan__price">
                            {{ __('get_quote') }}
                        </h5>
                        <div class="card-plan__feature">
                            <ul class="card-plan__feature--list">
                                @foreach ($options as $opt)
                                    <li class="card-plan__feature--list-item">
                                        <span class="text"><i class="fa-regular fa-plus"></i>
                                            {{ __('packages.opts.' . $opt) }}</span>
                                        <span class="tolltip" data-bs-toggle="tooltip" data-bs-placement="bottom"
                                            title="{{ __('packages.opts.' . $opt . '_i') }}"><i
                                                class="fa-light fa-circle-question"></i></span>
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                    </div>
                </div>
                <!-- Pro Package end -->
            </div>
        </div>



        <!-- CONTACT -->
        @php $contactSection = $data->sections->firstWhere('code', 'home_contact_banner'); @endphp
        <div class="rts-cta-two pt--100">
            <div class="container">
                <div class="row">
                    <div class="rts-cta-two__wrapper">
                        <div class="cta__shape"></div>
                        <div class="cta-content sal-animate">
                            <span>{{ $contactSection->texts[0]->{'title' . $curLanguage} }}</span>
                            <h4>{!! $contactSection->texts[0]->{'content' . $curLanguage} !!}</h4>
                        </div>
                        <div class="cta-btn">
                            <a href="{{ $contactSection->buttons[0]->redirect }}"
                                class="contact__us rts-btn rts-btn-secondary">
                                {{ $contactSection->buttons[0]->{'text' . $curLanguage} }}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- CONTACT US -->

    </div>
    <!-- PRICING PLAN START END -->


    <!-- CONTACT FORM START -->
    @php $content = $data->sections->firstWhere('code', 'contact_form'); @endphp
    <section id="contact" class="rts-contact-form no-bg pt--120 pb--120">
        <div class="container">
            <div class="row gy-30 justify-content-center">
                <div class="col-xl-6 col-lg-6 col-md-10">
                    <div class="contact-form">
                        <div class="contact-form__content sal-animate" data-sal="slide-down" data-sal-delay="100"
                            data-sal-duration="800">
                            <div class="contact-form__content--image">
                                <img src="assets/images/contact/contact-form.png" width="260" height="188"
                                    alt="">
                            </div>
                            <h1 class="contact-form__content--title">
                                {!! $content->texts[0]->{'title' . $curLanguage} !!}
                            </h1>
                            <p class="contact-form__content--description">{!! $content->texts[0]->{'sub_title' . $curLanguage} !!}</p>
                        </div>
                    </div>
                </div>
                <div class="col-xl-5 col-lg-6 offset-xl-1 col-md-10">
                    <div class="form">
                        <form class="form__content" method="post" action="{{ route('contact') }}">
                            @csrf
                            <div class="form__control">
                                <input type="text" class="input-form" name="name" id="name"
                                    placeholder="{{ __('text.contact.name_placeholder') }} (*)"
                                    value="{{ old('name') }}" required>
                            </div>
                            <div class="form__control">
                                <input type="text" class="input-form" name="phone" id="phone"
                                    value="{{ old('phone') }}"
                                    placeholder="{{ __('text.contact.phone_placeholder') }} (*)" required>
                            </div>
                            <div class="form__control">
                                <input type="email" class="input-form" name="email" id="email"
                                    placeholder="{{ __('text.contact.email_placeholder') }}"
                                    value="{{ old('email') }}">

                                @if (old('country_code', config('app.locale')) == 'vi')
                                    <select name="country_code" id="select" class="input-form" required>
                                        <option value="vi" @if (old('country_code') == 'vi') selected @endif>Tư vấn
                                            bằng Tiếng Việt</option>
                                        <option value="fr" @if (old('country_code') == 'fr') selected @endif>Tư vấn
                                            bằng tiếng Pháp</option>
                                    </select>
                                @endif
                            </div>

                            <label>{{ __('text.contact.accept_condition') }}</label>

                            <div class="g-recaptcha" data-sitekey="6Lc0ksYpAAAAAEeXx9MWdjIa1SHPXD1k1ry_LJBj"
                                data-action="CONTACT"></div>
                            <button type="submit" class="submit__btn">{{ __('button.submit') }}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
@endpush

@push('css')
    <link rel="stylesheet" type="text/css" href="components/kit/vendors/bootstrap/css/alerts.css">
@endpush
@push('js')
    <script src="vendors/jquery/dist/jquery.min.js"></script>
    <script src="vendors/remarkable-bootstrap-notify/dist/bootstrap-notify.js"></script>
    <script>
        @if (Session::has('error'))
            $.notify({
                title: "<strong>{{ trans('message.error') }}!</strong> ",
                message: "{{ Session::get('error') }}",
            }, {
                type: 'danger',
                placement: {
                    from: "top",
                    align: "right"
                },
                template: '<div data-notify="container" class="col-xs-11 col-sm-4 alert alert-{0}" role="alert"><span data-notify="icon"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
            })
        @endif
    </script>
@endpush
