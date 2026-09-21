import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Laboratório Virtual de Matemática" />

            <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
                <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-12 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                        Laboratório Virtual de Matemática
                    </h1>
                    <p className="mt-4 max-w-xl text-gray-600">
                        Investigue padrões, geometria e áreas através de
                        experimentos interativos: Torre de Hanói e Tangram.
                    </p>

                    <div className="mt-10 grid w-full gap-4 sm:grid-cols-3">
                        <Link
                            href={route('student.login')}
                            className="rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md"
                        >
                            <span className="text-2xl">🎓</span>
                            <h2 className="mt-2 font-semibold text-gray-900">
                                Sou aluno
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Entre com seu nome e o código da sua turma.
                            </p>
                        </Link>

                        <Link
                            href={route('teacher.login')}
                            className="rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md"
                        >
                            <span className="text-2xl">🧑‍🏫</span>
                            <h2 className="mt-2 font-semibold text-gray-900">
                                Sou professor
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Crie turmas e acompanhe o progresso dos alunos.
                            </p>
                        </Link>

                        <Link
                            href={route('demo.hanoi')}
                            className="rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md"
                        >
                            <span className="text-2xl">✨</span>
                            <h2 className="mt-2 font-semibold text-gray-900">
                                Experimentar sem cadastro
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Jogue livremente, sem salvar progresso.
                            </p>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
