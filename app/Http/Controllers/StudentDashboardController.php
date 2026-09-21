<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $student = $request->user();
        $class = $student->classes()->first();

        $activities = Activity::all()->map(function (Activity $activity) use ($student) {
            $attempts = $activity->attempts()->where('student_id', $student->id)->get();

            return [
                'slug' => $activity->slug,
                'name' => $activity->name,
                'attempts_count' => $attempts->count(),
                'completed_count' => $attempts->where('completed', true)->count(),
                'best_movements' => $attempts->where('completed', true)->min('movements'),
            ];
        });

        return Inertia::render('Student/Dashboard', [
            'student' => $student->only('id', 'name'),
            'class' => $class?->only('id', 'name'),
            'activities' => $activities,
        ]);
    }
}
