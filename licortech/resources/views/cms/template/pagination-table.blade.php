<nav class="mt-2">
    <ul class="pagination justify-content-end">
        @if ($list->nav->page == 1)
        <li class="page-item disabled">
            <a class="page-link" href="javascript: void(0);" tabindex="-1">Previous</a>
        </li>
        @else
        <li class="page-item">
            <a class="page-link" href="{{ route('cms.system', ['search' => request()->get('search'), 'page' => $list->nav->page - 1]) }}" tabindex="-1">Previous</a>
        </li>
        @endif

        @if ($list->nav->page == 1)
            <li class="page-item active"><a class="page-link" href="{{ route('cms.system', ['search' => request()->get('search'), 'page' => $list->nav->page]) }}">{{ $list->nav->page }}</a></li>

            @for ($i = 2; $i <= $list->nav->pages; $i++)
                <li class="page-item"><a class="page-link" href="{{ route('cms.system', ['search' => request()->get('search'), 'page' => $i]) }}">{{ $i }}</a></li>
                @if ($i == 3) @break @endif
            @endfor
        @else
            @if ($list->nav->page == $list->nav->pages)
                @if ($list->nav->page > 2)
                    <li class="page-item"><a class="page-link" href="{{ route('cms.system', ['search' => request()->get('search'), 'page' => $list->nav->page - 2]) }}">{{ $list->nav->page - 2 }}</a></li>
                @endif
            @endif

            <li class="page-item"><a class="page-link" href="{{ route('cms.system', ['search' => request()->get('search'), 'page' => $list->nav->page - 1]) }}">{{ $list->nav->page - 1 }}</a></li>
            <li class="page-item active"><a class="page-link" href="{{ route('cms.system', ['search' => request()->get('search'), 'page' => $list->nav->page]) }}">{{ $list->nav->page }}</a></li>

            @if ($list->nav->page < $list->nav->pages)
                <li class="page-item"><a class="page-link" href="{{ route('cms.system', ['search' => request()->get('search'), 'page' => $list->nav->page + 1]) }}">{{ $list->nav->page + 1 }}</a></li>
            @endif
        @endif

        @if ($list->nav->page == $list->nav->pages)
        <li class="page-item disabled">
            <a class="page-link" href="javascript: void(0);" tabindex="-1">Next</a>
        </li>
        @else
        <li class="page-item">
            <a class="page-link" href="{{ route('cms.system', ['search' => request()->get('search'), 'page' => $list->nav->page + 1]) }}">Next</a>
        </li>
        @endif
    </ul>
</nav>
