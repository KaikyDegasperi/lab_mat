<?php

namespace Tests\Feature;

use App\Models\Activity;
use App\Models\SchoolClass;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LabFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Activity::create(['slug' => 'hanoi', 'name' => 'Torre de Hanói', 'type' => 'hanoi']);
        Activity::create(['slug' => 'tangram', 'name' => 'Tangram', 'type' => 'tangram']);
    }

    public function test_student_can_join_a_class_and_submit_a_hanoi_attempt(): void
    {
        $teacher = User::factory()->create(['type' => 'teacher']);
        $class = SchoolClass::create([
            'teacher_id' => $teacher->id,
            'name' => '8º Ano A',
            'code' => 'MAT2026',
        ]);

        $this->post(route('student.login.store'), [
            'name' => 'João Teste',
            'class_code' => 'mat2026',
        ])->assertRedirect(route('student.dashboard'));

        $student = User::where('type', 'student')->where('name', 'João Teste')->firstOrFail();
        $this->assertTrue($class->students()->where('student_id', $student->id)->exists());

        $this->actingAs($student)->post(route('student.hanoi.attempt'), [
            'level' => 3,
            'movements' => 7,
            'duration' => 42,
            'completed' => true,
        ])->assertSessionHasNoErrors();

        $this->assertSame(1, $student->attempts()->count());
    }

    public function test_teacher_sees_student_progress_in_their_class(): void
    {
        $teacher = User::factory()->create(['type' => 'teacher']);
        $class = SchoolClass::create([
            'teacher_id' => $teacher->id,
            'name' => '8º Ano A',
            'code' => 'MAT2026',
        ]);
        $student = User::factory()->create(['type' => 'student', 'email' => null, 'password' => null]);
        $class->students()->attach($student->id);

        $this->actingAs($teacher)
            ->get(route('teacher.classes.show', $class->id))
            ->assertOk();
    }
}
