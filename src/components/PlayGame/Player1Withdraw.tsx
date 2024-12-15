import {usePlayer2Timeout} from "@/hooks/writeContract";
import {useEffect, useState} from "react";

export const Player1Withdraw = () => {
    const [isPending, setIsPending] = useState<boolean>(false);

    const {mutateAsync, isError} = usePlayer2Timeout()

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