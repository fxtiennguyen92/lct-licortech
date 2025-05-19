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
                <div class="col-md-12">
                    <form id="form-data" method="post" action="{{ route('cms.post.create') }}"
                        enctype="multipart/form-data">
                        @csrf
                        <div class="card">
                            <div class="card-body">
                                <div class="form-group">
                                    <label class="form-label">{{ trans('text.title') }}<small
                                            class="text-danger">*</small></label>
                                    <input class="form-control" id="blogTitle" type="text" name="title" maxlength="250"
                                        value="{{ old('title') }}" name-validation="{{ trans('text.title') }}"
                                        data-validation="[NOTEMPTY]">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Link</label>
                                    <input class="form-control" id="blogRoute" type="text" name="route" maxlength="250"
                                        value="{{ old('route') }}" name-validation="Link" data-validation="[NOTEMPTY]">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">{{ trans('text.status') }}</label>
                                    <label class="ml-5 kit__utils__control kit__utils__control__checkbox">
                                        <input type="checkbox" name="active_flg"
                                            @if (old('active_flg')) checked="checked" @endif>
                                        <span class="kit__utils__control__indicator"></span>
                                        {{ trans('text.active') }}
                                    </label>
                                    <label class="ml-5 kit__utils__control kit__utils__control__checkbox">
                                        <input type="checkbox" name="featured_flg"
                                            @if (old('featured_flg')) checked="checked" @endif>
                                        <span class="kit__utils__control__indicator"></span>
                                        {{ trans('text.featured') }}
                                    </label>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">{{ trans('text.image') }}</label>
                                    <input type="file" class="dropify" name="image" />
                                </div>
                                <div class="form-group">
                                    <label class="form-label">{{ trans('text.content') }}</label>
                                    <textarea id="summernote" class="form-control" placeholder="{{ trans('text.content') }}" name="content" rows="5">{!! old('content') !!}</textarea>
                                </div>
                                <h5><strong>SEO</strong></h5>
                                <div class="form-group">
                                    <label class="form-label">Tag Description</label>
                                    <textarea class="form-control" placeholder="Mô tả trang" name="meta_description" rows="2">{!! old('meta_description') !!}</textarea>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Tag Keywords</label>
                                    <textarea class="form-control" placeholder="Từ khóa" name="meta_keywords" rows="1">{!! old('meta_keywords') !!}</textarea>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Others</label>
                                    <textarea class="form-control" placeholder="Các thẻ meta" name="meta_tags" rows="1">{!! old('meta_tags') !!}</textarea>
                                </div>
                                <div class="form-actions text-right">
                                    <button type="submit" data-style="slide-right"
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
        autosize($('textarea'));
        $('#summernote').summernote({
            height: 350,
        });

        function convertToSlug(string) {
            const a = 'àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;'
            const b = 'aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------'
            const p = new RegExp(a.split('').join('|'), 'g')
            return string.toString().toLowerCase()
                .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
                .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
                .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
                .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
                .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
                .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
                .replace(/đ/gi, 'd')
                .replace(/\s+/g, '-')
                .replace(p, c => b.charAt(a.indexOf(c)))
                .replace(/&/g, '-and-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '')
        };

        $('#blogTitle').on('input', function() {
            $('#blogRoute').val(convertToSlug($('#blogTitle').val()));
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
