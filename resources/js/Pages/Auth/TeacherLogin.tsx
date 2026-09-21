import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function TeacherLogin() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('teacher.login.store'));
    };

    return (
        <>
            <Head title="Entrar como professor" />

            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6">
                <Link href={route('home')} className="mb-6 text-sm text-gray-500 hover:text-gray-700">
                    ← Voltar
                </Link>

                <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-sm">
                    <h1 className="text-xl font-semibold text-gray-900">Área do professor</h1>

                    <form onSubmit={submit} className="mt-6 space-y-4">
                        <div>
                            <InputLabel htmlFor="email" value="E-mail" />
                            <TextInput
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Senha" />
                            <TextInput
                                id="password"
                                type="password"
                                className="mt-1 block w-full"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <PrimaryButton className="w-full justify-center" disabled={processing}>
                            Entrar
                        </PrimaryButton>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Ainda não tem conta?{' '}
                        <Link href={route('teacher.register')} className="text-indigo-600 hover:underline">
                            Criar conta
                        </Link>
                    </p>
                    <p className="mt-2 text-center text-sm text-gray-500">
                        É aluno?{' '}
                        <Link href={route('student.login')} className="text-indigo-600 hover:underline">
                            Entre por aqui
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
