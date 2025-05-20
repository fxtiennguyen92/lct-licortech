<div id="modal-change-password" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered" role="document">
		<div class="modal-content">
		<form id="form-change-password" name="form-validation" method="post" action="{{ route('security.password.change') }}">
		@csrf
			<div class="modal-header">
				<h5 class="modal-title ml-2">{{ trans('text.change_password.header') }}</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="{{ trans('button.close') }}">
					<span aria-hidden="true"><i class="fe fe-x"></i></span>
				</button>
			</div>
			<div class="modal-body pl-4 pr-4">
				<div class="mb-4">
					<p class="text-center font-size-12 font-italic bg-light rounded-lg pt-2 pb-2 pl-4 pr-4">{{ trans('text.change_password.description') }}</p>
				</div>
				<div class="form-group mb-4">
					<label for="password-current">{{ trans('label.password.lbl_current') }}</label>
					<input id="password-current" name="password_current"
						class="form-control"
						type="password" maxlength="255"
						placeholder="{{ trans('label.password.pld_current') }}"
						name-validation="{{ trans('label.password.vln') }}"
						data-validation="[NOTEMPTY,L>=8]">
				</div>
				<div class="form-group mb-4">
					<label for="password-new">{{ trans('label.password.lbl_new') }}</label>
					<input id="password-new" name="password"
						class="form-control"
						type="password" maxlength="255"
						placeholder="{{ trans('label.password.pld_new') }}"
						name-validation="{{ trans('label.password.vln') }}"
						data-validation="[NOTEMPTY,L>=8,V!=password_current]">
				</div>
				<div class="form-group">
					<input name="password_confirmation"
						class="form-control"
						type="password" maxlength="255"
						placeholder="{{ trans('label.password.pld_confirm') }}"
						name-validation="{{ trans('label.password.vln') }}"
						data-validation="[V==password]">
				</div>
			</div>
			<div class="modal-footer">
				<button id="btn-change-password" type="submit" data-style="slide-right"
					class="btn btn-primary px-5 mr-2 ladda-button">
					<span class="ladda-label">{{ trans('button.change') }}</span>
				</button>
				<button type="button" class="btn btn-secondary btn-cancel px-5 d-none d-md-block" data-dismiss="modal">{{ trans('button.cancel') }}</button>
			</div>
		</form>
		</div>
	</div>
</div>