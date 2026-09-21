<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'student_id', 'activity_id', 'level', 'movements',
    'duration', 'completed', 'hypothesis', 'prediction',
])]
class Attempt extends Model
{
    protected function casts(): array
    {
        return [
            'completed' => 'boolean',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }
}
