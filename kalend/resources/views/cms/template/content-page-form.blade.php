<form id="form-validation" name="form" method="post" action="{{ route('cms.pages.content', $page->id) }}" enctype="multipart/form-data">
@csrf
<h4>{{ trans('cms.content') }}</h4>
@foreach ($page->sections as $section)
<div class="card">
	<div class="card-body">
		<h5 class="mb-4">{{ $section->name }}</h5>
		@foreach($section->texts as $key=>$text)
		@if ($text->sub_title != '')
		<div class="form-group row">
			<div class="col-md-3">{{ trans('cms.texts').' '. ($key+1) }}</div>
			<div class="col-md-6">
				<input type="text" class="form-control"
					placeholder="Sub title"
					name="sub_titles[k{{ $text->id }}]"
					value="{{ $text->sub_title }}">
			</div>
		</div>
		@endif
		<div class="form-group row">
			<div class="col-md-3"></div>
			<div class="col-md-6">
				<input type="text" class="form-control"
					placeholder="Title"
					name="titles[k{{ $text->id }}]"
					value="{{ $text->title }}">
			</div>
		</div>
		<div class="form-group row">
			<div class="col-md-3"></div>
			<div class="col-md-6">
				<textarea class="form-control textarea"
					placeholder="Description"
					name="contents[k{{ $text->id }}]">{!! $text->content !!}</textarea>
			</div>
		</div>
		@endforeach
		@if ($section->gallery_flg)
			<div class="form-group row">
				<div class="col-md-3">{{ trans('cms.add_new_image') }}</div>
				<div class="col-md-6">
					<input type="file" class="dropify" name="new_image_section-{{ $section->id }}"
						data-show-remove="false" /></div>
			</div>
			<div class="form-group row">
				<div class="col-md-12">Gallery</div>
				@foreach($section->images as $key=>$image)
				<div class="col-md-3">
					<input type="file" class="dropify" name="image-{{ $image->id }}"
						data-show-remove="false"
						data-default-file="images/pages/{{ $image->name }}" /></div>
				@endforeach
			</div>
		@else
			@foreach($section->images as $key=>$image)
				<div class="form-group row">
					<div class="col-md-3">@if ($key == 0) {{ trans('cms.images') }} @endif</div>
					<div class="col-md-6">
						<input type="file" class="dropify" name="image-{{ $image->id }}"
							data-show-remove="false"
							data-default-file="images/pages/{{ $image->name }}" />
					</div>
				</div>
				@if ($image->has_link)
				<div class="form-group row">
					<div class="col-md-3">{{ trans('cms.link') }}</div>
					<div class="col-md-6">
						<input type="text" class="form-control"
							placeholder="{{ trans('cms.link') }}"
							name="image_link-{{ $image->id }}"
							value="{{ $image->link }}">
					</div>
				</div>
				@endif
			@endforeach
		@endif
		@foreach($section->buttons as $key=>$button)
		<div class="form-group row">
			<div class="col-md-3">@if ($key == 0) {{ trans('cms.buttons') }} @endif</div>
			<div class="col-md-3">
				<input type="text" class="form-control"
					placeholder="{{ trans('cms.buttons') }}"
					name="buttons[k{{ $button->id }}]"
					value="{{ $button->text }}">
			</div>
			<div class="col-md-3 input-group">
				<div class="input-group-prepend">
					<span class="input-group-text">/</span>
				</div>
				<input type="text" class="form-control"
					placeholder="Route"
					name="routes[k{{ $button->id }}]"
					value="{{ $button->route }}">
			</div>
		</div>
		@endforeach
		<div class="form-actions">
			<button type="submit" class="btn btn-primary px-5">{{ trans('button.submit') }}</button>
		</div>
	</div>
</div>
@endforeach
</form>