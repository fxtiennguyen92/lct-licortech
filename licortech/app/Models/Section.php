<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Section extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function texts(): HasMany
    {
        return $this->hasMany(Text::class, 'section_id', 'id')->orderBy('order_dsp');
    }

    public function images(): HasMany
    {
        return $this->hasMany(Image::class, 'section_id', 'id')->orderBy('order_dsp');
    }

    public function buttons(): HasMany
    {
        return $this->hasMany(Button::class, 'section_id', 'id')->orderBy('order_dsp');
    }

    public static function getByCode($code) {
        return Section::where('code', $code)->with(['texts', 'images', 'buttons'])->first();
    }
}
