import {usePlayer1Timeout} from "@/hooks/writeContract";
import {useEffect, useState} from "react";

export const Player2Withdraw = ({timer}: { timer: number }) => {
    const [isPending, setIsPending] = useState<boolean>(false);

    const {mutateAsync, isError} = usePlayer1Timeout()

    const handleWithdraw = async () => {
        setIsPending(true)
        await mutateAsync()
        setIsPending(false)
    }

    useEffect(() => {
        if (isError) {
            setIsPending(false)
        }
    }, [isError])

    return (
        <div>
            <p>
                {timer > 0 ? `Player 1 has not revealed their move. Player 2 can withdraw after time is up!.` : 'Player 1 has not revealed their move. Player 2 can withdraw.'}
            </p>
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