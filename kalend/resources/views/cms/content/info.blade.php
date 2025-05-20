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
                    <strong>{{ $page->name }}</strong>
                </span>
            </div>
        </div>

        <div class="cui__utils__content">
            <div class="card">
                <div class="card-header card-header-flex">
                    <div class="d-flex flex-column justify-content-center">
                        <h5 class="mb-0"><strong>{{ $page->head_title }}</strong></h5>
                    </div>
                    <div class="ml-auto d-flex flex-column justify-content-center">
                        <a href="javascript: location.reload();" class="btn btn-sm btn-light mr-2" title="Tải lại">
                            <i class="fe fe-rotate-ccw"></i>
                        </a>
                    </div>
                </div>
                <div class="card-body">
                    <form id="form-data" method="post" action="{{ route('cms.info.update') }}"
                        enctype="multipart/form-data">
                        @csrf @method('put')
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="form-lable">Tên Website<span class="text-danger">*</span></label>
                                    <input class="form-control" type="text" name="web_name" maxlength="50"
                                        value="{{ old('web_name') ? old('web_name') : $data->web_name->value }}"
                                        name-validation="Tên Website" data-validation="[NOTEMPTY]">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="form-lable">Icon</label>
                                    <input type="file" class="dropify" name="web_icon"
                                        @if ($data->web_icon->value) data-default-file="{{ $data->web_icon->value }}" @endif />
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="form-lable">Logo</label>
                                    <input type="file" class="dropify" name="web_logo"
                                        @if ($data->web_logo->value) data-default-file="{{ $data->web_logo->value }}" @endif />
                                </div>
                            </div>
                            @if ($common->has_web_logo_2)
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label class="form-lable">Logo (Black background)</label>
                                        <input type="file" class="dropify" name="web_logo_2"
                                            @if ($data->web_logo_2->value) data-default-file="{{ $data->web_logo_2->value }}" @endif />
                                    </div>
                                </div>
                            @endif
                            @if ($common->has_footer_text)
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label class="form-lable">Giới thiệu ở cuối trang (footer)</label>
                                        <textarea class="form-control" name="footer_text" rows="2">{!! old('footer_text') ? old('footer_text') : $data->footer_text->value !!}</textarea>
                                    </div>
                                </div>
                            @endif
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="form-lable">Facebook</label>
                                    <input class="form-control" type="text" name="facebook" maxlength="250"
                                        value="{{ old('facebook') ? old('facebook') : $data->facebook->value }}">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="form-lable">Linkedin</label>
                                    <input class="form-control" type="text" name="linkedin" maxlength="250"
                                        value="{{ old('linkedin') ? old('linkedin') : $data->linkedin->value }}">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="form-lable">X</label>
                                    <input class="form-control" type="text" name="x" maxlength="250"
                                        value="{{ old('x') ? old('x') : $data->x->value }}">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-actions text-right">
                                    <button type="submit" class="btn btn-primary"><i class="fe fe-edit mr-md-2"></i>{{ __('button.confirm') }}</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            @foreach ($data->offices as $key => $office)
                <div class="card">
                    <div class="card-header card-header-borderless">
                        <h5><strong>Office #{{ $key + 1 }}</strong></h5>
                    </div>
                    <div class="card-body">
                        <form method="post" action="{{ route('cms.office.update', $office->id) }}">
                            @csrf @method('put')
                            <div class="form-group">
                                <label class="form-label">Tên công ty</label>
                                <div class="form-row">
                                    <div class="col-md-4">
                                        <input class="form-control" type="text" name="name" maxlength="100"
                                            value="{{ old('name') ? old('name') : $office->name }}">
                                    </div>
                                    <div class="col-md-8">
                                        <input class="form-control" type="text" name="sub_name" maxlength="200"
                                            value="{{ old('sub_name') ? old('sub_name') : $office->sub_name }}">
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Địa chỉ</label>
                                <div class="form-row">
                                    <div class="col-md-6">
                                        <input class="form-control" type="text" name="address_1" maxlength="200"
                                            placeholder="Địa chỉ 1"
                                            value="{{ old('address_1') ? old('address_1') : $office->address_1 }}">
                                    </div>
                                    <div class="col-md-6">
                                        <input class="form-control" type="text" name="address_2" maxlength="200"
                                            placeholder="Địa chỉ 2"
                                            value="{{ old('address_2') ? old('address_2') : $office->address_2 }}">
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Điện thoại</label>
                                <div class="form-row">
                                    <div class="col-md-6">
                                        <input class="form-control" type="text" name="phone_1" maxlength="50"
                                            placeholder="Điện thoại 1"
                                            value="{{ old('phone_1') ? old('phone_1') : $office->phone_1 }}">
                                    </div>
                                    <div class="col-md-6">
                                        <input class="form-control" type="text" name="phone_2" maxlength="50"
                                            placeholder="Điện thoại 2"
                                            value="{{ old('phone_2') ? old('phone_2') : $office->phone_2 }}">
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Email</label>
                                <div class="form-row">
                                    <div class="col-md-6">
                                        <input class="form-control" type="text" name="email_1" maxlength="150"
                                            placeholder="Email 1"
                                            value="{{ old('email_1') ? old('email_1') : $office->email_1 }}">
                                    </div>
                                    <div class="col-md-6">
                                        <input class="form-control" type="text" name="email_2" maxlength="150"
                                            placeholder="Email 2"
                                            value="{{ old('email_2') ? old('email_2') : $office->email_2 }}">
                                    </div>
                                </div>
                            </div>

                            <div class="form-actions text-right">
                                <button type="submit" class="btn btn-primary"><i class="fe fe-edit mr-md-2"></i> Cập
                                    nhật</button>
                            </div>
                        </form>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
@endpush

@push('scripts')
    <script>
        autosize($('textarea'));
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
