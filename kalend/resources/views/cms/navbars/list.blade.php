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
                    <strong class="cui__breadcrumbs__curent">{{ $page->name }}</strong>
                </span>
            </div>
        </div>

        <div class="cui__utils__content">
            <div class="kit__utils__heading">
                <h5>
                    <span class="mr-3">{{ $page->head_title }}</span>
                    <a href="{{ route('cms.navbars.new') }}" class="btn btn-sm btn-primary mr-2">
                        <i class="fe fe-plus"></i> {{ trans('button.add_new') }}</a>
                </h5>
            </div>

            <div class="card">
                <div class="card-body">
                    <h5>
                        <strong class="mr-3">Website</strong>
                    </h5>
                    <table class="table table-hover nowrap" id="table">
                        <thead class="thead-default">
                            <tr>
                                <th>{{ trans('text.name') }}</th>
                                <th>{{ trans('text.redirect') }}</th>
                                <th class="text-center" style="width: 200px">{{ trans('text.order_dsp') }}</th>
                                <th style="width: 200px">{{ trans('text.action') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($web as $row)
                                <tr>
                                    <td>{{ $row->{'name' . $curLanguage} }}</td>
                                    <td>
                                        @if ($row->page)
                                            <i class="fe fe-file mr-2"></i><a class="kit__utils__link__underlined"
                                                href="{{ route('cms.pages.edit', $row->page->id) }}">{{ $row->{'name' . $curLanguage} }}</a>
                                        @elseif ($row->redirect)
                                            <i class="fe fe-link mr-2"></i>{{ $row->redirect }}
                                        @endif
                                    </td>
                                    <td class="text-center">{{ $row->order_dsp }}</td>
                                    <td>
                                        <a href="{{ route('cms.navbars.edit', $row->id) }}"
                                            class="btn btn-sm btn-outline-warning mr-2">
                                            <i class="fe fe-edit mr-2"></i> {{ trans('button.edit') }}</a>
                                        <a href="javascript: void(0);" onclick="submitDeleteForm({{ $row->id }});"
                                            class="btn btn-sm btn-outline-danger">
                                            <i class="fe fe-trash mr-2"></i> {{ trans('button.delete') }}</a>
                                    </td>
                                </tr>
                                @foreach ($row->children as $row)
                                    <tr>
                                        <td><i class="ml-2 fe fe-chevron-right"></i> {{ $row->{'name' . $curLanguage} }}</td>
                                        <td>
                                            @if ($row->page)
                                                <i class="fe fe-file mr-2"></i><a class="kit__utils__link__underlined"
                                                    href="{{ route('cms.pages.edit', $row->page->id) }}">{{ $row->page->name }}</a>
                                            @elseif ($row->redirect)
                                                <i class="fe fe-link mr-2"></i>{{ $row->redirect }}
                                            @endif
                                        </td>
                                        <td class="text-center"><span class="ml-5">{{ $row->order_dsp }}</span></td>
                                        <td>
                                            <a href="{{ route('cms.navbars.edit', $row->id) }}"
                                                class="btn btn-sm btn-outline-warning mr-2">
                                                <i class="fe fe-edit mr-2"></i> {{ trans('button.edit') }}</a>
                                            <a href="javascript: void(0);" onclick="submitDeleteForm({{ $row->id }});"
                                                class="btn btn-sm btn-outline-danger">
                                                <i class="fe fe-trash mr-2"></i> {{ trans('button.delete') }}</a>
                                        </td>
                                    </tr>
                                @endforeach
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>

            @if (auth()->user()->super_flg || auth()->user()->admin_flg)
                <div class="card">
                    <div class="card-body">
                        <h5>
                            <strong class="mr-3">CMS</strong>
                        </h5>
                        <table class="table table-hover nowrap" id="table">
                            <thead class="thead-default">
                                <tr>
                                    <th>{{ trans('text.name') }}</th>
                                    <th>{{ trans('text.icon') }}</th>
                                    <th>{{ trans('text.redirect') }}</th>
                                    <th>{{ trans('text.role_content') }}</th>
                                    <th class="text-center" style="width: 200px">{{ trans('text.order_dsp') }}</th>
                                    <th style="width: 200px">{{ trans('text.action') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($cms as $row)
                                    <tr>
                                        <td>{{ $row->name }}</td>
                                        <td><i class="{{ $row->icon }}"></i></td>
                                        <td>
                                            @if ($row->page)
                                                <a class="kit__utils__link__underlined"
                                                    href="{{ route('cms.pages.edit', $row->page->id) }}">{{ $row->page->name }}</a>
                                            @endif
                                        </td>
                                        <td class="text-center">
                                            @if ($row->content_flg)
                                                <i class="fe fe-check-square text-success"></i>
                                            @endif
                                        </td>
                                        <td class="text-center">{{ $row->order_dsp }}</td>
                                        <td>
                                            <a href="{{ route('cms.navbars.edit', $row->id) }}"
                                                class="btn btn-sm btn-outline-warning mr-2">
                                                <i class="fe fe-edit mr-2"></i> {{ trans('button.edit') }}</a>
                                            <a href="javascript: void(0);" onclick="submitDeleteForm({{ $row->id }});"
                                                class="btn btn-sm btn-outline-danger">
                                                <i class="fe fe-trash mr-2"></i> {{ trans('button.delete') }}</a>
                                        </td>
                                    </tr>
                                    @foreach ($row->children as $row)
                                        <tr>
                                            <td><i class="ml-2 fe fe-chevron-right"></i> {{ $row->name }}</td>
                                            <td><i class="{{ $row->icon }}"></i></td>
                                            <td>
                                                @if ($row->page)
                                                    <a class="kit__utils__link__underlined"
                                                        href="{{ route('cms.pages.edit', $row->page->id) }}">{{ $row->page->name }}</a>
                                                @endif
                                            </td>
                                            <td class="text-center">{{ $row->order_dsp }}</td>
                                            <td>
                                                <a href="{{ route('cms.navbars.edit', $row->id) }}"
                                                    class="btn btn-sm btn-outline-warning mr-2">
                                                    <i class="fe fe-edit mr-2"></i> {{ trans('button.edit') }}</a>
                                                <a href="javascript: void(0);"
                                                    onclick="submitDeleteForm({{ $row->id }});"
                                                    class="btn btn-sm btn-outline-danger">
                                                    <i class="fe fe-trash mr-2"></i> {{ trans('button.delete') }}</a>
                                            </td>
                                        </tr>
                                    @endforeach
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            @endif
        </div>
    </div>
    <form id="form-delete" action="{{ route('cms.navbars.delete', 'pId') }}" method="post" style="display: none;">
        @csrf @method('delete')
    </form>
@endpush

@push('scripts')
    <script>
        function submitDeleteForm(id) {
            var url = "{{ route('cms.navbars.delete', 'pId') }}";
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
