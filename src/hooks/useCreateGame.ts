import {useMutation} from "@tanstack/react-query";
import {CreateGameType} from "@/utils/types";
import {useWalletClient} from "wagmi";
import {createMoveHash} from "@/utils/createMoveHash";
import {createGame} from "@/lib/contract";
import {CONTRACT_ADDRESS_KEY, SALT_KEY} from "@/utils/const";

export const useCreateGame = () => {
    const {data: signer} = useWalletClient()

    return useMutation({
        mutationKey: ['createGame'],
        mutationFn: async ({player2, move, salt, stake}: CreateGameType) => {
            localStorage.setItem(SALT_KEY, salt)
            const moveHash = createMoveHash(move!, salt)
            return await createGame(signer!, moveHash, stake, player2!)
        },
        onSuccess: data => {
            localStorage.setItem(CONTRACT_ADDRESS_KEY, data as string)
        },
        onError: error => {
            console.log('onError', error)
        }
    })
}