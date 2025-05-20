<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNavBarsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('nav_bars', function (Blueprint $table) {
            $table->id();

            $table->string('name', 50);
            foreach (config('app.locales') as $locale) {
                if ($locale != config('app.default_locale')) {
                    $table->string('name_' . $locale, 50)->nullable();
                }
            }

            $table->bigInteger('parent_id')->nullable();
            $table->bigInteger('page_id')->nullable();
            $table->string('redirect')->nullable();
            $table->smallInteger('order_dsp')->default(1);
            $table->boolean('cms_flg')->default(false);
            $table->boolean('content_flg')->default(false);
            $table->string('icon', 100)->nullable();
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
        Schema::dropIfExists('nav_bars');
    }
}
