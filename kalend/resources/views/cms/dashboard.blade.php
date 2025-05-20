@extends('cms.template.index')

@push('page_name')
    Dashboard
@endpush

@push('content')
    <div class="cui__layout__content">
        <div class="cui__breadcrumbs">
            <div class="cui__breadcrumbs__path">
                <span>{{ $common->web_name }}</span>
                <span>
                    <span class="cui__breadcrumbs__arrow"></span>
                    <strong>Dashboard</strong>
                </span>
            </div>
        </div>

        <div class="cui__utils__content">
            <div class="row">
                <div class="col-md-4 col-sm-6">
                    <a class="card bg-warning border-0 mb-4" href="{{ route('cms.contacts') }}">
                        <div class="card-body">
                            <div class="text-white font-weight-bold">
                                <div class="font-size-21 mb-2">Call reservations</div>
                                <div class="d-flex align-items-end flex-wrap">
                                    <div class="pr-3 mr-auto">
                                        <i class="fe fe-phone font-size-48"></i>
                                    </div>
                                    <div class="font-size-36 mb-n2">{{ $reserve }}</div>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </div>
@endpush

@push('scripts')
    <script></script>
@endpush
