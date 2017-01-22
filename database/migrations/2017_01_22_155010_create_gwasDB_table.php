<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGwasDBTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gwasDB', function (Blueprint $table) {
            $table->increments('id');
            $table->string('PMID');
            $table->integer('Year');
            $table->string('File');
            $table->string('website');
            $table->string('Domain');
            $table->string('ChapterLevel');
            $table->string('SubchapterLevel');
            $table->string('Trait');
            $table->string('Population');
            $table->string('Ncase');
            $table->string('Ncontrol');
            $table->integer('N');
            $table->string('Note');
            $table->string('SNPh2');
            $table->string('Genome');
            $table->date('DateAdded');
            $table->date('DateLastModified');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('gwasDB');
    }
}
