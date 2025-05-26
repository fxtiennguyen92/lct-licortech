@extends('cms.template.index')

@push('page_name')
    {{ $page->name }}
@endpush

@push('content')
    @php $regions = config('regions'); @endphp
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
                    <table data-order='[[ 0, "desc" ]]' class="table table-hover nowrap" id="table">
                        <thead class="thead-default">
                            <tr>
                                <th class="text-center" style="width: 200px">Request</th>
                                <th>Client</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($list as $row)
                                <tr>
                                    <td>
                                        <span style="display: none">{{ date('YmdHi', strtotime($row->created_at)) }}</span>
                                        <div>
                                            <b>{{ config('regions.countries.' . $row->country_code) }}</b>
                                        </div>
                                        <div>{{ date('d-m-Y H:i', strtotime($row->created_at)) }}</div>
                                    </td>
                                    <td>
                                        <strong class="mb-2">{{ $row->name }}</strong>
                                        @if ($row->phone)
                                            <div>{{ $row->phone }}</div>
                                        @endif
                                        @if ($row->email)
                                            <div>{{ $row->email }}</div>
                                        @endif
                                    </td>
                                    <td>
                                        <a href="{{ route('cms.contacts.delete', $row->id) }}"
                                            class="btn btn-sm btn-outline-danger">
                                            <i class="fe fe-trash"></i> Delete</a>
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
                ordering: true,
                searching: true,
                info: true,
            })
        });
    </script>
@endpush
