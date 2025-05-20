<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateImagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('images', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('section_id')->index();
            $table->string('code')->nullable();
            $table->string('src')->nullable();

            $table->string('name')->nullable();
            $table->longText('content')->nullable();
            foreach (config('app.locales') as $locale) {
                if ($locale != config('app.default_locale')) {
                    $table->string('name_' . $locale)->nullable();
                    $table->longText('content_' . $locale)->nullable();
                }
            }

            $table->string('redirect')->nullable();
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
        Schema::dropIfExists('images');
    }
}
