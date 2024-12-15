import {usePlayer2Timeout} from "@/hooks/writeContract";
import {useEffect, useState} from "react";

export const Player1Withdraw = ({refetchContractState} : { refetchContractState: () => void}) => {
    const [isPending, setIsPending] = useState<boolean>(false);

    const {mutateAsync, isError} = usePlayer2Timeout();

    const handleWithdraw = async () => {
        setIsPending(true);
        await mutateAsync();
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
            <p>Player 2 is yet to play their move. You can withdraw if they do not play until the timer runs out!</p>
            <button
                onClick={() => handleWithdraw()}
                disabled={isPending}
                className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 mt-4"
            >
                {isPending ? 'Withdrawing...' : 'Withdraw'}
            </button>
        </div>
    )
}