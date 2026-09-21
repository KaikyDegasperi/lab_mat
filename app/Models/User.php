<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['type', 'name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isTeacher(): bool
    {
        return $this->type === 'teacher';
    }

    public function isStudent(): bool
    {
        return $this->type === 'student';
    }

    /** Classes this teacher owns. */
    public function classesTaught(): HasMany
    {
        return $this->hasMany(SchoolClass::class, 'teacher_id');
    }

    /** Classes this student is enrolled in. */
    public function classes(): BelongsToMany
    {
        return $this->belongsToMany(SchoolClass::class, 'class_student', 'student_id', 'class_id');
    }

    public function attempts(): HasMany
    {
        return $this->hasMany(Attempt::class, 'student_id');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class, 'student_id');
    }
}
