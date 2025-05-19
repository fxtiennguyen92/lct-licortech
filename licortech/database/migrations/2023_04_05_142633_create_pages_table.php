<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();

            $table->string('name');
            $table->string('head_title')->nullable();
            foreach (config('app.locales') as $locale) {
                if ($locale != config('app.default_locale')) {
                    $table->string('name_' . $locale)->nullable();
                    $table->string('head_title_' . $locale)->nullable();
                }
            }

            $table->string('route')->nullable();
            $table->smallInteger('order_dsp')->default(1);
            $table->boolean('active_flg')->default(true);
            $table->boolean('cms_flg')->default(false);
            $table->timestamps();
            $table->softDeletes($column = 'deleted_at', $precision = 0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pages');
    }
}
