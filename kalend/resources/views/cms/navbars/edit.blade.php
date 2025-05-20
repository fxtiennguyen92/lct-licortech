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
                @if ($data->papa)
                    <span>
                        <span class="cui__breadcrumbs__arrow"></span>
                        <a href="{{ route('cms.navbars.edit', $data->papa->id) }}">{{ $data->papa->name }}</a>
                    </span>
                @endif
                <span>
                    <span class="cui__breadcrumbs__arrow"></span>
                    <strong class="cui__breadcrumbs__current">{{ $data->name }}</strong>
                </span>
            </div>
        </div>
        <div class="cui__utils__content">
            <div class="kit__utils__heading">
                <h5>
                    <span>{{ $page->head_title }}</span>
                    <small class="btn btn-sm btn-light">{{ app()->getLocale() }}</small>
                </h5>
            </div>
            <div class="row">
                <div class="col-md-8">
                    <form id="form-data" method="post" action="{{ route('cms.navbars.update', $data->id) }}">
                        @csrf @method('put')
                        <div class="card">
                            <div class="card-body">
                                <div class="form-group">
                                    <label class="form-label">{{ trans('text.name') }}<small
                                            class="text-danger">*</small></label>
                                    <input class="form-control" type="text" name="name" maxlength="50"
                                        value="{{ old('name', $data->{'name'.$curLanguage}) }}"
                                        name-validation="{{ trans('text.name') }}" data-validation="[NOTEMPTY]">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">{{ trans('text.page_redirect') }}</label>
                                    <select class="select2" id="page_select" name="page">
                                        @if (!$data->cms_flg)
                                            <option value="">{{ trans('text.not_select') }}</option>
                                        @endif
                                        <optgroup label={{ $data->cms_flg ? 'CMS' : 'Web' }}>
                                            @if ($data->page)
                                                <option value="{{ $data->page_id }}" selected>{{ $data->page->{'name'.$curLanguage} }}
                                                </option>
                                            @endif
                                            @foreach ($availablePages as $page)
                                                <option value="{{ $page->id }}">{{ $page->{'name'.$curLanguage} }}</option>
                                            @endforeach
                                        </optgroup>
                                    </select>
                                </div>
                                @if (!$data->cms_flg)
                                    <div class="form-group">
                                        <label class="form-label">{{ trans('text.redirect') }}
                                            <button type="button" class="btn btn-link text-warning" data-toggle="tooltip"
                                                data-placement="right"
                                                data-original-title="{{ trans('text.link_text_info') }}">
                                                <i class="fe fe-info"></i>
                                            </button>
                                        </label>
                                        <input class="form-control" type="text" name="redirect"
                                            value="{{ old('redirect', $data->redirect) }}">
                                    </div>
                                @endif
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label class="form-label">{{ trans('text.order_dsp') }}</label>
                                        <input class="form-control text-right" type="number" name="order_dsp"
                                            maxlength="2"
                                            value="{{ old('order_dsp', $data->order_dsp) }}"
                                            name-validation="{{ trans('text.order_dsp') }}" data-validation="[INTEGER]">
                                    </div>

                                    @if ($data->cms_flg)
                                        <div class="form-group col-md-6">
                                            <label class="form-label">{{ trans('text.icon') }}</label>
                                            <div class="input-group">
                                                <input class="form-control" type="text" id="icon" name="icon"
                                                    maxlength="100" value="{{ old('icon', $data->icon) }}">
                                                @if ($data->icon)
                                                    <div class="input-group-append">
                                                        <span class="input-group-text">
                                                            <i id="icon_test" class="{{ $data->icon }}"></i>
                                                        </span>
                                                    </div>
                                                @endif
                                            </div>
                                        </div>
                                        <div class="form-group col-md-6">
                                            <label
                                                class="form-label mt-2"><strong>{{ trans('text.permission') }}</strong></label>
                                            <label class="kit__utils__control kit__utils__control__checkbox">
                                                <input type="checkbox" name="content_flg"
                                                    @if (old('content_flg', $data->content_flg)) checked="checked" @endif>
                                                <span class="kit__utils__control__indicator"></span>
                                                {{ trans('text.role_content') }}
                                            </label>
                                        </div>
                                    @endif
                                </div>
                                <div class="form-actions text-right">
                                    <button id="button-login" type="submit" data-style="slide-right"
                                        class="btn btn-primary text-center px-5 ladda-button">
                                        <span class="ladda-label">{{ trans('button.submit') }}</span>
                                    </button>
                                    <button type="button" class="btn btn-secondary remove-error px-3"
                                        onclick="return location.reload();">{{ trans('button.reload') }}</button>
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
