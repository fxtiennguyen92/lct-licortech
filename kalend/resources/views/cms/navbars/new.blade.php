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
                    <a href="{{ route('cms.navbars') }}">{{ $page->name }}</a>
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
                    <form id="form-data" method="post" action="{{ route('cms.navbars.create') }}">
                        @csrf
                        <div class="card">
                            <div class="card-body">
                                <div class="form-group">
                                    <label class="form-label">{{ $page->name }}</label>
                                    <div>
                                        <div class="btn-group" data-toggle="buttons">
                                            <label class="btn btn-outline-primary active">
                                                <input type="radio" name="cms_flg" value="0" checked />
                                                Web
                                            </label>
                                            <label class="btn btn-outline-primary">
                                                <input type="radio" name="cms_flg" value="1" />
                                                CMS
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">{{ trans('text.name') }}<small
                                            class="text-danger">*</small></label>
                                    <input class="form-control" type="text" name="name" maxlength="50"
                                        value="{{ old('name') }}" name-validation="{{ trans('text.name') }}"
                                        data-validation="[NOTEMPTY]">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Menu Gốc</label>
                                    <select class="select2" name="parent">
                                        <option value="" selected>{{ trans('text.not_select') }}</option>
                                        <optgroup label="Web">
                                            @foreach ($webNavBars as $wbars)
                                                <option value="{{ $wbars->id }}">{{ $wbars->name }}</option>
                                            @endforeach
                                        </optgroup>
                                        <optgroup label="CMS">
                                            @foreach ($cmsNavBars as $cbars)
                                                <option value="{{ $cbars->id }}">{{ $cbars->name }}</option>
                                            @endforeach
                                        </optgroup>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Trang liên kết</label>
                                    <select class="select2" id="page_select" name="page">
                                        <option value="" selected>{{ trans('text.not_select') }}</option>
                                        <optgroup label="Web">
                                            @foreach ($webPages as $wpage)
                                                <option value="{{ $wpage->id }}">{{ $wpage->name }}</option>
                                            @endforeach
                                        </optgroup>
                                        <optgroup label="CMS">
                                            @foreach ($cmsPages as $cpage)
                                                <option value="{{ $cpage->id }}">{{ $cpage->name }}</option>
                                            @endforeach
                                        </optgroup>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Link liên kết
                                        <button type="button" class="btn btn-link text-warning" data-toggle="tooltip"
                                            data-placement="right"
                                            data-original-title="{{ trans('text.link_text_info') }}">
                                            <i class="fe fe-info"></i>
                                        </button>
                                    </label>
                                    <input class="form-control" type="text" name="redirect"
                                        value="{{ old('redirect') }}">
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label class="form-label">{{ trans('text.order_dsp') }}</label>
                                        <input class="form-control text-right" type="number" name="order_dsp"
                                            maxlength="2" value="{{ old('order_dsp', 1) }}"
                                            name-validation="{{ trans('text.order_dsp') }}" data-validation="[INTEGER]">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label class="form-label">{{ trans('text.icon') }}</label>
                                        <div class="input-group">
                                            <input class="form-control" type="text" id="icon" name="icon"
                                                maxlength="100" value="{{ old('icon') }}">
                                            <div class="input-group-append">
                                                <span class="input-group-text">
                                                    <i id="icon_test" class="fe fe-file"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label
                                            class="form-label mt-2"><strong>{{ trans('text.permission') }}</strong></label>
                                        <label class="kit__utils__control kit__utils__control__checkbox">
                                            <input type="checkbox" name="content_flg"
                                                @if (old('content_flg')) checked="checked" @endif>
                                            <span class="kit__utils__control__indicator"></span>
                                            {{ trans('text.role_content') }}
                                        </label>
                                    </div>
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
        $('.select2').select2();
        $('#icon').focusout(function() {
            if ($('#icon').val() != '') {
                $('#icon_test').removeClass().addClass($('#icon').val());
            }
        });
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
