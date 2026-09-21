<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeacherDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $classes = $request->user()->classesTaught()
            ->withCount('students')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($class) => [
                'id' => $class->id,
                'name' => $class->name,
                'code' => $class->code,
                'students_count' => $class->students_count,
            ]);

        return Inertia::render('Teacher/Dashboard', [
            'classes' => $classes,
        ]);
    }
}
