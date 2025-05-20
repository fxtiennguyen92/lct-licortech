@extends('landingpage.index')

@push('page_name')
    {{ $data->{'head_title' . $curLanguage} }}
@endpush

@push('content')
    <!-- HERO BANNER ONE -->
    @php $banner = $data->sections->firstWhere('code', 'about_banner'); @endphp
    <div class="rts-hero-two rts-hero-two__bg">
        <div class="container">
            <div class="row ustify-content-md-center">
                <div class="col-xl-6 col-lg-7 col-md-8 order-lg-0 banner-area">
                    <div class="rts-hosting-banner rts-hosting-banner__content about__banner">
                        <span class="starting__price" data-sal="slide-down" data-sal-delay="100" data-sal-duration="800">
                            {{ $banner->texts[0]->{'sub_title' . $curLanguage} }}</span>
                        <h1 class="banner-title" data-sal="slide-down" data-sal-delay="200" data-sal-duration="800">
                            {!! $banner->texts[0]->{'title' . $curLanguage} !!}
                        </h1>
                        <p class="slogan" data-sal="slide-down" data-sal-delay="300" data-sal-duration="800">
                            {!! $banner->texts[0]->{'content' . $curLanguage} !!}</p>
                        <div class="hosting-action" data-sal="slide-down" data-sal-delay="200" data-sal-duration="800">
                            <a href="{{ route($banner->buttons[0]->redirect) }}"
                                class="btn__two secondary__bg secondary__color">{{ $banner->buttons[0]->{'text' . $curLanguage} }}
                                <i class="fa-regular fa-arrow-right"></i></a>
                        </div>
                    </div>
                </div>
                <div class="col-xl-5 offset-xl-1 col-lg-5 col-md-10 rts-hosting-banner__image about text-center">
                    <img src="{{ $banner->images[0]->src }}" width="562" alt="about">
                </div>
            </div>
        </div>
    </div>
    <!-- HERO BANNER ONE END -->

    <!-- COMMITMENT -->
    @php $commSection = $data->sections->firstWhere('code', 'about_commitment'); @endphp
    <section class="rts-hosting-feature cultured__white section__padding">
        <div class="container">
            <div class="row align-items-center justify-content-sm-center">
                <div class="col-xl-8 col-lg-8 col-md-10 col-sm-10 order-2 order-lg-0">
                    <div class="rts-hosting-feature__content">
                        <div class="rts-section__two">
                            <h2 class="title sal-animate" data-sal="slide-down" data-sal-delay="400"
                                data-sal-duration="800">{{ $commSection->texts[0]->{'title' . $curLanguage} }}</h2>
                            <p class="description sal-animate" data-sal="slide-down" data-sal-delay="600"
                                data-sal-duration="800">{!! $commSection->texts[0]->{'content' . $curLanguage} !!}</p>
                        </div>
                        <div class="hosting-feature mx-0">
                            <ul>
                                <li data-sal="slide-up" data-sal-delay="800" data-sal-duration="800" class="sal-animate">
                                    <div class="hosting-feature__single feature__one">
                                        <div class="icon">
                                            <svg width="26" height="22" viewBox="0 0 26 22" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M12.5156 0C5.64129 0 0 5.5924 0 12.4667C0 16.0324 1.60077 19.4405 4.30564 21.8174C4.43955 21.9348 4.61144 22 4.78974 22H20.2413C20.4196 22 20.5915 21.9348 20.7254 21.8174C23.4303 19.4405 25.0311 16.0324 25.0311 12.4667C25.0311 5.5924 19.3898 0 12.5156 0Z"
                                                    fill="url(#paint0_linear_215_8401)"></path>
                                                <path
                                                    d="M21.8927 10.7441V10.7434C21.0634 6.21805 17.1196 2.93311 12.5155 2.93311C7.25898 2.93311 2.98218 7.20991 2.98218 12.4664C2.98218 13.7219 3.22995 14.9493 3.71908 16.1137C3.87518 16.4869 4.30487 16.6616 4.67584 16.5076L7.37641 15.389C7.75065 15.2339 7.92807 14.8046 7.77314 14.4308C7.51393 13.8049 7.38218 13.1439 7.38218 12.4664C7.38218 9.63621 9.68528 7.33311 12.5155 7.33311C15.3457 7.33311 17.6488 9.63621 17.6488 12.4664C17.6488 13.1468 17.5171 13.8071 17.2586 14.4301C17.103 14.8021 17.2794 15.2336 17.6546 15.389L20.3552 16.5076C20.7248 16.6607 21.1548 16.4894 21.3119 16.1137C21.8011 14.9493 22.0488 13.7219 22.0488 12.4664C22.0488 11.8885 21.9966 11.3091 21.8927 10.7441ZM14.7155 13.9331C14.7155 13.048 13.5511 10.129 13.1944 9.25595C12.9695 8.70454 12.0615 8.70454 11.8366 9.25595C11.4799 10.1289 10.3155 13.048 10.3155 13.9331C10.3155 15.1462 11.3024 16.1331 12.5155 16.1331C13.7286 16.1331 14.7155 15.1462 14.7155 13.9331ZM15.4488 17.5998H9.58218C9.17684 17.5998 8.84884 17.9278 8.84884 18.3331C8.84884 18.7384 9.17684 19.0664 9.58218 19.0664H15.4488C15.8542 19.0664 16.1822 18.7384 16.1822 18.3331C16.1822 17.9278 15.8542 17.5998 15.4488 17.5998Z"
                                                    fill="white"></path>
                                                <defs>
                                                    <linearGradient id="paint0_linear_215_8401" x1="12.5156"
                                                        y1="22" x2="12.5156" y2="0"
                                                        gradientUnits="userSpaceOnUse">
                                                        <stop offset="0" stop-color="#A93AFF"></stop>
                                                        <stop offset="1" stop-color="#FF81FF"></stop>
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                        </div>
                                        <p class="feature-text">{{ $commSection->texts[1]->{'content' . $curLanguage} }}</p>
                                    </div>
                                </li>
                                <li data-sal="slide-left" data-sal-delay="900" data-sal-duration="800" class="sal-animate">
                                    <div class="hosting-feature__single feature__two">
                                        <div class="icon">
                                            <svg width="26" height="26" viewBox="0 0 26 26" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M24.1405 17.5661L22.706 16.9087L23.4082 16.2811C22.4519 14.8318 21.2268 13.6066 19.7773 12.6503L19.1499 13.3526L18.4926 11.9182C16.9834 11.1413 15.2601 10.6781 13.4971 10.5735L12.75 12.0527L12.0029 10.5735C10.2399 10.678 8.51655 11.1413 7.00742 11.9182L6.3501 13.3526L5.72266 12.6503C4.27319 13.6066 3.0481 14.8318 2.0918 16.2811L2.79404 16.9087L1.35957 17.5661C0.478225 19.2843 0 21.2118 0 23.2588C0 23.6771 0.328661 24.0059 0.74707 24.0059H11.2559C11.6743 24.0059 12.0029 23.6771 12.0029 23.2588C12.0029 22.8404 12.3316 22.5117 12.75 22.5117C13.1684 22.5117 13.4971 22.8404 13.4971 23.2588C13.4971 23.6771 13.8257 24.0059 14.2441 24.0059H24.7529C25.1713 24.0059 25.5 23.6771 25.5 23.2588C25.5 21.2118 25.0218 19.2843 24.1405 17.5661ZM9.76172 8.96484H15.7383C16.1512 8.96484 16.4854 8.6307 16.4854 8.21777C16.4854 6.1582 14.8096 4.48242 12.75 4.48242C10.6904 4.48242 9.01465 6.1582 9.01465 8.21777C9.01465 8.6307 9.34879 8.96484 9.76172 8.96484Z"
                                                    fill="url(#paint0_linear_215_8427)"></path>
                                                <path
                                                    d="M12.7501 4.48242C13.986 4.48242 14.9913 3.47706 14.9913 2.24121C14.9913 1.00536 13.986 0 12.7501 0C11.5142 0 10.5089 1.00536 10.5089 2.24121C10.5089 3.47706 11.5142 4.48242 12.7501 4.48242ZM12.003 10.5735V12.7998C12.003 13.2181 12.3317 13.5469 12.7501 13.5469C13.1685 13.5469 13.4972 13.2181 13.4972 12.7998V10.5735C13.2433 10.5586 13.004 10.5586 12.7501 10.5586C12.4962 10.5586 12.2569 10.5586 12.003 10.5735ZM7.00752 11.9182C6.55938 12.1274 6.12603 12.3814 5.72276 12.6503L6.82842 14.5778C7.03068 14.938 7.50348 15.0595 7.84434 14.8467C8.20293 14.6375 8.32256 14.1893 8.11318 13.8308L7.00752 11.9182ZM4.01924 17.3868L2.0919 16.2811C1.82285 16.6845 1.569 17.1179 1.35962 17.5661L3.27217 18.6718C3.61238 18.8841 4.08528 18.7637 4.28828 18.4028C4.49746 18.0442 4.37783 17.5959 4.01924 17.3868ZM17.6559 14.8468C17.9966 15.0595 18.4695 14.9381 18.6718 14.5779L19.7774 12.6504C19.3742 12.3814 18.9408 12.1274 18.4927 11.9183L17.387 13.8308C17.1776 14.1894 17.2973 14.6375 17.6559 14.8468ZM23.4083 16.2811L21.481 17.3868C21.1224 17.5959 21.0027 18.0442 21.2119 18.4028C21.4149 18.7637 21.8878 18.8841 22.228 18.6718L24.1406 17.5661C23.9312 17.1179 23.6773 16.6845 23.4083 16.2811ZM18.7704 18.7756L14.1673 21.537C13.7799 21.2176 13.2903 21.0176 12.7501 21.0176C11.5142 21.0176 10.5089 22.0229 10.5089 23.2588C10.5089 24.4946 11.5142 25.5 12.7501 25.5C13.986 25.5 14.9913 24.4946 14.9913 23.2588C14.9913 23.1058 14.9756 22.9566 14.9461 22.8121L19.5394 20.0567C19.8932 19.8444 20.0078 19.3855 19.7955 19.0317C19.5825 18.6786 19.125 18.5634 18.7704 18.7756Z"
                                                    fill="url(#paint1_linear_215_8427)"></path>
                                                <defs>
                                                    <linearGradient id="paint0_linear_215_8427" x1="12.75"
                                                        y1="24.0059" x2="12.75" y2="4.48242"
                                                        gradientUnits="userSpaceOnUse">
                                                        <stop offset="0" stop-color="#5558FF"></stop>
                                                        <stop offset="1" stop-color="#00C0FF"></stop>
                                                    </linearGradient>
                                                    <linearGradient id="paint1_linear_215_8427" x1="12.7501"
                                                        y1="25.5" x2="12.7501" y2="0"
                                                        gradientUnits="userSpaceOnUse">
                                                        <stop offset="10%" stop-color="#ADDCFF"></stop>
                                                        <stop offset="0.5028" stop-color="#EAF6FF"></stop>
                                                        <stop offset="1" stop-color="#EAF6FF"></stop>
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                        </div>
                                        <p class="feature-text">{{ $commSection->texts[2]->{'content' . $curLanguage} }}
                                        </p>
                                    </div>
                                </li>
                                <li data-sal="slide-down" data-sal-delay="1000" data-sal-duration="800"
                                    class="sal-animate">
                                    <div class="hosting-feature__single feature__three">
                                        <div class="icon">
                                            <svg width="25" height="25" viewBox="0 0 25 25" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M24.9032 20.9253L13.135 0.368652L12.7441 1.85557L13.8811 17.6759L14.4934 19.2712L24.0672 21.9937C24.3524 22.0748 24.6601 21.976 24.8444 21.7405C25.0279 21.506 25.0512 21.1837 24.9032 20.9253ZM0.0967783 20.9253C-0.0511709 21.1837 -0.0278799 21.506 0.155616 21.7405C0.339112 21.975 0.64629 22.0751 0.932814 21.9937L10.5067 19.2713L11.4258 18.1153L12.6259 1.41611L11.865 0.368652L0.0967783 20.9253Z"
                                                    fill="url(#paint0_linear_215_8444)"></path>
                                                <path
                                                    d="M13.2299 0.671777C13.2208 0.561523 13.1869 0.459033 13.135 0.368555C13.0081 0.147461 12.7704 0 12.5 0C12.2296 0 11.9919 0.147461 11.865 0.368555C11.8131 0.459033 11.7792 0.561523 11.7701 0.671777L10.5066 19.2711L11.7891 24.4438C11.8701 24.7706 12.1634 25 12.5 25C12.8366 25 13.1299 24.7706 13.2109 24.4438L14.4934 19.2711L13.2299 0.671777Z"
                                                    fill="url(#paint1_linear_215_8444)"></path>
                                                <defs>
                                                    <linearGradient id="paint0_linear_215_8444" x1="12.5"
                                                        y1="22.0216" x2="12.5" y2="0.368652"
                                                        gradientUnits="userSpaceOnUse">
                                                        <stop offset="10%" stop-color="#049A91"></stop>
                                                        <stop offset="1" stop-color="#0CFFAF"></stop>
                                                    </linearGradient>
                                                    <linearGradient id="paint1_linear_215_8444" x1="12.5"
                                                        y1="25" x2="12.5" y2="0"
                                                        gradientUnits="userSpaceOnUse">
                                                        <stop offset="0" stop-color="#71FFCC"></stop>
                                                        <stop offset="0.5028" stop-color="#EAF6FF"></stop>
                                                        <stop offset="1" stop-color="#EAF6FF"></stop>
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                        </div>
                                        <p class="feature-text">{{ $commSection->texts[3]->{'content' . $curLanguage} }}
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-xl-4 col-lg-4 col-md-10 col-sm-10 mb-5 mb-lg-0">
                    <div class="rts-hosting-feature__image sal-animate" data-sal="slide-left" data-sal-delay="600"
                        data-sal-duration="800">
                        <img src="{{ $commSection->images[0]->src }}" alt="commitment">
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- COMMITMENT END -->

    <!-- STRATEGY -->
    @php $straSection = $data->sections->firstWhere('code', 'about_strategy'); @endphp
    <section class="rts-feature-area partner section__padding">
        <div class="container">
            <div class="section-inner">
                <div class="row g-5 align-items-center">
                    <div class="col-lg-6">
                        <img src="{{ $straSection->images[0]->src }}" alt="strategy">
                    </div>
                    <div class="col-lg-6">
                        <div class="right-side-content">
                            <div class="rts-section">
                                <h2 class="rts-section__title mb-0 sal-animate" data-sal="slide-down"
                                    data-sal-delay="100" data-sal-duration="800">
                                    {{ $straSection->texts[0]->{'title' . $curLanguage} }}</h2>
                            </div>
                            <div class="feature mb-0 sal-animate" data-sal="slide-down" data-sal-delay="300"
                                data-sal-duration="800">
                                <ul class="feature__list">
                                    {!! $straSection->texts[0]->{'content' . $curLanguage} !!}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- STRATEGY END -->

    <!-- CONTACT -->
    <div class="rts-cta-two">
        <div class="container">
            <div class="row">
                <div class="rts-cta-two__wrapper">
                    <div class="cta__shape"></div>
                    <div class="cta-content sal-animate" data-sal="slide-down" data-sal-delay="100"
                        data-sal-duration="800">
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
    <!-- CONTACT US -->
@endpush
