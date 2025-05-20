<!DOCTYPE html>
<html lang="vi" data-kit-theme="default">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>
        @if ($common->web_name_before == '1')
            {{ $common->web_name . ' ' . $common->web_name_separator_symbol }} @stack('page_name')
        @else
            @stack('page_name') {{ $common->web_name_separator_symbol . ' ' . $common->web_name }}
        @endif
    </title>

    <base href="{{ asset('') }}">
    <!-- Favicon & Logo -->
    <link rel="icon" type="image/png" href="{{ $common->web_icon }}" />
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&display=swap"
        rel="stylesheet">
    <!-- Vendors -->
    <link rel="stylesheet" type="text/css" href="vendors/bootstrap/dist/css/bootstrap.css">
    <link rel="stylesheet" type="text/css" href="vendors/perfect-scrollbar/css/perfect-scrollbar.css">
    <link rel="stylesheet" type="text/css" href="vendors/ladda/dist/ladda-themeless.min.css">
    <link rel="stylesheet" type="text/css" href="vendors/bootstrap-select/dist/css/bootstrap-select.min.css">
    <link rel="stylesheet" type="text/css" href="vendors/select2/dist/css/select2.min.css">
    <link rel="stylesheet" type="text/css"
        href="vendors/tempus-dominus-bs4/build/css/tempusdominus-bootstrap-4.min.css">
    <link rel="stylesheet" type="text/css" href="vendors/fullcalendar/dist/fullcalendar.min.css">
    <link rel="stylesheet" type="text/css" href="vendors/bootstrap-sweetalert/dist/sweetalert.css">
    <link rel="stylesheet" type="text/css" href="vendors/summernote/dist/summernote.css">
    <link rel="stylesheet" type="text/css" href="vendors/owl.carousel/dist/assets/owl.carousel.min.css">
    <link rel="stylesheet" type="text/css"
        href="https://cdn.datatables.net/v/bs4/dt-1.10.18/fc-3.2.5/r-2.2.2/datatables.min.css" />
    <link rel="stylesheet" type="text/css" href="vendors/c3/c3.min.css">
    <link rel="stylesheet" type="text/css" href="vendors/chartist/dist/chartist.min.css">
    <link rel="stylesheet" type="text/css" href="vendors/nprogress/nprogress.css">
    <link rel="stylesheet" type="text/css" href="vendors/jquery-steps/demo/css/jquery.steps.css">
    <link rel="stylesheet" type="text/css" href="vendors/dropify/dist/css/dropify.min.css">
    <link rel="stylesheet" type="text/css" href="vendors/font-feathericons/dist/feather.css">
    <link rel="stylesheet" type="text/css" href="vendors/font-linearicons/style.css">
    <link rel="stylesheet" type="text/css" href="vendors/font-icomoon/style.css">
    <link rel="stylesheet" type="text/css" href="vendors/font-awesome/css/font-awesome.min.css">
    <!-- Stack --> @stack('stylesheets')

    <!-- Components -->
    <link rel="stylesheet" type="text/css" href="components/kit/vendors/style.css">
    <link rel="stylesheet" type="text/css" href="components/kit/core/style.css">
    <link rel="stylesheet" type="text/css" href="components/cleanui/styles/style.css">
    <link rel="stylesheet" type="text/css" href="components/kit/widgets/style.css">
    <link rel="stylesheet" type="text/css" href="components/kit/apps/style.css">
    <link rel="stylesheet" type="text/css" href="components/cleanui/dashboards/style.css">
    <link rel="stylesheet" type="text/css" href="components/cleanui/system/auth/style.css">
    <link rel="stylesheet" type="text/css" href="components/cleanui/layout/breadcrumbs/style.css">
    <link rel="stylesheet" type="text/css" href="components/cleanui/layout/footer/style.css">
    <link rel="stylesheet" type="text/css" href="components/cleanui/layout/menu-left/style.css">
    <link rel="stylesheet" type="text/css" href="components/cleanui/layout/sidebar/style.css">
    <link rel="stylesheet" type="text/css" href="components/cleanui/layout/topbar/style.css">


    <!-- Common -->
    <link rel="stylesheet" type="text/css" href="common/css/preloader.css">
    <link rel="stylesheet" type="text/css" href="common/css/custom.css">

    <!-- JS -->
    <script src="vendors/jquery/dist/jquery.min.js"></script>
    <script src="vendors/popper.js/dist/umd/popper.js"></script>
    <script src="vendors/jquery-ui/jquery-ui.min.js"></script>
    <script src="vendors/bootstrap/dist/js/bootstrap.js"></script>
    <script src="vendors/jquery-mousewheel/jquery.mousewheel.min.js"></script>
    <script src="vendors/perfect-scrollbar/js/perfect-scrollbar.jquery.js"></script>
    <script src="vendors/spin.js/spin.js"></script>
    <script src="vendors/ladda/dist/ladda.min.js"></script>
    <script src="vendors/bootstrap-select/dist/js/bootstrap-select.min.js"></script>
    <script src="vendors/select2/dist/js/select2.full.min.js"></script>
    <script src="vendors/select2/dist/js/i18n/vi.js"></script>
    <script src="vendors/html5-form-validation/dist/jquery.validation.min.js"></script>
    <script src="vendors/jquery-typeahead/dist/jquery.typeahead.min.js"></script>
    <script src="vendors/jquery-mask-plugin/dist/jquery.mask.min.js"></script>
    <script src="vendors/autosize/dist/autosize.min.js"></script>
    <script src="vendors/bootstrap-show-password/dist/bootstrap-show-password.min.js"></script>
    <script src="vendors/moment/min/moment.min.js"></script>
    <script src="vendors/tempus-dominus-bs4/build/js/tempusdominus-bootstrap-4.min.js"></script>
    <script src="vendors/fullcalendar/dist/fullcalendar.min.js"></script>
    <script src="vendors/bootstrap-sweetalert/dist/sweetalert.min.js"></script>
    <script src="vendors/remarkable-bootstrap-notify/dist/bootstrap-notify.min.js"></script>
    <script src="vendors/summernote/dist/summernote.min.js"></script>
    <script src="vendors/owl.carousel/dist/owl.carousel.min.js"></script>
    <script src="vendors/nestable/jquery.nestable.js"></script>
    <script src="https://cdn.datatables.net/v/bs4/dt-1.10.18/fc-3.2.5/r-2.2.2/datatables.min.js"></script>
    <script src="vendors/editable-table/mindmup-editabletable.js"></script>
    <script src="vendors/d3/d3.min.js"></script>
    <script src="vendors/jquery-countTo/jquery.countTo.js"></script>
    <script src="vendors/nprogress/nprogress.js"></script>
    <script src="vendors/jquery-steps/build/jquery.steps.min.js"></script>
    <script src="vendors/chart.js/dist/Chart.bundle.min.js"></script>
    <script src="vendors/dropify/dist/js/dropify.min.js"></script>
    <script src="vendors/d3-dsv/dist/d3-dsv.js"></script>
    <script src="vendors/d3-time-format/dist/d3-time-format.js"></script>
    <!-- Template modules -->
    <script src="components/kit/core/index.js"></script>
    <script src="components/cleanui/layout/menu-left/index.js"></script>
    <script src="components/cleanui/layout/sidebar/index.js"></script>
    <script src="components/cleanui/layout/topbar/index.js"></script>
    <script src="common/js/preloader.js"></script>
    <script src="common/js/custom.js"></script>
