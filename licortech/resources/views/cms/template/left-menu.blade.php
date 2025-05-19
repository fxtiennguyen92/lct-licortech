<div class="cui__menuLeft">
    <div class="cui__menuLeft__mobileTrigger"><span></span></div>
    <div class="cui__menuLeft__trigger"></div>
    <div class="cui__menuLeft__outer">
        <a href="javascript:void(0);" class="cui__menuLeft__logo__container">
            <div class="cui__menuLeft__logo">
                <img src="{{ $common->web_logo }}" onerror="this.src='components/kit/core/img/logo.svg'" class="mr-2" alt="{{ $common->web_name }}" style="height: 30px">
                @if ($common->show_web_name_in_cms)
                    <div class="cui__menuLeft__logo__name">{{ $common->web_name }}</div>
                @endif
                <div class="cui__menuLeft__logo__descr">CMS</div>
            </div>
        </a>
        <div class="cui__menuLeft__scroll kit__customScroll">
            <ul class="cui__menuLeft__navigation">
                <li class="cui__menuLeft__category">Administrator</li>
                @foreach ($cmsNav as $leftNav)
                    <li class="cui__menuLeft__item">
                        <a class="cui__menuLeft__item__link"
                            @if ($leftNav->page) id="left-menu-{{ $leftNav->page->code }}"
                            href="{{ $leftNav->page->route ? route($leftNav->page->route) : '' }}" @endif>
                            <span class="cui__menuLeft__item__title">{{ $leftNav->{'name' . $curLanguage} }}</span>
                            <i class="cui__menuLeft__item__icon {{ $leftNav->icon }}"></i>
                        </a>
                    </li>
                @endforeach

                <li class="cui__menuLeft__category">Client</li>
                <li class="cui__menuLeft__item">
                    <a class="cui__menuLeft__item__link" id="left-menu-contacts" href={{ route('cms.contacts') }}>
                        <span class="cui__menuLeft__item__title">Contacts</span>
                        <i class="cui__menuLeft__item__icon fe fe-message-circle"></i>
                    </a>
                </li>

                @if (Auth::user()->admin_flg)
                    <li class="cui__menuLeft__category">Account</li>
                    <li class="cui__menuLeft__item">
                        <a class="cui__menuLeft__item__link" id="left-menu-admin-accounts"
                            href="{{ route('cms.accounts') }}">
                            <span class="cui__menuLeft__item__title">Admins</span>
                            <i class="cui__menuLeft__item__icon fe fe-users"></i>
                        </a>
                    </li>
                @endif
                {{-- <li class="cui__menuLeft__item">
                    <a class="cui__menuLeft__item__link" id="left-menu-password" href="{{ route('cms.accounts.edit-password') }}">
                        <span class="cui__menuLeft__item__title">{{ trans('cms.password') }}</span>
                        <i class="cui__menuLeft__item__icon fe fe-shield"></i>
                    </a>
                </li>
                <li class="cui__menuLeft__item">
                    <a class="cui__menuLeft__item__link" href="{{ route('logout') }}">
                        <span class="cui__menuLeft__item__title">{{ trans('button.logout') }}</span>
                        <i class="cui__menuLeft__item__icon fe fe-log-out"></i>
                    </a>
                </li> --}}
            </ul>
        </div>
    </div>
</div>
<div class="cui__menuLeft__backdrop"></div>
