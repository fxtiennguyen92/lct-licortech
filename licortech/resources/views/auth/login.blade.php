@extends('auth.template.index')

@push('page_name')
    {{ $page->head_title }}
@endpush

@push('content')
    <div class="cui__auth__containerInner">
        <div class="text-center mb-5">
            <h1 class="mb-5 px-3 font-weight-bold">
                <span class="text-primary">{{ $page->{'name'} }}</span>
            </h1>
        </div>
        <div class="card cui__auth__boxContainer"> @php
            $section = $page->sections[array_search('login_view', array_column(json_decode($page->sections), 'code'))];
        @endphp

            <div class="text-dark font-size-24 mb-4">{{ $section->texts[0]->{'title'} }}</div>
            <form id="form-validation-login" class="mb-4" method="post" action="{{ route('login') }}">
                @csrf

                <div class="form-group mb-4">
                    <input name="email" class="form-control" type="text" maxlength="255" autofocus="autofocus"
                        placeholder="{{ trans('cms.email') }}" name-validation="{{ trans('cms.email') }}"
                        data-validation="[NOTEMPTY,EMAIL]" value="{{ old('email') }}">
                </div>
                <div>
                    <input name="password" class="form-control show-password" type="password" maxlength="255"
                        placeholder="{{ trans('cms.password') }}" name-validation="{{ trans('cms.password') }}"
                        data-validation="[NOTEMPTY]">
                </div>
                <div>
                    <button id="button-login" type="submit" data-style="slide-right"
                        class="btn btn-primary text-center w-100 mt-4 ladda-button">
                        <span class="ladda-label">{{ $section->buttons[0]->{'text'} }}</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
@endpush

@push('js')
    <script>
        $('#form-validation-login').validate({
            messages: {
                'NOTEMPTY': "{{ trans('validation.required', ['attribute' => '$']) }}",
                'EMAIL': "{{ trans('validation.email', ['attribute' => '$']) }}",
            },
            submit: {
                settings: {
                    inputContainer: '.form-group',
                    errorListClass: 'form-control-error-list',
                    errorClass: 'has-danger',
                },
                callback: {
                    onBeforeSubmit: function() {
                        var l = Ladda.create(document.querySelector("button[type='submit']"));
                        l.start();
                    }
                }
            }
        })

        $('#form-validation-login .remove-error').on('click', function() {
            $('#form-validation-login').removeError();
        })
    </script>
@endpush
