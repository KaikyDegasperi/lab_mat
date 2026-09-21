<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class TeacherAuthController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/TeacherLogin');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $teacher = User::where('type', 'teacher')->where('email', $data['email'])->first();

        if (! $teacher || ! Hash::check($data['password'], $teacher->password)) {
            throw ValidationException::withMessages([
                'email' => 'Credenciais inválidas.',
            ]);
        }

        auth()->login($teacher, remember: true);

        return redirect()->route('teacher.dashboard');
    }

    public function createAccount(): Response
    {
        return Inertia::render('Auth/TeacherRegister');
    }

    public function storeAccount(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $teacher = User::create([
            'type' => 'teacher',
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        event(new Registered($teacher));

        auth()->login($teacher);

        return redirect()->route('teacher.dashboard');
    }

    public function destroy(Request $request): RedirectResponse
    {
        auth()->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
