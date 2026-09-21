<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['slug', 'name', 'type'])]
class Activity extends Model
{
    public function attempts(): HasMany
    {
        return $this->hasMany(Attempt::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class);
    }
}
