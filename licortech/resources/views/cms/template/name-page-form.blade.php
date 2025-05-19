<form id="form-validation" name="form" method="post" action="{{ route('cms.page', $page->id) }}">
@csrf
	<div class="card">
		<div class="card-body">
			<h5 class="mb-2">Tên trang web</h5>
			<div class="form-group row">
				<label class="col-md-3 col-form-label" for="name">Tên hiển thị</label>
				<div class="col-md-6">
					<input type="text" class="form-control"
						placeholder="Tên trang web" id="name" name="name"
						value="{{ $page->name }}">
				</div>
				<div class="col-md-3">
					<button type="submit" class="btn btn-primary px-5">{{ trans('button.submit') }}</button>
				</div>
			</div>
		</div>
	</div>
</form>