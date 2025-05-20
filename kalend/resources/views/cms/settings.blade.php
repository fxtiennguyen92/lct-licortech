@extends('cms.template.layout')

@push('pagename')
    {{ trans('cms.menu.basic_info') }}
@endpush

@push('content')
    <div class="cui__layout__content">
        <div class="cui__breadcrumbs">
            <div class="cui__breadcrumbs__path">
                <span>{{ trans('cms.menu.settings') }}</span>
                <span>
                    <span class="cui__breadcrumbs__arrow"></span>
                    <strong class="cui__breadcrumbs__current">{{ trans('cms.menu.basic_info') }}</strong>
                </span>
            </div>
        </div>

        <div class="cui__utils__content">
            <div class="card">
                <div class="card-body">
                    <h5 class="mb-4">{{ trans('cms.web_info') }}</h5>
                    <form id="form-validation" name="form" method="post" action="{{ route('cms.settings.web') }}"
                        enctype="multipart/form-data">
                        @csrf
                        <div class="form-group row">
                            <label class="col-md-3 col-form-label" for="pageName">Tên trang web</label>

                            <div class="col-md-6">
                                <input type="text" class="form-control" placeholder="Tên trang web" id="pageName"
                                    name="page_name" value="{{ $info->page_name }}">
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="col-md-3 col-form-label">Logo & Favicon</label>
                            <div class="col-md-3">
                                <input type="file" class="dropify" name="logo" data-show-remove="false"
                                    data-default-file="images/basic/{{ $info->logo }}" />
                            </div>

                            <div class="col-md-3">
                                <input type="file" class="dropify" name="favicon" data-show-remove="false"
                                    data-default-file="images/basic/{{ $info->favicon }}" />
                            </div>
                        </div>

                        <div class="form-group row">
                            <label class="col-md-3 col-form-label">Giới thiệu ngắn ở cuối trang</label>
                            <div class="col-md-6">
                                <textarea id="footerText" class="form-control" name="footer_text"
                                    placeholder="Giới thiệu ở cuối trang (phía dưới logo)">{{ $basicInfo->footer_text }}</textarea>
                            </div>
                        </div>

                        <div class="form-actions">

                            <button type="submit" class="btn btn-primary px-5">{{ trans('button.submit') }}</button>

                        </div>

                    </form>

                </div>

            </div>



            <div class="card">

                <div class="card-body">

                    <h5 class="mb-4">{{ trans('cms.company_info') }}</h5>

                    <form id="form-validation" name="form" method="post" action="{{ route('cms.settings.company') }}">

                        @csrf

                        <div class="form-group row">

                            <label class="col-md-3 col-form-label" for="name">Tên công ty</label>

                            <div class="col-md-6">

                                <input type="text" class="form-control" placeholder="Tên công ty" id="name"
                                    name="name" value="{{ $info->name }}">

                            </div>

                        </div>

                        <div class="form-group row">

                            <label class="col-md-3 col-form-label" for="address1">Tên tòa nhà</label>

                            <div class="col-md-6">

                                <input type="text" class="form-control" placeholder="Địa chỉ 1" id="address1"
                                    name="address1" value="{{ $info->address1 }}">

                            </div>

                        </div>

                        <div class="form-group row">

                            <label class="col-md-3 col-form-label" for="address2">Địa chỉ</label>

                            <div class="col-md-6">

                                <input type="text" class="form-control" placeholder="Địa chỉ 2" id="address2"
                                    name="address2" value="{{ $info->address2 }}">

                            </div>

                        </div>

                        <div class="form-group row">

                            <label class="col-md-3 col-form-label" for="tel1">Số điện thoại 1 (ưu tiên)</label>

                            <div class="col-md-6">

                                <input type="text" class="form-control" placeholder="Số điện thoại 1 (ưu tiên)"
                                    id="tel1" name="tel1" value="{{ $info->tel1 }}">

                            </div>

                        </div>

                        <div class="form-group row">

                            <label class="col-md-3 col-form-label" for="tel2">Số điện thoại 2</label>

                            <div class="col-md-6">

                                <input type="text" class="form-control" placeholder="Số điện thoại 2" id="tel2"
                                    name="tel2" value="{{ $info->tel2 }}">

                            </div>

                        </div>

                        <div class="form-group row">

                            <label class="col-md-3 col-form-label" for="email1">Email 1 (ưu tiên)</label>

                            <div class="col-md-6">

                                <input type="text" class="form-control" placeholder="Email 1 (ưu tiên)"
                                    id="email1" name="email1" value="{{ $info->email1 }}">

                            </div>

                        </div>

                        <div class="form-group row">

                            <label class="col-md-3 col-form-label" for="email1">Email 2</label>

                            <div class="col-md-6">

                                <input type="text" class="form-control" placeholder="Email 2" id="email2"
                                    name="email2" value="{{ $info->email2 }}">

                            </div>

                        </div>

                        <div class="form-actions">

                            <button type="submit" class="btn btn-primary px-5">{{ trans('button.submit') }}</button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    </div>
@endpush



@push('scripts')
    <script>
        ;
        (function($) {

            'use strict'

            $(function() {

                $('.dropify').dropify();

                autosize($('#footerText'));

            })

        })(jQuery)
    </script>
@endpush
