import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

interface StudentRow {
    id: number;
    name: string;
    last_activity_at: string | null;
    [activitySlug: string]: unknown;
}

const STATUS_LABEL: Record<string, string> = {
    not_started: 'Não iniciado',
    in_progress: 'Em andamento',
    completed: 'Concluído',
};

export default function ClassPage({
    class: schoolClass,
    activities,
    students,
}: {
    class: { id: number; name: string; code: string };
    activities: Record<string, string>;
    students: StudentRow[];
}) {
    const activitySlugs = Object.keys(activities);

    return (
        <AppLayout title={schoolClass.name} backHref={route('teacher.dashboard')}>
            <Head title={schoolClass.name} />

            <p className="mb-6 text-sm text-gray-500">
                Código da turma: <span className="font-mono font-semibold">{schoolClass.code}</span>
            </p>

            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-gray-50 text-left text-gray-500">
                            <th className="px-4 py-3">Aluno</th>
                            {activitySlugs.map((slug) => (
                                <th key={slug} className="px-4 py-3">
                                    {activities[slug]}
                                </th>
                            ))}
                            <th className="px-4 py-3">Última atividade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <Link
                                        href={route('teacher.classes.student', [schoolClass.id, student.id])}
                                        className="text-indigo-600 hover:underline"
                                    >
                                        {student.name}
                                    </Link>
                                </td>
                                {activitySlugs.map((slug) => (
                                    <td key={slug} className="px-4 py-3">
                                        {STATUS_LABEL[student[slug] as string] ?? '—'}
                                    </td>
                                ))}
                                <td className="px-4 py-3">{student.last_activity_at ?? '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {students.length === 0 && (
                    <p className="p-4 text-sm text-gray-500">
                        Nenhum aluno entrou nesta turma ainda. Compartilhe o código {schoolClass.code}.
                    </p>
                )}
            </div>
        </AppLayout>
    );
}
