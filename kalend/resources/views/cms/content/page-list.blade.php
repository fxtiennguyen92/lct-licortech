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
            <div class="kit__utils__heading">
                <h5>
                    <span class="mr-3">{{ $page->head_title }}</span>
                </h5>
            </div>
            <div class="card">
                <div class="card-body">
                    <table class="table table-hover nowrap" id="table">
                        <thead class="thead-default">
                            <tr>
                                <th>Code</th>
                                <th>{{ trans('text.name') }}</th>
                                <th class="text-center">{{ trans('text.active') }}</th>
                                <th style="width: 100px">{{ trans('text.action') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($list as $row)
                                <tr>
                                    <td>{{ '#'.$row->code }}</td>
                                    <td>{{ $row->name }}</td>
                                    <td class="text-center font-size-12">
                                        @if ($row->active_flg)
                                            <span class="badge badge-success">{{ trans('text.active') }}</span>
                                        @endif
                                    </td>
                                    <td>
                                        @if (sizeof($row->sections) > 0)
                                        <a href="{{ route('cms.content.page', $row->id) }}" class="btn btn-sm btn-outline-success mr-2">
                                            <i class="fe fe-edit mr-2"></i> {{ trans('button.view') }}</a>
                                        @endif
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endpush

@push('scripts')
    <script>
        $(function() {
            $('#table').DataTable({
                responsive: true,
                paging: true,
                ordering: false,
                searching: true,
                info: false,
            })
        });
    </script>
@endpush
