import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function StudentLogin() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        class_code: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('student.login.store'));
    };

    return (
        <>
            <Head title="Entrar no Laboratório" />

            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6">
                <Link href={route('home')} className="mb-6 text-sm text-gray-500 hover:text-gray-700">
                    ← Voltar
                </Link>

                <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-sm">
                    <h1 className="text-xl font-semibold text-gray-900">
                        Entrar no Laboratório
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Informe seu nome e o código da sua turma.
                    </p>

                    <form onSubmit={submit} className="mt-6 space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="Nome" />
                            <TextInput
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                autoFocus
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="class_code" value="Código da turma" />
                            <TextInput
                                id="class_code"
                                className="mt-1 block w-full uppercase"
                                value={data.class_code}
                                onChange={(e) =>
                                    setData('class_code', e.target.value.toUpperCase())
                                }
                            />
                            <InputError message={errors.class_code} className="mt-2" />
                        </div>

                        <PrimaryButton className="w-full justify-center" disabled={processing}>
                            Entrar
                        </PrimaryButton>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        É professor?{' '}
                        <Link href={route('teacher.login')} className="text-indigo-600 hover:underline">
                            Entre por aqui
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
