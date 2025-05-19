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
                        <a href="{{ route('cms.pages.new') }}" class="btn btn-primary">
                            <i class="fe fe-plus"></i> Thêm mới
                        </a>
                    </div>
                </div>
                <div class="card-body">

                    <table class="table table-hover nowrap" id="table">
                        <thead class="thead-default">
                            <tr>
                                <th>Code</th>
                                <th>Tên</th>
                                <th class="text-center">Active</th>
                                <th class="text-center">CMS</th>
                                <th style="min-width: 200px">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($list as $row)
                                <tr>
                                    <td @if ($row->trashed()) class="text-deleted" @endif>
                                        {{ '#' . $row->code }}
                                    </td>
                                    <td>{{ $row->{'name' . $curLanguage} }}</td>
                                    <td class="text-center font-size-12">
                                        @if (!$row->trashed())
                                            @if ($row->active_flg)
                                                <span class="badge badge-success">Hoạt động</span>
                                            @else
                                                <span class="badge badge-secondary">Tạm ẩn</span>
                                            @endif
                                        @else
                                            <span class="badge badge-secondary">Đã xóa</span>
                                        @endif
                                    </td>
                                    <td class="text-center">
                                        @if ($row->cms_flg)
                                            <i class="fe fe-check-square text-success"></i>
                                        @endif
                                    </td>
                                    <td>
                                        <a href="{{ route('cms.pages.edit', $row->id) }}"
                                            class="btn btn-sm btn-outline-warning">
                                            <i class="fe fe-edit"></i> Sửa</a>
                                        @if ($row->trashed())
                                            <a href="javascript: void(0);" onclick="submitDeleteForm({{ $row->id }});"
                                                class="btn btn-sm btn-outline-secondary">
                                                <i class="fe fe-rotate-ccw"></i> Hoàn</a>
                                        @else
                                            <a href="javascript: void(0);" onclick="submitDeleteForm({{ $row->id }});"
                                                class="btn btn-sm btn-outline-danger">
                                                <i class="fe fe-trash"></i> Xóa</a>
                                        @endif
                                        <a href="{{ route('cms.pages.contents', $row->id) }}"
                                            class="btn btn-sm btn-outline-success">
                                            <i class="fe fe-type"></i> Content</a>
                                        @if (!$row->cms_flg)
                                            <a href="{{ route('cms.seo.page', $row->id) }}"
                                                class="btn btn-sm btn-outline-secondary">
                                                <i class="fe fe-code"></i> SEO</a>
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
    <form id="form-delete" action="{{ route('cms.pages.delete', 'pId') }}" method="post" style="display: none;">
        @csrf @method('delete')
    </form>
@endpush

@push('scripts')
    <script>
        function submitDeleteForm(id) {
            var url = "{{ route('cms.pages.delete', 'pId') }}";
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
