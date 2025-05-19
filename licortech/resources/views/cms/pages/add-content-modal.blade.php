<div id="add-content-modal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalTitle"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true"><i class="fe fe-close"></i></span>
                </button>
            </div>
            <form id="add-content-form" method="post" action="{{ route('cms.pages.contents.update', $data->id) }}">
                @csrf
                <input type="hidden" id="sectionId" name="section_id" value="" />
                <div class="modal-body mb-4 mt-4 pl-4 pr-4">
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label" for="sectionCode">
                            <i class="fe fe-package"></i> Section</label>
                        <div class="col-md-3">
                            <input type="text" class="form-control" id="sectionCode"
                                name="section_code" placeholder="Code" maxlength="150"
                                name-validation="Code" data-validation="[NOTEMPTY]">
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-md-3"></div>
                        <div class="col-md-6">
                            <input type="text" class="form-control" id="sectionName"
                                name="section_name" placeholder="{{ trans('text.name') }}" maxlength="200"
                                name-validation="{{ trans('text.name') }}" data-validation="[NOTEMPTY]">
                        </div>
                    </div>
                    <!-- Text -->
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label" for="cntText">
                            <i class="fe fe-type"></i> Text</label>
                        <div class="col-md-3">
                            <input type="number" class="form-control text-right" maxlength="2" id="cntText"
                                name="text_amount" placeholder="{{ trans('text.amount') }}"
                                name-validation="{{ trans('text.amount') }}" data-validation="[OPTIONAL,INTEGER]">
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-md-3"></div>
                        <div class="col-md-9">
                            <div class="row">
                                @foreach ($list_dsp->text as $tkey => $telement)
                                    <div class="col-md-6">
                                        <label
                                            class="kit__utils__control kit__utils__control__checkbox text-capitalize">
                                            <input type="checkbox" @if ($tkey == 0) checked @endif
                                                name="text_list_dsp[{{ $telement }}]" />
                                            <span class="kit__utils__control__indicator"></span>
                                            {{ str_replace('_', ' ', $telement) }}
                                        </label>
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    </div>

                    <!-- Button -->
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label" for="cntButton">
                            <i class="fe fe-square"></i> Button</label>
                        <div class="col-md-3">
                            <input type="number" class="form-control text-right" maxlength="2" id="cntButton"
                                name="button_amount" placeholder="{{ trans('text.amount') }}"
                                name-validation="{{ trans('text.amount') }}" data-validation="[OPTIONAL,INTEGER]">
                        </div>
                    </div>

                    <!-- Image -->
                    <div class="form-group row">
                        <label class="col-md-3 col-form-label" for="cntImage">
                            <i class="fe fe-image"></i> Image</label>
                        <div class="col-md-3">
                            <input type="number" class="form-control text-right" maxlength="2" id="cntImage"
                                name="image_amount" placeholder="{{ trans('text.amount') }}"
                                name-validation="{{ trans('text.amount') }}" data-validation="[OPTIONAL,INTEGER]">
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-md-3"></div>
                        <div class="col-md-9">
                            <div class="row">
                                @foreach ($list_dsp->image as $ikey => $ielement)
                                    <div class="col-md-6">
                                        <label
                                            class="kit__utils__control kit__utils__control__checkbox text-capitalize">
                                            <input type="checkbox" name="image_list_dsp[{{ $ielement }}]" />
                                            <span class="kit__utils__control__indicator"></span>
                                            {{ str_replace('_', ' ', $ielement) }}
                                        </label>
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer text-center">
                    <button id="btn-alert-confirm" type="submit"
                        class="btn btn-primary mr-2">{{ trans('button.add_new') }}</button>
                    <button id="button-cancel-confirm" type="button" class="btn btn-secondary"
                        data-dismiss="modal">{{ trans('button.cancel') }}</button>
                </div>
            </form>
        </div>
    </div>
</div>

@push('scripts')
    <script>
        $('#add-content-form').validate({
            messages: {
                'INTEGER': "{{ trans('validation.integer', ['attribute' => '$']) }}",
            },
            submit: {
                settings: {
                    inputContainer: '.form-group',
                    errorListClass: 'form-control-error-list',
                    errorClass: 'has-danger',
                }
            }
        })
    </script>
@endpush
