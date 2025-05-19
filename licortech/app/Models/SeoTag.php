<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeoTag extends Model
{
    use HasFactory;
    protected $guarded = [];

    public static function getByPage($pageId)
    {
        return SeoTag::where('page_id', $pageId)
            ->get();
    }

    public static function getByPageAndName($pageId, $tagName) {
        return SeoTag::where('page_id', $pageId)
            ->where('name', $tagName)
            ->first();
    }

    public static function getByPageAndProperty($pageId, $tagPro) {
        return SeoTag::where('page_id', $pageId)
            ->where('property', $tagPro)
            ->first();
    }
}
