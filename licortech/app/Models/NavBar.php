<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Auth;

class NavBar extends Model
{
    use HasFactory;
    protected $table = 'nav_bars';

    protected $guarded = [];

    protected $casts = [
        'order_dsp' => 'integer',
        'cms_flg' => 'boolean',
        'content_flg' => 'boolean',
    ];

    public function page(): HasOne
    {
        return $this->hasOne(Page::class, 'id', 'page_id');
    }

    public function papa(): HasOne
    {
        return $this->hasOne(NavBar::class, 'id', 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(NavBar::class, 'parent_id', 'id')->orderBy('order_dsp');
    }

    public function scopeParent(Builder $query): void
    {
        $query->whereNull('parent_id');
    }

    public function scopeContent(Builder $query): void
    {
        $query->where('content_flg', 1);
    }

    public static function getById(int $id)
    {
        return NavBar::where('id', $id)
            ->with('page', 'papa', 'children')
            ->first();
    }

    public static function getForLandingPage()
    {
        return NavBar::where('cms_flg', 0)
            ->parent()
            ->orderBy('order_dsp')
            ->with('page', 'children')
            ->get();
    }

    public static function getForCMSPage()
    {
        if (Auth::user()->admin_flg) {
            return NavBar::where('cms_flg', 1)
                ->parent()
                ->orderBy('order_dsp')
                ->with('page', 'children')
                ->get();
        }

        return NavBar::where('cms_flg', 1)
            ->parent()
            ->content()
            ->orderBy('order_dsp')
            ->with('page', 'children')
            ->get();
    }
}
