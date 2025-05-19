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
                    <strong class="cui__breadcrumbs__current">{{ $page->name }}</strong>
                </span>
            </div>
        </div>

        <div class="cui__utils__content">
            <div class="card">
                <div class="card-header card-header-borderless card-header-flex">
                    <div class="d-flex flex-column justify-content-center">
                        <h5 class="mb-0"><strong>{{ $page->head_title }}</strong></h5>
                    </div>
                </div>
                <div class="card-body">
                    @foreach ($list as $serv)
                        <div class="card">
                            <div class="card-header card-header-borderless">
                                <h5 class="mb-0">{{ $serv->{'name' . $curLanguage} }}</h5>
                            </div>
                            <div class="card-body">
                                <form class="form-data" method="post"
                                    action="{{ route('cms.services.update', $serv->id) }}" enctype="multipart/form-data">
                                    @method('put') @csrf
                                    <div class="row">
                                        <div class="col-md-8">
                                            <div class="row">
                                                <div class="form-group col-12">
                                                    <label class="form-lable">{{ __('text.name') }} <span
                                                            class="text-danger">*</span></label>
                                                    <input class="form-control" type="text" name="name"
                                                        maxlength="250" value="{{ $serv->{'name' . $curLanguage} }}">
                                                </div>
                                                <div class="form-group col-md-8">
                                                    <label class="form-lable">Route <span
                                                            class="text-danger">*</span></label>
                                                    <input class="form-control" type="text" name="route"
                                                        maxlength="100" data-validation="[NOTEMPTY]" required
                                                        value="{{ $serv->route }}">
                                                </div>
                                                <div class="form-group col-md-4">
                                                    <label class="form-lable">{{ __('text.order_dsp') }}</label>
                                                    <input class="form-control text-right" type="number" name="order_dsp"
                                                        min="1" data-validation="[NOTEMPTY]"
                                                        value="{{ $serv->order_dsp }}">
                                                </div>
                                                <div class="form-group col-12">
                                                    <div class="form-group">
                                                        <label class="form-lable">Description</label>
                                                        <textarea class="form-control" name="short_description" rows="2">{!! $serv->{'short_description' . $curLanguage} !!}</textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label class="form-lable">Image</label>
                                                <input type="file" class="dropify" name="image"
                                                    @if ($serv->image) data-default-file="{{ $serv->image }}" @endif />
                                            </div>
                                            <div class="form-actions text-right">
                                                <button type="submit" class="btn btn-warning"><i
                                                        class="fe fe-edit mr-md-2"></i>{{ __('button.submit') }}</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>

            <div class="card">
                <div class="card-header card-header-borderless">
                    <h5 class="mb-0"><strong>{{ __('text.add_more_elements') }}</strong></h5>
                </div>
                <div class="card-body">
                    <form id="create-form" method="post" action="{{ route('cms.services.create') }}"
                        enctype="multipart/form-data">
                        @csrf
                        <div class="row">
                            <div class="col-md-8">
                                <div class="row">
                                    <div class="form-group col-12">
                                        <label class="form-lable">{{ __('text.name') }} <span
                                                class="text-danger">*</span></label>
                                        <input class="form-control" type="text" name="name" maxlength="250"
                                            value="{{ old('name') }}">
                                    </div>
                                    <div class="form-group col-md-8">
                                        <label class="form-lable">Route <span class="text-danger">*</span></label>
                                        <input class="form-control" type="text" name="route" maxlength="100"
                                            data-validation="[NOTEMPTY]" value="{{ old('route') }}">
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label class="form-lable">{{ __('text.order_dsp') }}</label>
                                        <input class="form-control text-right" type="number" name="order_dsp"
                                            min="1" data-validation="[NOTEMPTY]" value="{{ old('order_dsp', 1) }}">
                                    </div>
                                    <div class="form-group col-12">
                                        <div class="form-group">
                                            <label class="form-lable">Description</label>
                                            <textarea class="form-control" name="short_description" rows="2">{!! old('short_description') !!}</textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="form-lable">Image</label>
                                    <input type="file" class="dropify" name="image" />
                                </div>
                                <div class="form-actions text-right">
                                    <button type="submit" class="btn btn-primary"><i
                                            class="fe fe-plus mr-md-2"></i>{{ __('button.add_new') }}</button>
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
        $('#create-form2').validate({
            messages: {
                'NOTEMPTY': "{{ trans('validation.required', ['attribute' => '$']) }}",
            },
            submit: {
                settings: {
                    inputContainer: '.form-group',
                    errorListClass: 'form-control-error-list',
                    errorClass: 'has-danger',
                },
            }
        })
    </script>
@endpush
