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
            $table->string('Website');
            $table->string('Domain');
            $table->string('ChapterLevel');
            $table->string('SubchapterLevel');
            $table->string('Trait');
            $table->string('Population');
            $table->string('Ncase');
            $table->string('Ncontrol');
            $table->integer('N');
            $table->string('Genome');
            $table->integer('Nsnps');
            $table->integer('Nhits');
            $table->float('SNPh2');
            $table->float('SNPh2_se');
            $table->float('LambdaGC');
            $table->float('Chi2');
            $table->float('Intercept');
            $table->string('Note');
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
