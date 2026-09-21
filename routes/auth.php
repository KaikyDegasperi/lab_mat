<?php

use App\Http\Controllers\Auth\StudentAuthController;
use App\Http\Controllers\Auth\TeacherAuthController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('entrar', [StudentAuthController::class, 'create'])->name('student.login');
    Route::post('entrar', [StudentAuthController::class, 'store'])->name('student.login.store');

    Route::get('professor/entrar', [TeacherAuthController::class, 'create'])->name('teacher.login');
    Route::post('professor/entrar', [TeacherAuthController::class, 'store'])->name('teacher.login.store');

    Route::get('professor/registrar', [TeacherAuthController::class, 'createAccount'])->name('teacher.register');
    Route::post('professor/registrar', [TeacherAuthController::class, 'storeAccount'])->name('teacher.register.store');
});

Route::middleware('auth')->group(function () {
    Route::post('sair', [StudentAuthController::class, 'destroy'])->name('logout');
});
