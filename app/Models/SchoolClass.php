<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

#[Fillable(['teacher_id', 'name', 'code'])]
class SchoolClass extends Model
{
    protected $table = 'classes';

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'class_student', 'class_id', 'student_id');
    }

    public static function generateCode(): string
    {
        do {
            $code = strtoupper(Str::random(3)).'-'.strtoupper(Str::random(4));
        } while (self::where('code', $code)->exists());

        return $code;
    }
}
