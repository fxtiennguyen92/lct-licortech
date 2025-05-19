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
                    <a href="{{ route('cms.post.new') }}" class="btn btn-sm btn-primary mr-2">
                        <i class="fe fe-plus"></i> Thêm bài
                    </a>
                </h5>
            </div>
            <div class="card">
                <div class="card-body">
                    <table data-order='[[ 0, "desc" ]]' class="table table-hover nowrap" id="table">
                        <thead class="thead-default">
                            <tr>
                                <th style="width: 200px">Chỉnh sửa</th>
                                <th>Bài viết</th>
                                <th class="text-center">Active</th>
                                <th class="text-center">Feature</th>
                                <th style="width: 100px">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($list as $row)
                                <tr>
                                    <td>
                                        <span style="display: none">{{ date('YmdHi', strtotime($row->updated_at)) }}</span>
                                        {{ date('d-m-Y H:i', strtotime($row->updated_at)) }}
                                    </td>
                                    <td><span title="{{ $row->title }}">{{ (strlen($row->title) > 55) ? substr($row->title, 0, 50).'...' : $row->title }}</span></td>
                                    <td class="text-center font-size-12">
                                        @if ($row->active_flg)
                                            <span class="badge badge-success">Hoạt động</span>
                                        @else
                                            <span class="badge badge-secondary">Tạm ẩn</span>
                                        @endif
                                    </td>
                                    <td class="text-center">@if ($row->featured_flg) <i class="text-success fe fe-check-square"></i> @endif</td>
                                    <td>
                                        <a href="{{ route('cms.post.edit', $row->id) }}"
                                            class="btn btn-sm btn-outline-warning mr-2">
                                            <i class="fe fe-edit"></i> Sửa</a>
                                        <a href="javascript: void(0);" onclick="submitDeleteForm({{ $row->id }});"
                                            class="btn btn-sm btn-outline-danger">
                                            <i class="fe fe-trash"></i> Xóa</a>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <form id="form-delete" action="{{ route('cms.post.delete', 'pId') }}" method="post" style="display: none;">
        @csrf @method('delete')
    </form>
@endpush

@push('scripts')
    <script>
        function submitDeleteForm(id) {
            var url = "{{ route('cms.post.delete', 'pId') }}";
            url = url.replace('pId', id);
            $('#form-delete').attr('action', url).submit();
        }

        $(function() {
            $('#table').DataTable({
                responsive: true,
                paging: true,
                ordering: true,
                searching: true,
                info: false,
            })
        });
    </script>
@endpush
