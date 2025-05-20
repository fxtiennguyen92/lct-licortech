<div id="alert-confirm" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-body mb-4 mt-4 pl-4 pr-4">
                <div class="text-center">
                    <i class="lnr lnr-warning font-size-60 text-warning"></i>
                    <div id="alert-confirm-message" class="mt-4"></div>
                </div>
            </div>

            <div class="modal-footer text-center">
                <button id="btn-alert-confirm" type="button"
                    class="btn btn-warning mr-2">{{ trans('button.confirm') }}</button>
                <button id="button-cancel-confirm" type="button" class="btn btn-secondary"
                    data-dismiss="modal">{{ trans('button.cancel') }}</button>
            </div>
        </div>
    </div>
</div>
