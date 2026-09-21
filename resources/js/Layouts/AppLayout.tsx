import { Link, useForm } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function AppLayout({
    title,
    backHref,
    children,
}: PropsWithChildren<{ title: string; backHref?: string }>) {
    const { post, processing } = useForm({});

    const logout = () => post(route('logout'));

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        {backHref && (
                            <Link href={backHref} className="text-sm text-gray-500 hover:text-gray-700">
                                ←
                            </Link>
                        )}
                        <h1 className="font-semibold text-gray-900">{title}</h1>
                    </div>
                    <button
                        onClick={logout}
                        disabled={processing}
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        Sair
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
        </div>
    );
}
