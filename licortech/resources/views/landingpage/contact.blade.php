@extends('landingpage.index')

@push('page_name')
    {{ $data->{'head_title' . $curLanguage} }}
@endpush

@push('content')
    <!-- CONTACT START -->
    @php $content = $data->sections->firstWhere('code', 'contact_form'); @endphp
    <section class="rts-contact-form no-bg pt--120 pb--120">
        <div class="container">
            <div class="row gy-30 justify-content-center">
                <div class="col-xl-6 col-lg-6 col-md-10">
                    <div class="contact-form">
                        <div class="contact-form__content" data-sal="slide-down" data-sal-delay="100" data-sal-duration="800">
                            <div class="contact-form__content--image">
                                <img src="assets/images/contact/contact-form.png" width="260" height="100"
                                    alt="contact">
                            </div>
                            <h2 class="contact-form__content--title">
                                {!! $content->texts[0]->{'title' . $curLanguage} !!}
                            </h2>
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
                                    placeholder="{{ __('text.contact.name_placeholder') }}" value="{{ old('name') }}"
                                    required>
                                <input type="email" class="input-form" name="email" id="email"
                                    placeholder="{{ __('text.contact.email_placeholder') }}" value="{{ old('email') }}"
                                    required>
                            </div>
                            <div class="form__control">
                                <input type="text" class="input-form" name="phone" id="phone"
                                    value="{{ old('phone') }}" placeholder="{{ __('text.contact.phone_placeholder') }}">
                                <select name="country_code" id="select" class="input-form" required>
                                    <option value="" disabled selected>{{ __('text.contact.region_placeholder') }}
                                    </option>
                                    @foreach (config('regions.countries') as $key => $region)
                                        <option value="{{ $key }}"
                                            @if ($key == old('country_code', config('app.locale'))) selected @endif>{{ $region }}</option>
                                    @endforeach
                                </select>
                            </div>

                            <textarea name="content" id="message" cols="30" rows="10" maxlength="250"
                                placeholder="{{ __('text.contact.message_placeholder') }}" required>{!! old('content') !!}</textarea>


                            <div class="g-recaptcha mt-5" data-sitekey="{{ config('app.recaptcha_site_key') }}" required></div>
                            <label>{{ __('text.contact.accept_condition') }}</label>
                            <button type="submit" class="submit__btn">{{ __('button.submit') }}</button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- CONTACT END -->
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

        var header = document.querySelector('header');
        header.classList.add('header__with__bg');
    </script>
@endpush
