@extends('landingpage.index')

@push('page_name')
    {{ $data->{'head_title' . $curLanguage} }}
@endpush

@push('content')
    <!-- CONTACT START -->
    @php $content = $data->sections->firstWhere('code', 'call-banner'); @endphp
    <section class="rts-contact-form no-bg pt--120 pb--120">
        <div class="container">
            <div class="row gy-30 justify-content-center">
                <div class="col-xl-3 col-lg-10 col-md-10">
                    <div class="contact-form">
                        <div class="contact-form__content" data-sal="slide-down" data-sal-delay="100" data-sal-duration="800">
                            <div class="contact-form__content--image">
                                <img src="{{ $content->images[0]->src }}" width="120" height="60" alt="contact">
                            </div>
                            <h2 class="contact-form__content--title">
                                {!! $content->texts[0]->{'title' . $curLanguage} !!}
                            </h2>
                            <p class="contact-form__content--description">{!! $content->texts[0]->{'sub_title' . $curLanguage} !!}</p>
                        </div>
                    </div>
                </div>
                <div class="col-xl-8 col-lg-12 offset-xl-1 col-md-10">
                    <div class="form">
                        <form class="form__content" method="post" action="{{ route('call') }}">
                            @csrf
                            <div class="row">
                                <div class="col-lg-7">
                                    <div class="calendar"></div>
                                </div>
                                <div class="col-lg-5 mt--20">
                                    <div class="form__control">
                                        <input type="text" class="input-form" name="name" id="name"
                                            placeholder="{{ __('text.contact.name_placeholder') }}" required>
                                    </div>
                                    <div class="form__control">
                                        <input type="email" class="input-form" name="email" id="email"
                                            placeholder="{{ __('text.contact.email_placeholder') }}" required>
                                    </div>
                                    <div class="form__control">
                                        <input type="text" class="input-form" name="phone" id="phone"
                                            placeholder="{{ __('text.contact.phone_placeholder') }}" required>
                                    </div>
                                    <div class="form__control">
                                        <select name="country_code" id="select-country" class="input-form" required>
                                            <option value="" disabled selected>
                                                {{ __('text.contact.region_placeholder') }}
                                            </option>
                                            @foreach (config('regions.utc') as $key => $region)
                                                <option value="{{ $key }}"
                                                    @if ($key == config('app.locale')) selected @endif>{{ $region }}
                                                </option>
                                            @endforeach
                                        </select>
                                    </div>
                                    <div class="form__control">
                                        <input type="text" class="input-form" name="date" id="date"
                                            placeholder="YYYY-MM-DD" readonly>
                                        <select name="time" id="select-time" class="input-form" required>
                                            <option value="" disabled selected><strong>HH:MM</strong></option>
                                            @foreach ($enabledHours as $time)
                                                <option value="{{ $time }}">{{ $time }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                    <button type="submit"
                                        class="submit__btn">{{ $content->buttons[0]->{'text' . $curLanguage} }}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- CONTACT END -->
@endpush

@push('css')
    <link rel="stylesheet" type="text/css" href="calendar/dist/css/pignose.calendar.css" />
@endpush

@push('js')
    <script type="text/javascript" src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
    <script type="text/javascript" src="calendar/dist/js/pignose.calendar.full.min.js"></script>
    <script>
        var header = document.querySelector('header');
        header.classList.add('header__with__bg');

        $('.calendar').pignoseCalendar({
            theme: 'blue',
            disabledWeekdays: [0, 6],
            lang: "{{ config('app.locale') }}",
            enabledDates: @json($enabledDates),
            select: function(date, context) {
                var a = new Date(date);
                $('#date').val(formatDate(a));
            }
        });

        function formatDate(date) {
            var year = date.getFullYear();
            var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if needed
            var day = date.getDate().toString().padStart(2, '0'); // Add leading zero if needed
            return year + '-' + month + '-' + day;
        }
    </script>
@endpush
