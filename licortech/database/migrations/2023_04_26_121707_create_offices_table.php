<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOfficesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('offices', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('sub_name')->nullable();
            $table->string('address_1')->nullable();
            $table->string('address_2')->nullable();

            foreach (config('app.locales') as $locale) {
                if ($locale != config('app.default_locale')) {
                    $table->string('name_' . $locale)->nullable();
                    $table->string('sub_name_' . $locale)->nullable();
                    $table->string('address_1_' . $locale)->nullable();
                    $table->string('address_2_' . $locale)->nullable();
                }
            }

            $table->string('phone_1')->nullable();
            $table->string('phone_2')->nullable();
            $table->string('email_1')->nullable();
            $table->string('email_2')->nullable();
            $table->longText('map')->nullable();
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
        Schema::dropIfExists('offices');
    }
}
