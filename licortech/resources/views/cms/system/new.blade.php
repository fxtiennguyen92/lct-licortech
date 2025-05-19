@extends('cms.template.index')

@push('page_name')
    {{ $page->name }}
@endpush

@push('content')
    <div class="cui__layout__content">
        <div class="cui__breadcrumbs">
            <div class="cui__breadcrumbs__path">
                <span>{{ $common->web_name }}</span>
                <span>
                    <span class="cui__breadcrumbs__arrow"></span>
                    <a href="{{ route('cms.system') }}">{{ $page->name }}</a>
                </span>
                <span>
                    <span class="cui__breadcrumbs__arrow"></span>
                    <strong class="cui__breadcrumbs__current">Thêm mới</strong>
                </span>
            </div>
        </div>

        <div class="cui__utils__content">
            <div class="kit__utils__heading">
                <h5>
                    <span class="mr-3">{{ $page->head_title }}</span>
                </h5>
            </div>
            <div class="row">
                <div class="col-md-8">
                    <form id="form-data" method="post" action="{{ route('cms.system.create') }}">
                    @csrf
                        <div class="card">
                            <div class="card-body">
                                <div class="form-group">
                                    <label class="form-label">Code<small class="text-danger">*</small></label>
                                    <input class="form-control" type="text" name="code" maxlength="50"
                                        value="{{ old('code') }}"
                                        name-validation="Code"
                                        data-validation="[NOTEMPTY]">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Value</label>
                                    <input class="form-control" type="text" name="value" maxlength="200"
                                        value="{{ old('value') }}"
                                        name-validation="Value">
                                </div>
                                <div class="form-actions text-right">
                                    <button id="button-login" type="submit" data-style="slide-right"
                                        class="btn btn-primary text-center px-5 ladda-button">
                                        <span class="ladda-label">Tạo mới</span>
                                    </button>
                                    <button type="button" class="btn btn-secondary remove-error px-3"
                                        onclick="return location.reload();">Tải lại</button>
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
