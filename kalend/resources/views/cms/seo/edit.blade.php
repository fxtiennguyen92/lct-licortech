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
                    <a href="{{ route('cms.seo') }}">{{ $page->name }}</a>
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
                <div class="card-header card-header-flex">
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
                    <form method="post" action="{{ route('cms.seo.page.update', $data->id) }}"
                        enctype="multipart/form-data">
                        @csrf @method('put')

                        @foreach ($data->seo as $seo)
                            @if ($seo->property != 'og:image')
                                <div class="form-group">
                                    <label class="form-label">{{ $seo->name ? $seo->name : $seo->property }}</label>
                                    <textarea class="form-control" name="seo_{{ $seo->id }}" rows="1">{!! old('content', $seo->content) !!}</textarea>
                                </div>
                            @else
                                <div class="form-group">
                                    <label class="form-label">{{ trans('text.image') . ' (og:image)  1200x627 or  400x209' }}</label>
                                    <input type="file" class="dropify" name="image"
                                        @if ($seo->content) data-default-file="{{ $seo->content }}" @endif />
                                </div>
                            @endif
                        @endforeach

                        <div class="form-actions text-right">
                            <button type="submit" class="btn btn-primary">
                                <i class="fe fe-edit mr-md-2"></i> {{ trans('button.submit') }}</button>
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
