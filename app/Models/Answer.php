<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['student_id', 'activity_id', 'question', 'answer'])]
class Answer extends Model
{
    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }
}
