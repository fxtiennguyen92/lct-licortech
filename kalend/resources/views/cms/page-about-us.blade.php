@extends('cms.template.layout')

@push('pagename') {{ trans('cms.menu.about-us') }} @endpush

@push('content')
	<div class="cui__layout__content">
		<div class="cui__breadcrumbs">
			<div class="cui__breadcrumbs__path">
				<span>{{ trans('cms.menu.pages') }}</span>
				<span>
					<span class="cui__breadcrumbs__arrow"></span>
					<strong class="cui__breadcrumbs__current">{{ $page->name }}</strong>
				</span>
			</div>
		</div>
		
		<div class="cui__utils__content">
			@include('cms.template.name-page-form')
			
			@include('cms.template.content-page-form')
		</div>
	</div>
@endpush