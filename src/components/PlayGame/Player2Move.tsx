import {Move} from "@/utils/types";
import {Moves} from "@/utils/const";
import {useGetContractState} from "@/hooks/useGetContractState";
import {Address, formatEther} from "viem";
import {useEffect, useState} from "react";
import {usePlayer2Move} from "@/hooks/writeContract";

export const Player2Move = ({address, refetchContractState}: { address: Address, refetchContractState: () => void}) => {
    const [move, setMove] = useState<Move | null>(null);
    const [isPending, setIsPending] = useState<boolean>(false);

    const {data: contractState} = useGetContractState(address);
    const {mutateAsync, isError} = usePlayer2Move();

    const handlePlayMove = async () => {
        if (!move) return;
        setIsPending(true);
        await mutateAsync(move);
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
            <p>Stake: {formatEther(BigInt(contractState?.stake || 0))} ETH</p>
            <label className="block text-gray-700">Move</label>
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
            <button
                onClick={handlePlayMove}
                disabled={isPending}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mt-4"
            >
                {isPending ? 'Playing Move...' : 'Play Move'}
            </button>
        </div>
    )
}