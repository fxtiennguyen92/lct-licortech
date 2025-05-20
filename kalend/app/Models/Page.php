<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Page extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'order_dsp' => 'integer',
        'active_flg' => 'boolean',
        'cms_flg' => 'boolean',
    ];

    public function navbar(): BelongsTo
    {
        return $this->belongsTo(NavBar::class, 'id', 'page_id');
    }

    public function sections(): BelongsToMany
    {
        return $this->belongsToMany(Section::class)->orderBy('order_dsp')->orderBy('created_at');
    }

    public function seo(): HasMany
    {
        return $this->hasMany(SeoTag::class, 'page_id', 'id');
    }

    public static function getByCode($code)
    {
        return Page::where('code', $code)
            ->with('sections', 'sections.texts', 'sections.buttons', 'sections.images', 'seo')
            ->first();
    }

    public static function getByRoute($route)
    {
        return Page::where('route', $route)
            ->with('sections', 'sections.texts', 'sections.buttons', 'sections.images', 'seo')
            ->first();
    }

    public static function getList($search = '', $page = 1, $rowsPerPage = 15)
    {
        $data = Page::where('code', 'LIKE', '%' . $search . '%')
            ->orWhere('name', 'LIKE', '%' . $search . '%')
            ->withTrashed()
            ->orderBy('updated_at', 'desc')
            ->skip(($page - 1) * $rowsPerPage)
            ->take($rowsPerPage)
            ->get();
        $cntData = Page::where('code', 'LIKE', '%' . $search . '%')
            ->orWhere('name', 'LIKE', '%' . $search . '%')
            ->withTrashed()
            ->count();

        $result = (object) array(
            'data' => null,
            'nav' => (object) array(
                'page' => $page,
                'limit' => $rowsPerPage,
                'pages' => (int) ceil($cntData / $rowsPerPage),
            )
        );

        $result->data = $data;
        return $result;
    }

    public static function getListForContent($withCMSPage = false)
    {
        if ($withCMSPage) {
            return Page::with('sections')->orderBy('order_dsp')->get();
        }

        return Page::where('cms_flg', '0')
            ->with('sections')
            ->orderBy('order_dsp')
            ->get();
    }

    public static function getAvailableList(bool $cmsFlg = false)
    {
        return Page::doesntHave('navbar')
            ->where('cms_flg', (int) $cmsFlg)
            ->orderBy('order_dsp')
            ->get();
    }

    public static function getAll()
    {
        return Page::withTrashed()->get();
    }
}
