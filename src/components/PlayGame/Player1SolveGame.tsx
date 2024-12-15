import {Move} from "@/utils/types";
import {useEffect, useState} from "react";
import {useGetGameState} from "@/hooks/gameState";
import {usePlayer1SolveGame} from "@/hooks/writeContract";
import {Moves} from "@/utils/const";

export const Player1SolveGame = ({refetchContractState}: { refetchContractState: () => void }) => {
    const {data: gameState} = useGetGameState();
    const {mutateAsync, isError} = usePlayer1SolveGame();

    const [salt, setSalt] = useState<string>(gameState?.salt || '');
    const [move, setMove] = useState<Move | null>(gameState?.player1Move || null);
    const [isPending, setIsPending] = useState<boolean>(false);

    const handleSolveGame = async () => {
        if (!move || !salt) return;
        setIsPending(true);
        await mutateAsync({move, salt});
        refetchContractState();
        setIsPending(false);
    }

    useEffect(() => {
        if (isError) {
            setIsPending(false);
            refetchContractState();
        }
    }, [isError])

    return (
        <div>
            <label className="block text-gray-700">Move You Played</label>
            <select
                value={move || ''}
                onChange={(e) => setMove(e.target.value as unknown as Move)}
                className="w-full px-3 py-2 border rounded-lg text-black placeholder:text-gray-500"
            >
                <option value="">Select Move</option>
                {Moves.map((move) => (
                    <option key={move} value={move}>
                        {Move[move]}
                    </option>
                ))}
            </select>
            <label className="block text-gray-700">Salt</label>
            <input
                type="text"
                value={salt}
                onChange={(e) => setSalt(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-black placeholder:text-gray-500"
            />
            <button
                onClick={handleSolveGame}
                disabled={isPending}
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 mt-4"
            >
                {isPending ? 'Solving...' : 'Solve Game'}
            </button>
        </div>
    )
}