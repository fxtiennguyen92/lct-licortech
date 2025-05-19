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
                    <a href="{{ route('cms.pages') }}">{{ $page->name }}</a>
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
                    <form id="form-data" method="post" action="{{ route('cms.pages.create') }}">
                        @csrf
                        <div class="card">
                            <div class="card-body">
                                <div class="form-group">
                                    <label class="form-label">Code<small class="text-danger">*</small></label>
                                    <input class="form-control" type="text" name="code" maxlength="50"
                                        value="{{ old('code') }}" name-validation="Code"
                                        data-validation="[NOTEMPTY]">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">{{ trans('text.name') }}<small
                                            class="text-danger">*</small></label>
                                    <input class="form-control" type="text" name="name" maxlength="250"
                                        value="{{ old('name') }}"
                                        name-validation="{{ trans('text.name') }}" data-validation="[NOTEMPTY]">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">{{ trans('text.head_title') }}</label>
                                    <input class="form-control" type="text" name="head_title" maxlength="250"
                                        value="{{ old('head_title') }}"
                                        name-validation="{{ trans('text.head_title') }}">
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-8">
                                        <label class="form-label">Route</label>
                                        <input class="form-control" type="text" name="route" maxlength="250"
                                            value="{{ old('route') }}"
                                            name-validation="Route">
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label class="form-label">{{ trans('text.order_dsp') }}</label>
                                        <input class="form-control text-right" type="number" name="order_dsp" maxlength="2"
                                            value="{{ old('order_dsp') ? old('order_dsp') : 0 }}"
                                            name-validation="{{ trans('text.order_dsp') }}" data-validation="[INTEGER]">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label"><strong>{{ trans('text.status') }}</strong></label>
                                    <label class="kit__utils__control kit__utils__control__checkbox">
                                        <input type="checkbox" name="active_flg" @if (old('active_flg')) checked="checked" @endif>
                                        <span class="kit__utils__control__indicator"></span>
                                        {{ trans('text.active') }}
                                    </label>
                                    <label class="kit__utils__control kit__utils__control__checkbox">
                                        <input type="checkbox" name="cms_flg" @if (old('cms_flg')) checked="checked" @endif>
                                        <span class="kit__utils__control__indicator"></span>
                                        {{ trans('text.cms') }}
                                    </label>
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
                'INTEGER': "{{ trans('validation.integer', ['attribute' => '$']) }}",
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
