@extends('cms.template.layout')

@push('pagename') {{ trans('cms.menu.user_contacts') }} @endpush

@push('content')
	<div class="cui__layout__content">
		<div class="cui__breadcrumbs">
			<div class="cui__breadcrumbs__path">
				<span>{{ trans('cms.menu.user_data') }}</span>
				<span>
					<span class="cui__breadcrumbs__arrow"></span>
					<strong class="cui__breadcrumbs__current">{{ trans('cms.menu.user_contacts') }}</strong>
				</span>
			</div>
		</div>
		
		<div class="cui__utils__content">
			<div class="card">
				<div class="card-body">
					<h5 class="mb-4">Danh sách Khách hàng đã liên hệ</h5>
					<div class="row">
						<div class="col-12">
							<div class="mb-5">
								<table class="table table-hover" id="contact-table">
									<thead>
										<tr>
											<th>Ngày tạo</th>
											<th>Giải pháp</th>
											<th>Thông tin & Nội dung</th>
										</tr>
									</thead>
									<tbody>
									@foreach ($contacts as $contact)
										<tr>
											<td>
												<span style="display: none;">{!! date('y/m/d H:i:s', strtotime($contact->created_at)) !!}</span>
												<span class="text-dark mb-0">{!! date('d/m/y', strtotime($contact->created_at)) !!}</span>
												<p>{!! date('H:i', strtotime($contact->created_at)) !!}</p>
											</td>
											<td>
												@if ($contact->service)
												<span class="text-blue">{{ $contact->service->name }}</span>
												@else
												<i class="text-gray-4">Không có</i>
												@endif
											</td>
											<td>
												<strong class="mb-0">{!! htmlentities($contact->name) !!}</strong>
												<p class="text-gray-6">{!! htmlentities($contact->tel) !!}</p>
												<div class="text-gray-5" style="max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; hyphens: auto;">
													{!! htmlentities($contact->message) !!}
												</div>
											</td>
										</tr>
									@endforeach
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
@endpush

@push('scripts')
<script>
;(function($) {
	'use strict'
	$(function() {
		$('#contact-table').DataTable({
			responsive: true,
			autoWidth: true,
			order: [0, 'desc'],
		})
	})
})(jQuery)
</script>
@endpush