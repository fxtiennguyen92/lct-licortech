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
                    <a href="{{ route('cms.content') }}">{{ $page->name }}</a>
                </span>
                <span>
                    <span class="cui__breadcrumbs__arrow"></span>
                    <a href="{{ route('cms.pages.edit', $data->id) }}" class="cui__breadcrumbs__current">
                        <strong>{{ $data->name }}</strong></a>
                </span>
            </div>
        </div>
        <div class="cui__utils__content">
            <div class="card">
                <div class="card-header card-header-borderless card-header-flex">
                    <div class="d-flex flex-column justify-content-center">
                        <h5 class="mb-0"><strong>{{ $data->name }}</strong>
                            <span class="text-muted">{{ '#' . $data->code }}</span>
                        </h5>
                    </div>
                    <div class="ml-auto d-flex flex-column justify-content-center">
                        <a href="javascript: location.reload();" class="btn btn-sm btn-light mr-2" title="Tải lại">
                            <i class="fe fe-rotate-ccw"></i>
                        </a>
                    </div>
                </div>
                <div class="card-body">
                    <form id="form-data" method="post" action="{{ route('cms.content.page.update', $data->id) }}"
                        enctype="multipart/form-data">
                        @csrf @method('put')
                        <!-- Submit button -->
                        <div class="kit__chat">
                            <button type="submit" class="btn btn-primary" id="btn-submit">
                                <i class="fe fe-edit mr-md-2"></i> Cập nhật
                            </button>
                        </div>

                        <div class="accordion" id="accordion" role="tablist">
                            <!-- Sections -->
                            @foreach ($data->sections as $key => $section)
                                <div class="card">
                                    <div class="card-header" role="tab" id="heading{{ $key + 1 }}"
                                        data-toggle="collapse" data-parent="#accordion"
                                        data-target="#collapse{{ $key + 1 }}" aria-expanded="true"
                                        aria-controls="collapse{{ $key + 1 }}">
                                        <div class="card-title">
                                            <span class="accordion-indicator pull-right">
                                                <i class="plus fe fe-plus"></i>
                                                <i class="minus fe fe-minus"></i>
                                            </span>
                                            <strong class="text-capitalize"><i class="fe fe-box text-muted"></i>
                                                {{ $section->name }} <small
                                                    class="text-lowercase">#{{ $section->code }}</small></strong>
                                        </div>
                                    </div>
                                    <div id="collapse{{ $key + 1 }}" class="card-collapse collapse show"
                                        aria-labelledby="heading{{ $key + 1 }}">
                                        <div class="card-body">
                                            <div class="row">
                                                <!-- Texts -->
                                                @foreach ($section->texts as $tkey => $text)
                                                    <div class="col-md-12">
                                                        <div class="card mb-4">
                                                            <div class="card-body">
                                                                <div class="mb-3">
                                                                    <strong><i class="fe fe-type text-muted"></i>
                                                                        Group Text #{{ $tkey + 1 }}</strong>
                                                                </div>
                                                                <div class="row">
                                                                    <div class="col-md-1"></div>
                                                                    <div class="col-md-11">
                                                                        @if (in_array('title', $text->list_dsp))
                                                                            <div class="form-group">
                                                                                <textarea class="form-control" placeholder="Title" name="texts[{{ $text->id }}][title]" rows="1">{!! old('texts[{{ $text->id }}][title]', $text->{'title' . $curLanguage}) !!}</textarea>
                                                                            </div>
                                                                        @endif
                                                                        @if (in_array('sub_title', $text->list_dsp))
                                                                            <div class="form-group">
                                                                                <textarea class="form-control" placeholder="Sub title" name="texts[{{ $text->id }}][sub_title]" rows="1">{!! old('texts[{{ $text->id }}][sub_title]', $text->{'sub_title' . $curLanguage}) !!}</textarea>
                                                                            </div>
                                                                        @endif
                                                                        @if (in_array('sub_title_2', $text->list_dsp))
                                                                            <div class="form-group">
                                                                                <textarea class="form-control" placeholder="Sub title" name="texts[{{ $text->id }}][sub_title_2]" rows="1">{!! old('texts[{{ $text->id }}][sub_title_2]', $text->{'sub_title_2' . $curLanguage}) !!}</textarea>
                                                                            </div>
                                                                        @endif
                                                                        @if (in_array('content', $text->list_dsp))
                                                                            <div class="form-group">
                                                                                <textarea class="form-control" placeholder="Content" name="texts[{{ $text->id }}][content]" rows="1">{!! old('texts[{{ $text->id }}][content]', $text->{'content' . $curLanguage}) !!}</textarea>
                                                                            </div>
                                                                        @endif
                                                                        @if (in_array('content_2', $text->list_dsp))
                                                                            <div class="form-group">
                                                                                <textarea class="form-control" placeholder="Content" name="texts[{{ $text->id }}][content_2]" rows="1">{!! old('texts[{{ $text->id }}][content_2]', $text->{'content_2' . $curLanguage}) !!}</textarea>
                                                                            </div>
                                                                        @endif
                                                                        @if (in_array('image', $text->list_dsp))
                                                                            <div class="form-group">
                                                                                <input type="file" class="dropify"
                                                                                    name="texts[{{ $text->id }}][image]"
                                                                                    @if ($text->image) data-default-file="{{ $text->image }}" @endif />
                                                                            </div>
                                                                        @endif
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                @endforeach

                                                <!-- Buttons -->
                                                @foreach ($section->buttons as $bkey => $button)
                                                    <div class="col-md-12">
                                                        <div class="card mb-4">
                                                            <div class="card-body">
                                                                <div class="mb-3">
                                                                    <strong><i class="fe fe-square text-muted"></i>
                                                                        Button #{{ $tkey + 1 }}</strong>
                                                                </div>
                                                                <div class="row">
                                                                    <div class="col-md-1"></div>
                                                                    <div class="col-md-8">
                                                                        <div class="form-group">
                                                                            <input class="form-control" type="text"
                                                                                name="buttons[{{ $button->id }}][text]"
                                                                                maxlength="45"
                                                                                value="{!! old('buttons[{{ $button->id }}][text]', $button->{'text' . $curLanguage}) !!}"
                                                                                name-validation="{{ trans('text.name') }}"
                                                                                data-validation="[NOTEMPTY]">
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="row">
                                                                    <div class="col-md-1"></div>
                                                                    <div class="col-md-11">
                                                                        <div class="input-group">
                                                                            <div class="input-group-prepend">
                                                                                <span class="input-group-text">
                                                                                    <i class="fe fe-link"></i>
                                                                                </span>
                                                                            </div>
                                                                            <input class="form-control" type="text"
                                                                                name="buttons[{{ $button->id }}][redirect]"
                                                                                maxlength="250"
                                                                                value="{!! old('buttons[{{ $button->id }}][redirect]', $button->redirect) !!}">
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                @endforeach

                                                <!-- Images -->
                                                @foreach ($section->images as $ikey => $image)
                                                    <div class="col-md-6">
                                                        <div class="card mb-4">
                                                            <div class="card-body">
                                                                <div class="mb-3 d-flex">
                                                                    <div class="d-flex flex-column justify-content-center">
                                                                        <strong><i class="fe fe-image text-muted"></i>
                                                                            Image #{{ $ikey + 1 }}</strong>
                                                                    </div>
                                                                </div>
                                                                <div class="row">
                                                                    <div class="col-md-12">
                                                                        <div class="form-group">
                                                                            <input type="file" class="dropify"
                                                                                name="images[{{ $image->id }}][src]"
                                                                                @if ($image->src) data-default-file="{{ $image->src }}" @endif />
                                                                        </div>

                                                                        @if (in_array('name', $image->list_dsp))
                                                                            <div class="form-group">
                                                                                <input class="form-control" type="text"
                                                                                    placeholder="{{ trans('text.name') }}"
                                                                                    name="images[{{ $image->id }}][name]"
                                                                                    maxlength="250"
                                                                                    value="{!! old('images[{{ $image->id }}][name]', $image->{'name' . $curLanguage}) !!}">
                                                                            </div>
                                                                        @endif

                                                                        @if (in_array('redirect', $image->list_dsp))
                                                                            <div class="form-group input-group">
                                                                                <div class="input-group-prepend">
                                                                                    <span class="input-group-text"><i
                                                                                            class="fe fe-link"></i></span>
                                                                                </div>
                                                                                <input class="form-control" type="text"
                                                                                    name="images[{{ $image->id }}][redirect]"
                                                                                    maxlength="250"
                                                                                    value="{!! old('images[{{ $image->id }}][redirect]', $image->redirect) !!}">
                                                                            </div>
                                                                        @endif

                                                                        @if (in_array('content', $image->list_dsp))
                                                                            <div class="form-group">
                                                                                <textarea class="form-control" placeholder="Content" name="images[{{ $image->id }}][content]" rows="1">{!! old('images[{{ $image->id }}][content]', $image->{'content' . $curLanguage}) !!}</textarea>
                                                                            </div>
                                                                        @endif

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                @endforeach
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            @endforeach
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
                        $('#btn-submit').attr('disabled', 'disabled');
                    }
                }
            }
        })
    </script>
@endpush
