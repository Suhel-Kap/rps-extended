import {useMutation, useQueryClient} from "@tanstack/react-query";
import {CreateGameType, GameState, Move} from "@/utils/types";
import {useWalletClient} from "wagmi";
import {createMoveHash} from "@/utils/createMoveHash";
import {
    createGame,
    j1Timeout, j2Timeout,
    playGame,
    simulateJ1Timeout, simulateJ2Timeout,
    simulatePlayGame,
    simulateSolveGame,
    solveGame
} from "@/lib/contract";
import {GAME_STATE_KEY} from "@/utils/const";
import {SimulateContractReturnType} from "viem";

export const useCreateGame = () => {
    const {data: signer} = useWalletClient()
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['createGame'],
        mutationFn: async ({player2, move, salt, stake}: CreateGameType) => {
            const moveHash = createMoveHash(move!, salt)
            const contractAddress = await createGame(signer!, moveHash, stake, player2!)
            return {
                contractAddress,
                player1: signer!.account.address,
                player2,
                player1Move: move,
                salt,
                stake,
            } as GameState
        },
        onSuccess: data => {
            localStorage.setItem(GAME_STATE_KEY, JSON.stringify(data))
            queryClient.invalidateQueries({queryKey: ['getGameState']}).then(() => console.log('invalidateQueries'), () => console.log('invalidateQueries error'))
        },
        onError: error => {
            console.log('onError', error)
            alert('Failed to create the game. Please try again')
        }
    })
}

export const usePlayer2Move = () => {
    const {data: signer} = useWalletClient()
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['player2Move'],
        mutationFn: async (player2Move: Move) => {
            const localStorageGameState = localStorage.getItem(GAME_STATE_KEY)
            if (!localStorageGameState) return
            const gameState = JSON.parse(localStorageGameState) as GameState
            gameState.player2Move = player2Move

            const simulationResult = await simulatePlayGame(gameState.contractAddress, signer!.account.address, player2Move)
            await playGame(signer!, simulationResult as unknown as SimulateContractReturnType)

            localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState))
            queryClient.invalidateQueries({queryKey: ['getGameState']}).then(() => console.log('invalidateQueries'), () => console.log('invalidateQueries error'))
        },
        onError: error => {
            console.log('onError', error)
            alert('Failed to submit the move. Please try again')
        }
    })
}

export const usePlayer1SolveGame = () => {
    const {data: signer} = useWalletClient()
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['player1SolveGame'],
        mutationFn: async ({move, salt}: { move: Move, salt: string }) => {
            const localStorageGameState = localStorage.getItem(GAME_STATE_KEY)
            if (!localStorageGameState) return
            const gameState = JSON.parse(localStorageGameState) as GameState
            const simulationResult = await simulateSolveGame(gameState.contractAddress, signer!.account.address, move, salt)
            await solveGame(signer!, simulationResult as unknown as SimulateContractReturnType)
        },
        onSuccess: () => {
            localStorage.removeItem(GAME_STATE_KEY)
            queryClient.invalidateQueries({queryKey: ['getContractState', 'getGameState']}).then(() => console.log('invalidateQueries'), () => console.log('invalidateQueries error'))
        },
        onError: error => {
            console.log('onError', error)
            alert('Failed to submit the move. Please try again')
        }
    })
}

export const usePlayer1Timeout = () => {
    const {data: signer} = useWalletClient()

    return useMutation({
        mutationKey: ['player1Timeout'],
        mutationFn: async () => {
            const localStorageGameState = localStorage.getItem(GAME_STATE_KEY)
            if (!localStorageGameState) return
            const gameState = JSON.parse(localStorageGameState) as GameState
            const simulationResult = await simulateJ1Timeout(gameState.contractAddress, signer!.account.address)
            await j1Timeout(signer!, simulationResult as unknown as SimulateContractReturnType)
        },
        onError: error => {
            console.log('onError', error)
            alert('Failed to call the timeout. Please try again after time is up.')
        }
    })
}

export const usePlayer2Timeout = () => {
    const {data: signer} = useWalletClient()

    return useMutation({
        mutationKey: ['player2Timeout'],
        mutationFn: async () => {
            const localStorageGameState = localStorage.getItem(GAME_STATE_KEY)
            if (!localStorageGameState) return
            const gameState = JSON.parse(localStorageGameState) as GameState
            const simulationResult = await simulateJ2Timeout(gameState.contractAddress, signer!.account.address)
            await j2Timeout(signer!, simulationResult as unknown as SimulateContractReturnType)
        },
        onError: error => {
            console.log('onError', error)
            alert('Failed to call the timeout. Please try again after time is up.')
        }
    })
}