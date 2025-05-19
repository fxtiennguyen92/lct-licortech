<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();

            $table->string('route', 150)->unique();
            $table->string('name')->nullable();
            $table->text('short_description')->nullable();

            foreach (config('app.locales') as $locale) {
                if ($locale != config('app.default_locale')) {
                    $table->string('name_' . $locale)->nullable();
                    $table->text('short_description_' . $locale)->nullable();
                }
            }
            $table->string('image')->nullable();
            $table->smallInteger('order_dsp')->nullable()->default(1);
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
        Schema::dropIfExists('services');
    }
}
