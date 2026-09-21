import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { useRef, useState } from 'react';

type PieceShape = 'large' | 'medium' | 'small' | 'square' | 'parallelogram';

interface Piece {
    id: string;
    shape: PieceShape;
    color: string;
    size: number;
    x: number;
    y: number;
    rotation: number;
}

const CLIP_PATHS: Record<PieceShape, string> = {
    large: 'polygon(0% 0%, 100% 0%, 0% 100%)',
    medium: 'polygon(0% 0%, 100% 0%, 0% 100%)',
    small: 'polygon(0% 0%, 100% 0%, 0% 100%)',
    square: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    // slant is exactly 45°: horizontal offset between the parallel edges equals the piece height
    parallelogram: 'polygon(33.333% 0%, 100% 0%, 66.667% 100%, 0% 100%)',
};

// All sizes derive from one unit (the small triangle's leg = 65px), matching the
// classic tangram proportions: large leg = 2×unit, medium leg = √2×unit, square
// side = unit, parallelogram short side = unit at a true 45° angle.
const UNIT = 65;

function initialPieces(): Piece[] {
    return [
        { id: 'lg1', shape: 'large', color: '#f87171', size: UNIT * 2, x: 20, y: 20, rotation: 0 },
        { id: 'lg2', shape: 'large', color: '#fb923c', size: UNIT * 2, x: 170, y: 20, rotation: 90 },
        { id: 'md1', shape: 'medium', color: '#facc15', size: UNIT * Math.SQRT2, x: 20, y: 190, rotation: 0 },
        { id: 'sm1', shape: 'small', color: '#4ade80', size: UNIT, x: 140, y: 200, rotation: 0 },
        { id: 'sm2', shape: 'small', color: '#22d3ee', size: UNIT, x: 220, y: 200, rotation: 180 },
        { id: 'sq1', shape: 'square', color: '#818cf8', size: UNIT, x: 300, y: 20, rotation: 0 },
        // size here is the piece's height; the parallelogram's width is 3× that (see render below)
        { id: 'pg1', shape: 'parallelogram', color: '#e879f9', size: UNIT / Math.SQRT2, x: 290, y: 200, rotation: 0 },
    ];
}

const EXPERIMENTS = [
    { key: 'reconstrucao', label: 'Experimento 1 — Reconstrução' },
    { key: 'comparacao', label: 'Experimento 2 — Comparação' },
    { key: 'area', label: 'Experimento 3 — Área' },
    { key: 'descoberta', label: 'Experimento 4 — Descoberta' },
];

