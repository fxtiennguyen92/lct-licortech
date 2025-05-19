<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SysCommon extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $guarded = [];

    /**
     * Get array of all system common variables
     */
    public static function getAll()
    {
        $data = array();
        $commons = SysCommon::all();
        foreach ($commons as $common) {
            $data += array($common->code => $common->value);
        }

        return (object) $data;
    }

    public static function getByCode(string $code)
    {
        return SysCommon::where('code', $code)->first();
    }

    public static function getList(string $search = '', int $page = 1, int $rowsPerPage = 15)
    {
        $data = SysCommon::where('code', 'LIKE', '%' . $search . '%')
            ->orWhere('value', 'LIKE', '%' . $search . '%')
            ->withTrashed()
            ->orderBy('updated_at', 'desc')
            ->skip(($page - 1) * $rowsPerPage)
            ->take($rowsPerPage)
            ->get();
        $cntData = SysCommon::where('code', 'LIKE', '%' . $search . '%')
            ->orWhere('value', 'LIKE', '%' . $search . '%')
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
}
