import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

interface ActivitySummary {
    slug: string;
    name: string;
    attempts_count: number;
    completed_count: number;
    best_movements: number | null;
}

export default function Dashboard({
    student,
    class: schoolClass,
    activities,
}: {
    student: { id: number; name: string };
    class?: { id: number; name: string };
    activities: ActivitySummary[];
}) {
    const cards: Record<string, { icon: string; description: string; href: string }> = {
        hanoi: {
            icon: '🗼',
            description: 'Investigue padrões, sequências e potências.',
            href: route('student.hanoi'),
        },
        tangram: {
            icon: '🧩',
            description: 'Investigue área, frações e composição de figuras.',
            href: route('student.tangram'),
        },
    };

    return (
        <AppLayout title={`Olá, ${student.name}!`}>
            <Head title="Meu progresso" />

            {schoolClass && (
                <p className="text-sm text-gray-500">Turma: {schoolClass.name}</p>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {activities.map((activity) => {
                    const card = cards[activity.slug];

                    return (
                        <div key={activity.slug} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <span className="text-2xl">{card?.icon}</span>
                            <h2 className="mt-2 font-semibold text-gray-900">{activity.name}</h2>
                            {card && <p className="mt-1 text-sm text-gray-500">{card.description}</p>}

                            <dl className="mt-4 space-y-1 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <dt>Tentativas</dt>
                                    <dd>{activity.attempts_count}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt>Concluídas</dt>
                                    <dd>{activity.completed_count}</dd>
                                </div>
                                {activity.best_movements !== null && (
                                    <div className="flex justify-between">
                                        <dt>Melhor resultado</dt>
                                        <dd>{activity.best_movements} movimentos</dd>
                                    </div>
                                )}
                            </dl>

                            <Link
                                href={card?.href ?? '#'}
                                className="mt-4 inline-block rounded-md bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-gray-700"
                            >
                                Continuar
                            </Link>
                        </div>
                    );
                })}
            </div>
        </AppLayout>
    );
}
