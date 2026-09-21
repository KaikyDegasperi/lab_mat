<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Attempt;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HanoiController extends Controller
{
    public function show(Request $request): Response
    {
        $student = $request->user();
        $activity = Activity::where('slug', 'hanoi')->firstOrFail();

        $attempts = Attempt::where('student_id', $student->id)
            ->where('activity_id', $activity->id)
            ->orderByDesc('created_at')
            ->get();

        $bestByLevel = $attempts->where('completed', true)
            ->groupBy('level')
            ->map(fn ($group) => $group->min('movements'));

        return Inertia::render('Student/Hanoi', [
            'bestByLevel' => $bestByLevel,
            'lastHypothesis' => $attempts->firstWhere('hypothesis', '!=', null)?->hypothesis,
        ]);
    }

    public function storeAttempt(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'level' => ['required', 'integer', 'min:1', 'max:10'],
            'movements' => ['required', 'integer', 'min:1'],
            'duration' => ['required', 'integer', 'min:0'],
            'completed' => ['required', 'boolean'],
            'hypothesis' => ['nullable', 'string', 'max:500'],
            'prediction' => ['nullable', 'string', 'max:50'],
        ]);

        $activity = Activity::where('slug', 'hanoi')->firstOrFail();

        Attempt::create([
            'student_id' => $request->user()->id,
            'activity_id' => $activity->id,
            ...$data,
        ]);

        return back();
    }
}
