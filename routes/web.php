<?php

use App\Http\Controllers\ClassController;
use App\Http\Controllers\HanoiController;
use App\Http\Controllers\StudentDashboardController;
use App\Http\Controllers\TangramController;
use App\Http\Controllers\TeacherDashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::get('/demo/hanoi', function () {
    return Inertia::render('Student/Hanoi', ['demo' => true, 'bestByLevel' => [], 'lastHypothesis' => null]);
})->name('demo.hanoi');

Route::get('/demo/tangram', function () {
    return Inertia::render('Student/Tangram', ['demo' => true, 'completedChallenges' => [], 'answers' => []]);
})->name('demo.tangram');

Route::middleware(['auth', 'user.type:student'])->prefix('aluno')->name('student.')->group(function () {
    Route::get('/', StudentDashboardController::class)->name('dashboard');

    Route::get('/hanoi', [HanoiController::class, 'show'])->name('hanoi');
    Route::post('/hanoi/tentativas', [HanoiController::class, 'storeAttempt'])->name('hanoi.attempt');

    Route::get('/tangram', [TangramController::class, 'show'])->name('tangram');
    Route::post('/tangram/tentativas', [TangramController::class, 'storeAttempt'])->name('tangram.attempt');
    Route::post('/tangram/respostas', [TangramController::class, 'storeAnswer'])->name('tangram.answer');
});

Route::middleware(['auth', 'user.type:teacher'])->prefix('professor')->name('teacher.')->group(function () {
    Route::get('/', TeacherDashboardController::class)->name('dashboard');
    Route::post('/turmas', [ClassController::class, 'store'])->name('classes.store');
    Route::get('/turmas/{class}', [ClassController::class, 'show'])->name('classes.show');
    Route::get('/turmas/{class}/alunos/{studentId}', [ClassController::class, 'student'])->name('classes.student');
});

require __DIR__.'/auth.php';
