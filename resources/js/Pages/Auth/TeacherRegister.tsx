import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function TeacherRegister() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('teacher.register.store'));
    };

    return (
        <>
            <Head title="Criar conta de professor" />

            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6">
                <Link href={route('home')} className="mb-6 text-sm text-gray-500 hover:text-gray-700">
                    ← Voltar
                </Link>

                <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-sm">
                    <h1 className="text-xl font-semibold text-gray-900">Criar conta de professor</h1>

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
                            <InputLabel htmlFor="email" value="E-mail" />
                            <TextInput
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
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

                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Confirmar senha" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                className="mt-1 block w-full"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <PrimaryButton className="w-full justify-center" disabled={processing}>
                            Criar conta
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </>
    );
}
