<div class="cui__topbar">
    <div class="d-lg-block mr-auto"></div>

    @if ($common->multi_language)
        <div class="dropdown mr-4 d-block">
            <a href="" class="dropdown-toggle text-nowrap" data-toggle="dropdown" data-offset="5,15"
                aria-expanded="false">
                <span class="dropdown-toggle-text">
                    @foreach ($languages as $lang)
                        @if ($lang->code == app()->getLocale())
                        {{ $lang->name }} @break
                        @endif
                    @endforeach
                </span>
            </a>
            <div class="dropdown-menu dropdown-menu-right" role="menu" style="">
                @foreach ($languages as $lang)
                    <a class="dropdown-item"
                        @if ($lang->code == app()->getLocale())
                            href="javascript:void(0);"
                        @else
                            href="{{ route('locale.change', $lang->code) }}"
                        @endif>
                        <span class="text-uppercase font-size-12 mr-1">{{ $lang->code }}</span>
                        {{ $lang->name }}</a>
                @endforeach
            </div>
        </div>
    @endif

    @if (auth()->check())
        <div class="dropdown ml-2">
            <a href="" class="dropdown-toggle text-nowrap" data-toggle="dropdown" aria-expanded="false"
                data-offset="5,15">
                <img class="dropdown-toggle-avatar" src="components/kit/core/img/avatars/avatar-2.png" />
            </a>
            <div class="dropdown-menu dropdown-menu-right" role="menu">
                <a class="dropdown-item font-weight-bold" href="javascript:void(0);">
                    <i class="dropdown-icon fe fe-user font-size-18 font-weight-bold"></i>
                    {{ Str::length(auth()->user()->email) > 20 ? substr(auth()->user()->email, 0, 5) . '***' . substr(auth()->user()->email, strpos(auth()->user()->email, '@')) : auth()->user()->email }}
                </a>
                <a class="dropdown-item" href="{{ route('cms.accounts.edit-password') }}">
                    <i class="dropdown-icon fe fe-shield"></i>
                    {{ trans('cms.password') }}
                </a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="{{ route('logout') }}">
                    <i class="dropdown-icon fe fe-log-out"></i>
                    Đăng xuất
                </a>
            </div>
        </div>
    @else
        <div class="ml-2">
            <a class="font-weight-bold text-primary" href="{{ route('login') }}">
                Đăng nhập
            </a>
        </div>
    @endif

</div>
