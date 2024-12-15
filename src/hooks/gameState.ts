import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {GAME_STATE_KEY} from "@/utils/const";
import {GameState} from "@/utils/types";

export const useGetGameState = () => {
    return useQuery({
        queryFn: () => {
            const localStorageGameState = localStorage.getItem(GAME_STATE_KEY)
            if (!localStorageGameState) return null
            return JSON.parse(localStorageGameState) as GameState
        },
        queryKey: ['getGameState'],
    })
}

export const useSetGameState = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['setGameState'],
        mutationFn: async (gameState: GameState) => {
            localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState))
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['getGameState']}).then(() => console.log('invalidateQueries'), () => console.log('invalidateQueries error'))
        }
    })
}