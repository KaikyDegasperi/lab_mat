import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';

interface Attempt {
    id: number;
    level: string;
    movements: number | null;
    duration: number | null;
    completed: boolean;
    hypothesis: string | null;
    prediction: string | null;
    created_at: string;
}

interface Answer {
    id: number;
    question: string;
    answer: string;
    created_at: string;
}

export default function Student({
    class: schoolClass,
    student,
    attempts,
    answers,
}: {
    class: { id: number; name: string; code: string };
    student: { id: number; name: string };
    attempts: Record<string, Attempt[]>;
    answers: Record<string, Answer[]>;
}) {
    const slugs = Array.from(new Set([...Object.keys(attempts), ...Object.keys(answers)]));

    return (
        <AppLayout
            title={student.name}
            backHref={route('teacher.classes.show', schoolClass.id)}
        >
            <Head title={student.name} />

            {slugs.length === 0 && (
                <p className="text-sm text-gray-500">Este aluno ainda não realizou nenhuma atividade.</p>
            )}

            <div className="space-y-8">
                {slugs.map((slug) => (
                    <div key={slug} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="font-semibold capitalize text-gray-900">{slug}</h2>

                        {attempts[slug]?.length > 0 && (
                            <div className="mt-3">
                                <h3 className="text-sm font-medium text-gray-600">Tentativas</h3>
                                <ul className="mt-1 space-y-1 text-sm text-gray-700">
                                    {attempts[slug].map((a) => (
                                        <li key={a.id}>
                                            Nível/desafio {a.level}
                                            {a.movements !== null && ` — ${a.movements} movimentos`}
                                            {a.duration !== null && ` — ${a.duration}s`}
                                            {a.completed ? ' — concluído' : ' — não concluído'}
                                            {a.hypothesis && (
                                                <div className="ml-4 mt-1 italic text-gray-500">
                                                    Hipótese: “{a.hypothesis}”
                                                </div>
                                            )}
                                            {a.prediction && (
                                                <div className="ml-4 text-gray-500">Previsão: {a.prediction}</div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {answers[slug]?.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-sm font-medium text-gray-600">Respostas escritas</h3>
                                <ul className="mt-1 space-y-2 text-sm text-gray-700">
                                    {answers[slug].map((a) => (
                                        <li key={a.id}>
                                            <span className="font-medium">{a.question}</span>
                                            <br />
                                            {a.answer}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
