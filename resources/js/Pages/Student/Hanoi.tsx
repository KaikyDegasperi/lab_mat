import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const DISC_COLORS = [
    'bg-rose-400',
    'bg-amber-400',
    'bg-lime-400',
    'bg-teal-400',
    'bg-sky-400',
    'bg-violet-400',
];

type Towers = number[][];

function initialTowers(level: number): Towers {
    const first = Array.from({ length: level }, (_, i) => level - i);
    return [first, [], []];
}

function minimumMoves(level: number): number {
    return 2 ** level - 1;
}

export default function Hanoi({
    demo = false,
    bestByLevel = {},
    lastHypothesis = null,
}: {
    demo?: boolean;
    bestByLevel?: Record<string, number>;
    lastHypothesis?: string | null;
}) {
    const [level, setLevel] = useState(3);
    const [towers, setTowers] = useState<Towers>(() => initialTowers(3));
    const [selected, setSelected] = useState<number | null>(null);
    const [movements, setMovements] = useState(0);
    const [startedAt, setStartedAt] = useState<number | null>(null);
    const [elapsed, setElapsed] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [hypothesis, setHypothesis] = useState('');
    const [prediction, setPrediction] = useState('');
    const [saved, setSaved] = useState(false);
    const [invalidTower, setInvalidTower] = useState<number | null>(null);

    useEffect(() => {
        if (!startedAt || completed) return;
        const interval = setInterval(() => {
            setElapsed(Math.floor((Date.now() - startedAt) / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, [startedAt, completed]);

    const minimum = useMemo(() => minimumMoves(level), [level]);

    function restart(newLevel: number) {
        setLevel(newLevel);
        setTowers(initialTowers(newLevel));
        setSelected(null);
        setMovements(0);
        setStartedAt(null);
        setElapsed(0);
        setCompleted(false);
        setHypothesis('');
        setPrediction('');
        setSaved(false);
        setInvalidTower(null);
    }

    function flashInvalid(index: number) {
        setInvalidTower(index);
        setSelected(null);
        setTimeout(() => setInvalidTower(null), 400);
    }

    function handleTowerClick(index: number) {
        if (completed) return;

        if (selected === null) {
            if (towers[index].length > 0) {
                setSelected(index);
            } else {
                flashInvalid(index);
            }
            return;
        }

        if (selected === index) {
            setSelected(null);
            return;
        }

        const sourceTower = towers[selected];
        const disc = sourceTower[sourceTower.length - 1];
        const destTower = towers[index];
        const destTop = destTower[destTower.length - 1];

        if (destTop !== undefined && destTop < disc) {
            flashInvalid(index);
            return;
        }

        const nextTowers = towers.map((t) => [...t]);
        nextTowers[selected].pop();
        nextTowers[index].push(disc);

        setTowers(nextTowers);
        setSelected(null);
        setMovements((m) => m + 1);
        if (!startedAt) setStartedAt(Date.now());

        if (nextTowers[2].length === level) {
            setCompleted(true);
        }
    }

    function submit() {
        if (!demo) {
            router.post(
                route('student.hanoi.attempt'),
                {
                    level,
                    movements,
                    duration: elapsed,
                    completed: true,
                    hypothesis: hypothesis || null,
                    prediction: prediction || null,
                },
                { preserveScroll: true, onSuccess: () => setSaved(true) },
            );
        } else {
            setSaved(true);
        }
    }

    const levelsWithBest = Object.keys(bestByLevel)
        .map(Number)
        .sort((a, b) => a - b);

    return (
        <AppLayout title="🗼 Torre de Hanói" backHref={demo ? route('home') : route('student.dashboard')}>
            <Head title="Torre de Hanói" />

            {demo && (
                <p className="mb-4 rounded-md bg-amber-50 px-4 py-2 text-sm text-amber-700">
                    Modo demonstração: seu progresso não será salvo.
                </p>
            )}

            {lastHypothesis && (
                <p className="mb-4 rounded-md bg-indigo-50 px-4 py-2 text-sm text-indigo-700">
                    Sua última hipótese registrada: “{lastHypothesis}”
                </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Discos:</span>
                    {[3, 4, 5, 6].map((n) => (
                        <button
                            key={n}
                            onClick={() => restart(n)}
                            className={`rounded-md px-3 py-1 text-sm ${
                                level === n
                                    ? 'bg-gray-800 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {n}
                        </button>
                    ))}
                </div>

                <div className="flex gap-6 text-sm text-gray-600">
                    <span>Movimentos: {movements}</span>
                    <span>Tempo: {elapsed}s</span>
                </div>
            </div>

            {!completed && (
                <p className="mt-6 text-sm text-gray-500">
                    {selected === null
                        ? 'Clique em uma torre para pegar o disco do topo.'
                        : 'Agora clique na torre de destino.'}
                </p>
            )}

            <div className="mt-3 grid grid-cols-3 gap-6">
                {towers.map((tower, index) => (
                    <button
                        key={index}
                        onClick={() => handleTowerClick(index)}
                        className={`group relative flex h-64 cursor-pointer flex-col-reverse items-center justify-start rounded-lg border-2 bg-white p-2 pb-4 transition ${
                            invalidTower === index
                                ? 'animate-pulse border-red-400 bg-red-50'
                                : selected === index
                                  ? 'border-indigo-500 bg-indigo-50'
                                  : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                        }`}
                    >
                        {/* haste central */}
                        <div className="pointer-events-none absolute bottom-4 left-1/2 h-[calc(100%-2rem)] w-2 -translate-x-1/2 rounded-t bg-gray-300" />
                        {/* base */}
                        <div className="pointer-events-none absolute bottom-2 left-1/2 h-2 w-40 -translate-x-1/2 rounded bg-gray-400" />

                        {tower.map((disc, i) => (
                            <div
                                key={i}
                                className={`relative z-10 mb-1 flex h-7 items-center justify-center rounded text-xs font-semibold text-white/90 shadow ${DISC_COLORS[(disc - 1) % DISC_COLORS.length]}`}
                                style={{ width: `${44 + disc * 26}px` }}
                            >
                                {disc}
                            </div>
                        ))}
                    </button>
                ))}
            </div>

            {levelsWithBest.length > 0 && (
                <table className="mt-8 w-full max-w-md border-collapse text-sm">
                    <thead>
                        <tr className="border-b text-left text-gray-500">
                            <th className="py-2">Discos</th>
                            <th className="py-2">Seu melhor resultado</th>
                            <th className="py-2">Mínimo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {levelsWithBest.map((n) => (
                            <tr key={n} className="border-b">
                                <td className="py-2">{n}</td>
                                <td className="py-2">{bestByLevel[n]}</td>
                                <td className="py-2">{minimumMoves(n)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {completed && !saved && (
                <div className="mt-8 max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="font-semibold text-gray-900">Parabéns! Você concluiu em {movements} movimentos.</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        O mínimo possível para {level} discos é {minimum} movimentos.
                    </p>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Observe os resultados. Você consegue encontrar um padrão? Qual sua hipótese?
                        </label>
                        <textarea
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            rows={2}
                            value={hypothesis}
                            onChange={(e) => setHypothesis(e.target.value)}
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Quantos movimentos você acredita que serão necessários para {level + 1} discos?
                        </label>
                        <input
                            type="number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={prediction}
                            onChange={(e) => setPrediction(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={submit}
                        className="mt-4 rounded-md bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-gray-700"
                    >
                        Registrar hipótese
                    </button>
                </div>
            )}

            {completed && saved && (
                <div className="mt-8 max-w-md rounded-lg border border-green-200 bg-green-50 p-6 text-sm text-green-700">
                    Resultado registrado! Experimente outro número de discos para continuar investigando.
                </div>
            )}
        </AppLayout>
    );
}
