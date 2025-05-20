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
                    <div class="ml-auto d-flex flex-column justify-content-center">
                        <a href="{{ route('cms.system.new') }}" class="btn btn-primary">
                            <i class="fe fe-plus"></i> Thêm mới
                        </a>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-5 col-sm-6 col-xs-12">
                            <form action="{{ route('cms.system') }}">
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">#</span>
                                    </div>
                                    <input type="text" class="form-control" name="search"
                                        value="{{ request()->get('search') }}" placeholder="Tìm kiếm">
                                    <div class="input-group-append">
                                        <button class="btn btn-primary" type="submit">
                                            <i class="fe fe-search align-middle"></i>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <table class="table table-hover nowrap" id="table">
                        <thead class="thead-default">
                            <tr>
                                <th>Code</th>
                                <th style="width: 200px">Chỉnh sửa</th>
                                <th style="min-width: 200px">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($list->data as $row)
                                <tr>
                                    <td @if ($row->trashed()) class="text-deleted" @endif>{{ '#' . $row->code }}
                                    </td>
                                    <td>{{ date('d-m-Y H:i', strtotime($row->updated_at)) }}</td>
                                    <td>
                                        <a href="{{ route('cms.system.edit', $row->id) }}"
                                            class="btn btn-sm btn-outline-warning mr-2 btn-w-100">
                                            <i class="fe fe-edit mr-2"></i> Sửa</a>
                                        @if ($row->trashed())
                                            <a href="javascript: void(0);" onclick="submitDeleteForm({{ $row->id }});"
                                                class="btn btn-sm btn-outline-secondary btn-w-100">
                                                <i class="fe fe-rotate-ccw mr-2"></i> Hoàn</a>
                                        @else
                                            <a href="javascript: void(0);" onclick="submitDeleteForm({{ $row->id }});"
                                                class="btn btn-sm btn-outline-danger btn-w-100">
                                                <i class="fe fe-trash mr-2"></i> Xóa</a>
                                        @endif
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                    @include('cms.template.pagination-table')
                </div>
            </div>
        </div>
    </div>
    <form id="form-delete" action="{{ route('cms.system.delete', 'pId') }}" method="post" style="display: none;">
        @csrf @method('delete')
    </form>
@endpush

@push('scripts')
    <script>
        function submitDeleteForm(id) {
            var url = "{{ route('cms.system.delete', 'pId') }}";
            url = url.replace('pId', id);
            $('#form-delete').attr('action', url).submit();
        }

        $(function() {
            $('#table').DataTable({
                responsive: true,
                paging: false,
                ordering: false,
                searching: false,
                info: false,
            })
        });
    </script>
@endpush
