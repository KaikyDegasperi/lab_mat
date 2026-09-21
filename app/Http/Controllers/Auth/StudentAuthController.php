<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\SchoolClass;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StudentAuthController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/StudentLogin');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'class_code' => ['required', 'string', 'max:12'],
        ]);

        $class = SchoolClass::where('code', strtoupper($data['class_code']))->first();

        if (! $class) {
            throw ValidationException::withMessages([
                'class_code' => 'Código de turma não encontrado.',
            ]);
        }

        $student = User::where('type', 'student')
            ->where('name', $data['name'])
            ->whereHas('classes', fn ($q) => $q->where('classes.id', $class->id))
            ->first();

        if (! $student) {
            $student = User::create([
                'type' => 'student',
                'name' => $data['name'],
            ]);
            $class->students()->attach($student->id);
        }

        auth()->login($student, remember: true);

        return redirect()->route('student.dashboard');
    }

    public function destroy(Request $request): RedirectResponse
    {
        auth()->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
