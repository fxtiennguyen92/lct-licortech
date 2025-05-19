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
                    <a href="{{ route('cms.pages') }}">{{ $page->name }}</a>
                </span>
                <span>
                    <span class="cui__breadcrumbs__arrow"></span>
                    <strong class="cui__breadcrumbs__current">{{ $data->name }}</strong>
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
                        <a href="javascript: createSection()" class="btn btn-primary">
                            <i class="fe fe-plus"></i> {{ __('button.add_new') }}
                        </a>
                    </div>
                </div>
                <div class="card-body">
                    <table class="table table-hover nowrap" id="table">
                        <thead class="thead-default">
                            <tr>
                                <th>Session</th>
                                <th>Content</th>
                                <th style="min-width: 200px">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Sections -->
                            @foreach ($data->sections as $section)
                                <tr>
                                    <td>
                                        <i class="fe fe-box"></i> {{ $section->name }}
                                        <small>{{ '#' . $section->code }}</small>
                                    </td>
                                    <td>
                                        <i class="text-muted">---
                                            {{ sizeof($section->texts) > 0 ? sizeof($section->texts) . ' group(s); ' : '' }}
                                            {{ sizeof($section->buttons) > 0 ? sizeof($section->buttons) . ' button(s); ' : '' }}
                                            {{ sizeof($section->images) > 0 ? sizeof($section->images) . ' image(s); ' : '' }}
                                        </i>
                                    </td>
                                    <td>
                                        <a href="javascript: addMoreElements('{{ $section->id }}','{{ $section->code }}','{{ $section->name }}')"
                                            class="btn btn-sm btn-outline-success">
                                            <i class="fe fe-plus"></i> {{ __('button.add_new') }}</a>
                                        <a href="javascript: deleteSection({{ $section->id }})"
                                            class="btn btn-sm btn-outline-danger">
                                            <i class="fe fe-trash"></i> {{ __('button.delete') }}</a>
                                    </td>
                                </tr>
                                <!-- Texts -->
                                @foreach ($section->texts as $tkey => $text)
                                    <tr>
                                        <td class="pl-5">
                                            <i class="fe fe-type"></i> {{ 'Text ' . ($tkey + 1) }}
                                        </td>
                                        <td>
                                            <span title="{{ $text->title }}">
                                                {{ strlen($text->title) > 25 ? substr($text->title, 0, 20) . '...' : $text->title }}<span>
                                        </td>
                                        <td>
                                            <a href="javascript:void(0);" class="btn btn-sm btn-outline-warning disabled">
                                                <i class="fe fe-edit mr-2"></i> Sửa</a>
                                            <a href="javascript: deleteText({{ $text->id }})"
                                                class="btn btn-sm btn-outline-danger">
                                                <i class="fe fe-trash"></i> Xóa</a>
                                        </td>
                                    </tr>
                                @endforeach

                                <!-- Buttons -->
                                @foreach ($section->buttons as $bkey => $button)
                                    <tr>
                                        <td class="pl-5">
                                            <i class="fe fe-square"></i> {{ 'Button ' . ($bkey + 1) }}
                                        </td>
                                        <td>{{ $button->text }}</td>
                                        <td>
                                            <a href="javascript:void(0);" class="btn btn-sm btn-outline-warning disabled">
                                                <i class="fe fe-edit mr-2"></i> Sửa</a>
                                            <a href="javascript: deleteButton({{ $button->id }})"
                                                class="btn btn-sm btn-outline-danger">
                                                <i class="fe fe-trash"></i> Xóa</a>
                                        </td>
                                    </tr>
                                @endforeach

                                <!-- Images -->
                                @foreach ($section->images as $ikey => $image)
                                    <tr>
                                        <td class="pl-5">
                                            <i class="fe fe-image"></i> {{ 'Image ' . ($ikey + 1) }}
                                        </td>
                                        <td>{{ $image->src }}</td>
                                        <td>
                                            <a href="javascript:void(0);" class="btn btn-sm btn-outline-warning disabled">
                                                <i class="fe fe-edit mr-2"></i> Sửa</a>
                                            <a href="javascript: deleteImage({{ $image->id }})"
                                                class="btn btn-sm btn-outline-danger">
                                                <i class="fe fe-trash"></i> Xóa</a>
                                        </td>
                                    </tr>
                                @endforeach
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <form id="form-delete" action="" method="post" style="display: none;">
        @csrf @method('delete')
    </form>
    @include('cms.modals.confirm')
    @include('cms.pages.add-content-modal')
@endpush

@push('scripts')
    <script>
        $('input[type=number]').on('change', function() {

        });

        function createSection() {
            $('#sectionId').val('');
            $('#sectionCode').val('').removeAttr('readonly');
            $('#sectionName').val('').removeAttr('readonly');
            $('#modalTitle').html("{{ trans('text.add_new_section') }}");
            $('#add-content-modal').modal();
        }

        function addMoreElements(sectionId, sectionCode, sectionName) {
            $('#sectionId').val(sectionId);
            $('#sectionCode').val(sectionCode).attr('readonly', 'readonly');
            $('#sectionName').val(sectionName).attr('readonly', 'readonly');
            $('#modalTitle').html("{{ trans('text.add_more_elements') }}");
            $('#add-content-modal').modal();
        }

        function deleteSection(sectionId) {
            $('#alert-confirm-message').html("{{ trans('message.delete_confirm') }}");
            $('#alert-confirm').modal();

            let url = "{{ route('cms.sections.delete', 'sectionId') }}";
            url = url.replace('sectionId', sectionId);
            $('#form-delete').attr('action', url);
        }

        function deleteText(id) {
            $('#alert-confirm-message').html("{{ trans('message.delete_confirm') }}");
            $('#alert-confirm').modal();

            let url = "{{ route('cms.texts.delete', 'deleteId') }}";
            url = url.replace('deleteId', id);
            $('#form-delete').attr('action', url);
        }

        function deleteButton(id) {
            $('#alert-confirm-message').html("{{ trans('message.delete_confirm') }}");
            $('#alert-confirm').modal();

            let url = "{{ route('cms.buttons.delete', 'deleteId') }}";
            url = url.replace('deleteId', id);
            $('#form-delete').attr('action', url);
        }

        function deleteImage(id) {
            $('#alert-confirm-message').html("{{ trans('message.delete_confirm') }}");
            $('#alert-confirm').modal();

            let url = "{{ route('cms.images.delete', 'deleteId') }}";
            url = url.replace('deleteId', id);
            $('#form-delete').attr('action', url);
        }

        $('#btn-alert-confirm').on('click', function() {
            $('#form-delete').submit();
        })

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