export default function Tangram({
    demo = false,
    completedChallenges = [],
    answers = [],
}: {
    demo?: boolean;
    completedChallenges?: string[];
    answers?: { question: string; answer: string }[];
}) {
    const [pieces, setPieces] = useState<Piece[]>(initialPieces());
    const [selected, setSelected] = useState<string | null>(null);
    const [experiment, setExperiment] = useState(EXPERIMENTS[0].key);
    const [comparisonAnswer, setComparisonAnswer] = useState('');
    const [areaAnswer, setAreaAnswer] = useState('');
    const [discoveryAnswer, setDiscoveryAnswer] = useState('');
    const [savedMessage, setSavedMessage] = useState<string | null>(null);
    const boardRef = useRef<HTMLDivElement>(null);
    const dragState = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

    function onPointerDown(e: React.PointerEvent, piece: Piece) {
        const board = boardRef.current?.getBoundingClientRect();
        if (!board) return;
        dragState.current = {
            id: piece.id,
            offsetX: e.clientX - board.left - piece.x,
            offsetY: e.clientY - board.top - piece.y,
        };
        setSelected(piece.id);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }

    function onPointerMove(e: React.PointerEvent) {
        if (!dragState.current) return;
        const board = boardRef.current?.getBoundingClientRect();
        if (!board) return;
        const { id, offsetX, offsetY } = dragState.current;

        setPieces((prev) =>
            prev.map((p) => {
                if (p.id !== id) return p;
                const width = p.shape === 'parallelogram' ? p.size * 3 : p.size;
                return {
                    ...p,
                    x: Math.max(0, Math.min(board.width - width, e.clientX - board.left - offsetX)),
                    y: Math.max(0, Math.min(board.height - p.size, e.clientY - board.top - offsetY)),
                };
            }),
        );
    }

    function onPointerUp() {
        dragState.current = null;
    }

    function rotateSelected() {
        if (!selected) return;
        setPieces((prev) =>
            prev.map((p) => (p.id === selected ? { ...p, rotation: (p.rotation + 45) % 360 } : p)),
        );
    }

    function resetBoard() {
        setPieces(initialPieces());
        setSelected(null);
    }

    function recordAttempt(level: string) {
        setSavedMessage(null);
        if (demo) {
            setSavedMessage('Modo demonstração: nada foi salvo.');
            return;
        }
        router.post(
            route('student.tangram.attempt'),
            { level, duration: 0, completed: true },
            { preserveScroll: true, onSuccess: () => setSavedMessage('Registrado!') },
        );
    }

    function recordAnswer(question: string, answer: string) {
        setSavedMessage(null);
        if (!answer.trim()) return;
        if (demo) {
            setSavedMessage('Modo demonstração: nada foi salvo.');
            return;
        }
        router.post(
            route('student.tangram.answer'),
            { question, answer },
            { preserveScroll: true, onSuccess: () => setSavedMessage('Resposta registrada!') },
        );
    }

    return (
        <AppLayout title="🧩 Tangram" backHref={demo ? route('home') : route('student.dashboard')}>
            <Head title="Tangram" />

            {demo && (
                <p className="mb-4 rounded-md bg-amber-50 px-4 py-2 text-sm text-amber-700">
                    Modo demonstração: seu progresso não será salvo.
                </p>
            )}

            <div className="flex flex-wrap gap-2">
                {EXPERIMENTS.map((exp) => (
                    <button
                        key={exp.key}
                        onClick={() => setExperiment(exp.key)}
                        className={`rounded-md px-3 py-1 text-sm ${
                            experiment === exp.key
                                ? 'bg-gray-800 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {exp.label} {completedChallenges.includes(exp.key) && '✓'}
                    </button>
                ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <button
                            onClick={rotateSelected}
                            disabled={!selected}
                            className="rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 disabled:opacity-40"
                        >
                            ⟳ Girar peça selecionada
                        </button>
                        <button
                            onClick={resetBoard}
                            className="rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
                        >
                            Reiniciar peças
                        </button>
                    </div>

                    <div
                        ref={boardRef}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        className="relative h-[420px] w-full overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-white"
                    >
                        {pieces.map((piece) => (
                            <div
                                key={piece.id}
                                onPointerDown={(e) => onPointerDown(e, piece)}
                                className={`absolute cursor-grab touch-none ${
                                    selected === piece.id ? 'ring-2 ring-indigo-500' : ''
                                }`}
                                style={{
                                    left: piece.x,
                                    top: piece.y,
                                    width: piece.shape === 'parallelogram' ? piece.size * 3 : piece.size,
                                    height: piece.size,
                                    backgroundColor: piece.color,
                                    clipPath: CLIP_PATHS[piece.shape],
                                    transform: `rotate(${piece.rotation}deg)`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                    {experiment === 'reconstrucao' && (
                        <>
                            <h2 className="font-semibold text-gray-900">Reconstrução</h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Utilize as sete peças para reconstruir o quadrado original.
                            </p>
                            <button
                                onClick={() => recordAttempt('reconstrucao')}
                                className="mt-4 rounded-md bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-gray-700"
                            >
                                Concluí o quadrado
                            </button>
                        </>
                    )}

                    {experiment === 'comparacao' && (
                        <>
                            <h2 className="font-semibold text-gray-900">Comparação</h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Experimente sobrepor as peças pequenas sobre o triângulo grande. Quantos
                                triângulos pequenos são necessários para cobrir um triângulo grande?
                            </p>
                            <input
                                type="number"
                                className="mt-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={comparisonAnswer}
                                onChange={(e) => setComparisonAnswer(e.target.value)}
                            />
                            <button
                                onClick={() => {
                                    recordAttempt('comparacao');
                                    recordAnswer('Quantos triângulos pequenos cabem no triângulo grande?', comparisonAnswer);
                                }}
                                className="mt-4 rounded-md bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-gray-700"
                            >
                                Registrar resposta
                            </button>
                        </>
                    )}

                    {experiment === 'area' && (
                        <>
                            <h2 className="font-semibold text-gray-900">Área</h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Considerando a área total do quadrado igual a 1, qual fração da área
                                corresponde a cada peça? Descreva sua investigação.
                            </p>
                            <textarea
                                className="mt-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                rows={4}
                                value={areaAnswer}
                                onChange={(e) => setAreaAnswer(e.target.value)}
                            />
                            <button
                                onClick={() => {
                                    recordAttempt('area');
                                    recordAnswer('Qual fração da área corresponde a cada peça?', areaAnswer);
                                }}
                                className="mt-4 rounded-md bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-gray-700"
                            >
                                Registrar resposta
                            </button>
                        </>
                    )}

                    {experiment === 'descoberta' && (
                        <>
                            <h2 className="font-semibold text-gray-900">Descoberta</h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Construa duas figuras diferentes utilizando todas as sete peças. O formato
                                mudou? A área mudou? Explique por quê.
                            </p>
                            <textarea
                                className="mt-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                rows={4}
                                value={discoveryAnswer}
                                onChange={(e) => setDiscoveryAnswer(e.target.value)}
                            />
                            <button
                                onClick={() => {
                                    recordAttempt('descoberta');
                                    recordAnswer('O formato mudou? A área mudou? Explique por quê.', discoveryAnswer);
                                }}
                                className="mt-4 rounded-md bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-gray-700"
                            >
                                Registrar resposta
                            </button>
                        </>
                    )}

                    {savedMessage && <p className="mt-3 text-sm text-green-600">{savedMessage}</p>}

                    {answers.length > 0 && (
                        <div className="mt-6 border-t pt-4">
                            <h3 className="text-sm font-semibold text-gray-700">Respostas anteriores</h3>
                            <ul className="mt-2 space-y-2 text-sm text-gray-600">
                                {answers.map((a, i) => (
                                    <li key={i}>
                                        <span className="font-medium">{a.question}</span>
                                        <br />
                                        {a.answer}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
