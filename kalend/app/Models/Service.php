<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;
    protected $guarded = [];

    public static function getAll() {
        return Service::orderBy('order_dsp')->get();
    }

    public static function getByRoute($route) {
        return Service::where('route', $route)->first();
    }
}
