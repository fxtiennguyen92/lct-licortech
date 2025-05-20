<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'active_flg' => 'boolean',
        'featured_flg' => 'boolean',
    ];

    public function scopeActive(Builder $query): void
    {
        $query->where('active_flg', 1);
    }

    public function scopeFeatured(Builder $query): void
    {
        $query->where('featured_flg', 1);
    }

    public static function getAllFeatured($currentPostId = null)
    {
        return Post::where('featured_flg', 1)
            ->where('id', '!=', $currentPostId)->get();
    }

    public static function getByRoute($route)
    {
        return Post::where('route', $route)->first();
    }

    public static function getAllByPage($search = '', $page = 1, $rowsPerPage = 3)
    {
        $data = Post::where('title', 'LIKE', '%' . $search . '%')
            ->orderBy('updated_at', 'desc')
            ->skip(($page - 1) * $rowsPerPage)
            ->take($rowsPerPage)
            ->get();
        $cntData = Post::where('title', 'LIKE', '%' . $search . '%')
            ->count();

        $result = (object) array(
            'data' => $data,
            'nav' => (object) array(
                'page' => $page,
                'limit' => $rowsPerPage,
                'pages' => (int) ceil($cntData / $rowsPerPage),
            ),
            'featured' => Post::featured()->orderBy('updated_at')->get(),
        );

        return $result;
    }

    public static function getAllByAdmin()
    {
        return Post::withTrashed()->get();
    }
}