</head>

<body class="cui__layout--cardsShadow cui__layout--grayBackground cui__topbar--fixed">
    <div class="initial__loading"></div>
    <div class="cui__layout cui__layout--hasSider">
        @include('cms.template.left-menu')

        <div class="cui__layout">
            <div class="cui__layout__header">
                @include('cms.template.top-bar')

            </div>
            <div class="cui__layout__content">
                @stack('content')

            </div>
            <div class="cui__layout__footer">
                @include('cms.template.footer')
            </div>
        </div>

        @stack('add-in')
    </div>

    <script>
        $(document).ready(function() {
            if (getCookie('show_left_menu') == 'off') {
                $('body').toggleClass('cui__menuLeft--toggled');
            }
        })

        @if (Session::has('error'))
            $.notify({
                icon: 'fe fe-alert-circle',
                title: "<strong>{{ trans('message.error') }}!</strong> ",
                message: "{{ Session::get('error') }}",
            }, {
                type: 'danger',
                placement: {
                    from: "bottom",
                    align: "right"
                },
            })
        @endif

        @if (Session::has('success'))
            $.notify({
                icon: 'fe fe-check-circle',
                title: "<strong>{{ trans('message.success') }}!</strong> ",
                message: "{{ Session::get('success') }}",
            }, {
                type: 'success',
                placement: {
                    from: "bottom",
                    align: "right"
                },
            })
        @endif

        @if (Session::has('info'))
            $.notify({
                icon: 'fe fe-info',
                title: "<strong>{{ trans('message.info') }}!</strong> ",
                message: "{{ Session::get('info') }}",
            }, {
                type: 'info',
                placement: {
                    from: "bottom",
                    align: "right"
                },
            })
        @endif

        ;
        (function($) {
            'use strict'
            $(function() {
                $('.dropify').dropify();
                autosize($('.textarea'));
            })
        })(jQuery)
    </script>

    @stack('scripts')
</body>
