<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Answer;
use App\Models\Attempt;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TangramController extends Controller
{
    public function show(Request $request): Response
    {
        $student = $request->user();
        $activity = Activity::where('slug', 'tangram')->firstOrFail();

        $attempts = Attempt::where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->get();

        $answers = Answer::where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->get(['question', 'answer']);

        return Inertia::render('Student/Tangram', [
            'completedChallenges' => $attempts->where('completed', true)->pluck('level')->unique()->values(),
            'answers' => $answers,
        ]);
    }

    public function storeAttempt(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'level' => ['required', 'string', 'max:50'],
            'duration' => ['required', 'integer', 'min:0'],
            'completed' => ['required', 'boolean'],
        ]);

        $activity = Activity::where('slug', 'tangram')->firstOrFail();

        Attempt::create([
            'student_id' => $request->user()->id,
            'activity_id' => $activity->id,
            ...$data,
        ]);

        return back();
    }

    public function storeAnswer(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'question' => ['required', 'string', 'max:255'],
            'answer' => ['required', 'string', 'max:2000'],
        ]);

        $activity = Activity::where('slug', 'tangram')->firstOrFail();

        Answer::create([
            'student_id' => $request->user()->id,
            'activity_id' => $activity->id,
            ...$data,
        ]);

        return back();
    }
}
