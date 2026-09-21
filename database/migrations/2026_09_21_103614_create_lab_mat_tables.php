<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('code', 12)->unique();
            $table->timestamps();
        });

        Schema::create('class_student', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_id')->constrained('classes')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['class_id', 'student_id']);
        });

        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('type');
            $table->timestamps();
        });

        Schema::create('attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('activity_id')->constrained('activities')->cascadeOnDelete();
            $table->string('level')->nullable();
            $table->unsignedInteger('movements')->nullable();
            $table->unsignedInteger('duration')->nullable();
            $table->boolean('completed')->default(false);
            $table->string('hypothesis')->nullable();
            $table->string('prediction')->nullable();
            $table->timestamps();
        });

        Schema::create('answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('activity_id')->constrained('activities')->cascadeOnDelete();
            $table->string('question');
            $table->text('answer');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('answers');
        Schema::dropIfExists('attempts');
        Schema::dropIfExists('activities');
        Schema::dropIfExists('class_student');
        Schema::dropIfExists('classes');
    }
};
