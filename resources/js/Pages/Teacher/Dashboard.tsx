import InputError from '@/Components/InputError';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface ClassRow {
    id: number;
    name: string;
    code: string;
    students_count: number;
}

export default function Dashboard({ classes }: { classes: ClassRow[] }) {
    const [showForm, setShowForm] = useState(classes.length === 0);
    const { data, setData, post, processing, errors, reset } = useForm({ name: '' });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('teacher.classes.store'), {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    return (
        <AppLayout title="Minhas turmas">
            <Head title="Minhas turmas" />

            <div className="mb-4 flex justify-end">
                <button
                    onClick={() => setShowForm((v) => !v)}
                    className="rounded-md bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-gray-700"
                >
                    Criar turma
                </button>
            </div>

            {showForm && (
                <form onSubmit={submit} className="mb-6 flex items-end gap-3 rounded-lg border border-gray-200 bg-white p-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Nome da turma</label>
                        <input
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            autoFocus
                        />
                        <InputError message={errors.name} className="mt-1" />
                    </div>
                    <button
                        disabled={processing}
                        className="rounded-md bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-gray-700"
                    >
                        Salvar
                    </button>
                </form>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                {classes.map((c) => (
                    <Link
                        key={c.id}
                        href={route('teacher.classes.show', c.id)}
                        className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:border-indigo-300 hover:shadow-md"
                    >
                        <h2 className="font-semibold text-gray-900">{c.name}</h2>
                        <p className="mt-1 text-sm text-gray-500">Código {c.code}</p>
                        <p className="mt-1 text-sm text-gray-500">
                            {c.students_count} {c.students_count === 1 ? 'aluno' : 'alunos'}
                        </p>
                    </Link>
                ))}
            </div>

            {classes.length === 0 && !showForm && (
                <p className="text-sm text-gray-500">Você ainda não criou nenhuma turma.</p>
            )}
        </AppLayout>
    );
}
