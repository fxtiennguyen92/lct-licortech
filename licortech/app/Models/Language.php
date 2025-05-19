<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\App;

class Language extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'order_dsp' => 'integer',
        'default_db_flg' => 'boolean',
    ];

    public static function getForPage()
    {
        // Check system setting
        $common = SysCommon::getByCode('multi_language');
        if ($common) {
            if ((bool) $common->value ==  true) {
                return Language::getList();
            }
        }

        return null;
    }

    public static function getByCode($code)
    {
        return Language::where('code', $code)->first();
    }

    public static function getList()
    {
        return Language::orderBy('order_dsp')->get();
    }

    public static function getCodeForView($currCode) {
        $lang = Language::getByCode($currCode);
        if (!$lang || $lang->default_db_flg) {
            return '';
        }

        return '_'.$lang->code;
    }
}
