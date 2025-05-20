<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateButtonsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('buttons', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('section_id')->index();
            $table->string('code', 50)->nullable();

            $table->string('text', 150);
            foreach (config('app.locales') as $locale) {
                if ($locale != config('app.default_locale')) {
                    $table->string('text_' . $locale, 150)->nullable();
                }
            }

            $table->string('redirect')->nullable();
            $table->smallInteger('order_dsp')->default(1);
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
        Schema::dropIfExists('buttons');
    }
}
