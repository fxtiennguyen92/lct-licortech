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
                        <h5 class="mb-0"><strong>{{ trans('text.script_all_page') }}</strong></h5>
                    </div>
                    <div class="ml-auto d-flex flex-column justify-content-center">
                        <a href="javascript: location.reload();" class="btn btn-sm btn-light mr-2" title="Tải lại">
                            <i class="fe fe-rotate-ccw"></i>
                        </a>
                    </div>
                </div>
                <div class="card-body">
                    <form method="post" action="{{ route('cms.script.update') }}">
                        @csrf @method('put')
                        <div class="form-group">
                            <label class="form-label">{{ trans('text.script_head') }}</label>
                            <textarea class="form-control" name="src_tag_head" rows="2">{!! old('src_tag_head') ? old('src_tag_head') : $data->head->value !!}</textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">{{ trans('text.script_body_bottom') }}</label>
                            <textarea class="form-control" name="src_tag_body_bottom" rows="2">{!! old('src_tag_body_bottom') ? old('src_tag_body_bottom') : $data->body_bottom->value !!}</textarea>
                        </div>
                        <div class="form-actions text-right">
                            <button type="submit" class="btn btn-primary"><i class="fe fe-edit mr-md-2"></i> Cập
                                nhật</button>
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
    </script>
@endpush
