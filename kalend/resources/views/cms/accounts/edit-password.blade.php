@extends('cms.template.index')

@push('page_name') Bảo mật @endpush

@push('content')
    <div class="cui__layout__content">
        <div class="cui__breadcrumbs">
            <div class="cui__breadcrumbs__path">
                <span>{{ $common->web_name }}</span>
                <span>
                    <span class="cui__breadcrumbs__arrow"></span>
                    <strong class="cui__breadcrumbs__current">Bảo mật</strong>
                </span>
            </div>
        </div>

        <div class="cui__utils__content">
            <div class="row">
                <div class="col-md-6">
                    <form id="form-data" method="post" action="{{ route('cms.accounts.change-password') }}">
                        @csrf @method('put')
                        <div class="card">
                            <div class="card-header card-header-borderless">
                                <h5>
                                    <span>Đổi mật khẩu</span>
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="form-group">
                                    <input name="password" class="form-control" type="password" maxlength="100"
                                        placeholder="{{ trans('cms.new_password') }}"
                                        name-validation="{{ trans('cms.password') }}" data-validation="[NOTEMPTY,L>=8]">
                                </div>
                                <div class="form-group">
                                    <input name="password_confirmation" class="form-control" type="password" maxlength="100"
                                        placeholder="{{ trans('cms.confirm_password') }}"
                                        name-validation="{{ trans('cms.password') }}" data-validation="[V==password]">
                                </div>
                                <div class="form-actions text-right mb-0">
                                    <button type="submit" data-style="slide-right"
                                        class="btn btn-primary text-center px-5 ladda-button">
                                        <span class="ladda-label">Đổi mật khẩu</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endpush

@push('scripts')
    <script>
        $('#form-data').validate({
            messages: {
                'NOTEMPTY': "{{ trans('validation.required', ['attribute' => '$']) }}",
                '>=': "{{ trans('validation.min.string', ['attribute' => '$', 'min' => '%']) }}",
				'==': "{{ trans('validation.confirmed_password') }}",
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
    </script>
@endpush
