<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTextsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('texts', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('section_id')->index();

            $table->longText('title')->nullable();
            $table->longText('sub_title')->nullable();
            $table->longText('content')->nullable();
            $table->longText('sub_title_2')->nullable();
            $table->longText('content_2')->nullable();

            foreach (config('app.locales') as $locale) {
                if ($locale != config('app.default_locale')) {
                    $table->longText('title_' . $locale)->nullable();
                    $table->longText('sub_title_' . $locale)->nullable();
                    $table->longText('content_' . $locale)->nullable();
                    $table->longText('sub_title_2_' . $locale)->nullable();
                    $table->longText('content_2_' . $locale)->nullable();
                }
            }

            $table->string('image')->nullable();
            $table->smallInteger('order_dsp')->default(1);
            $table->json('list_dsp')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('texts');
    }
}
