@extends('cms.template.index')

@push('page_name')
    Admin Accounts
@endpush

@push('content')
    <div class="cui__layout__content">
        <div class="cui__breadcrumbs">
            <div class="cui__breadcrumbs__path">
                <span>{{ $common->web_name }}</span>
                <span>
                    <span class="cui__breadcrumbs__arrow"></span>
                    <strong class="cui__breadcrumbs__current">Tài khoản</strong>
                </span>
            </div>
        </div>

        <div class="cui__utils__content">
            <div class="kit__utils__heading">
                <h5>
                    <span class="mr-3">Tài khoản Admin</span>
                </h5>
            </div>
            <div class="card">
                <div class="card-body">
                    <table data-order='[[ 0, "desc" ]]' class="table table-hover nowrap" id="table">
                        <thead class="thead-default">
                            <tr>
                                <th>Tên</th>
                                <th>Email</th>
                                <th class="text-center">Role</th>
                                <th class="width: 200px">Đăng nhập lúc</th>
                                <th style="width: 100px">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($list as $row)
                                <tr>
                                    <td><strong>{{ $row->name }}</strong></td>
                                    <td>
                                        <div>{{ $row->email }}</div>
                                        <i>{{ $row->password_temp }}</i>
                                    </td>
                                    <td class="text-center">
                                        @if ($row->super_flg)
                                            <span class="badge badge-danger">Super</span>
                                        @elseif ($row->admin_flg)
                                            <span class="badge badge-primary">Admin</span>
                                        @elseif ($row->content_flg)
                                            <span class="badge badge-default">Content</span>
                                        @endif
                                    </td>
                                    <td>
                                        @if ($row->signed_in_at)
                                            <span
                                                style="display: none">{{ date('YmdHi', strtotime($row->signed_in_at)) }}</span>
                                            {{ date('d-m-Y H:i', strtotime($row->signed_in_at)) }}
                                        @endif
                                    </td>
                                    <td>
                                        @if (!$row->super_flg && $row->id != Auth::user()->id)
                                            <a href="javascript: submitResetForm('{{ $row->id }}')"
                                                class="btn btn-sm btn-outline-warning">
                                                <i class="fe fe-shield"></i> Reset Password</a>
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
    <form id="form-reset" action="{{ route('cms.accounts.reset', 'uId') }}" method="post" style="display: none;">
        @csrf @method('put')
    </form>
@endpush

@push('scripts')
    <script>
        function submitResetForm(id) {
            var url = "{{ route('cms.accounts.reset', 'uId') }}";
            url = url.replace('uId', id);
            $('#form-reset').attr('action', url).submit();
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
