<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\SchoolClass;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ClassController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $request->user()->classesTaught()->create([
            'name' => $data['name'],
            'code' => SchoolClass::generateCode(),
        ]);

        return back();
    }

    public function show(Request $request, SchoolClass $class): Response
    {
        abort_unless($class->teacher_id === $request->user()->id, 403);

        $activities = Activity::all();

        $students = $class->students()->get()->map(function ($student) use ($activities) {
            $row = [
                'id' => $student->id,
                'name' => $student->name,
            ];

            foreach ($activities as $activity) {
                $attempts = $activity->attempts()->where('student_id', $student->id)->get();
                $row[$activity->slug] = $attempts->isEmpty()
                    ? 'not_started'
                    : ($attempts->where('completed', true)->isNotEmpty() ? 'completed' : 'in_progress');
            }

            $lastAttempt = $student->attempts()->orderByDesc('created_at')->first();
            $row['last_activity_at'] = $lastAttempt?->created_at?->format('d/m/Y');

            return $row;
        });

        return Inertia::render('Teacher/Class', [
            'class' => $class->only('id', 'name', 'code'),
            'activities' => $activities->pluck('name', 'slug'),
            'students' => $students,
        ]);
    }

    public function student(Request $request, SchoolClass $class, int $studentId): Response
    {
        abort_unless($class->teacher_id === $request->user()->id, 403);

        $student = $class->students()->findOrFail($studentId);

        $attempts = $student->attempts()->with('activity')->orderBy('created_at')->get()
            ->groupBy(fn ($attempt) => $attempt->activity->slug);

        $answers = $student->answers()->with('activity')->orderBy('created_at')->get()
            ->groupBy(fn ($answer) => $answer->activity->slug);

        return Inertia::render('Teacher/Student', [
            'class' => $class->only('id', 'name', 'code'),
            'student' => $student->only('id', 'name'),
            'attempts' => $attempts,
            'answers' => $answers,
        ]);
    }
}
