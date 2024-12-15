'use client'

import {useEffect, useState} from 'react';
import {Address, isAddress} from 'viem';
import {isContractRpsls, getCurrentBlockTimestamp} from '@/lib/contract';
import {Move} from '@/utils/types';
import {useAccount} from "wagmi";
import {useGetContractState} from "@/hooks/useGetContractState";
import {useGetGameState, useSetGameState} from "@/hooks/gameState";
import {Player2Move} from "@/components/PlayGame/Player2Move";
import {Player1Withdraw} from "@/components/PlayGame/Player1Withdraw";
import {Player1SolveGame} from "@/components/PlayGame/Player1SolveGame";
import {Player2Withdraw} from "@/components/PlayGame/Player2Withdraw";
import {ConnectWalletToPlay} from "@/components/ConnectWalletToPlay";

export const PlayGameForm = () => {
    const [address, setAddress] = useState<Address | undefined>();
    const [isRpsContract, setIsRpsContract] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [timer, setTimer] = useState<number>(0);

    const {address: currentPlayerAddress, isConnected} = useAccount();
    const {
        data: contractState,
        refetch: fetchContractState,
        isFetching: isContractStateFetching,
        isLoading: isContractStateLoading
    } = useGetContractState(address);

    const {data: gameState} = useGetGameState();
    const {mutate: setGameState} = useSetGameState();

    const handleFetchGame = async () => {
        if (!address || !isAddress(address)) {
            setError('Invalid address');
            return;
        }
        const isRps = await isContractRpsls(address);
        setIsRpsContract(isRps);
        fetchContractState();
    }

    useEffect(() => {
        if (gameState) {
            setAddress(gameState.contractAddress)
        }
    }, [gameState]);

    useEffect(() => {
        if (contractState) {
            setGameState({
                ...gameState,
                contractAddress: address!,
                player1: contractState.j1!,
                player2: contractState.j2!,
                player2Move: Move[contractState?.c2 || 0] as unknown as Move,
            })

            getCurrentBlockTimestamp().then((timestamp) => {
                const timeLeft = contractState.lastAction! + contractState.TIMEOUT! - timestamp;
                setTimer(parseInt(timeLeft.toString()));
            })
        }
    }, [contractState]);


    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    if (!isConnected) {
        return (<ConnectWalletToPlay/>)
    }

    return (
        <div className="max-w-md mx-auto p-4 bg-white border border-gray-600 rounded-lg shadow-md mt-4">
            <h2 className="text-2xl font-bold mb-4 text-black">Play Game</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {!isRpsContract ? (
                <div>
                    <label className="block text-gray-700">Contract Address</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value as Address)}
                        className="w-full px-3 py-2 border rounded-lg text-black placeholder:text-gray-500"
                    />
                    <button
                        onClick={handleFetchGame}
                        disabled={isContractStateFetching || isContractStateLoading}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mt-4"
                    >
                        Fetch Game
                    </button>
                </div>
            ) : (
                <div>
                    {timer > 0 ? (
                        <p>Time left: {
                            Math.floor(timer / 60).toString().padStart(2, '0') + ':' + (timer % 60).toString().padStart(2, '0')
                        }</p>
                    ) : (
                        <p>Time is up!</p>
                    )}

                    {contractState?.j2 === currentPlayerAddress && (
                        <div>
                            {
                                // eslint-disable-next-line
                                contractState?.stake! > BigInt(0) ? (
                                    contractState?.c2 === Move.Null ? (
                                        <Player2Move address={address!}/>
                                    ) : (
                                        <Player2Withdraw timer={timer}/>
                                    )) : (
                                    <p>Game has ended</p>
                                )}
                        </div>
                    )}
                    {contractState?.j1 === currentPlayerAddress && (
                        <div>
                            {
                                // eslint-disable-next-line
                                contractState?.stake! > BigInt(0) ? (
                                    contractState?.c2 === Move.Null ? (
                                        <Player1Withdraw/>
                                    ) : (
                                        <Player1SolveGame/>
                                    )) : (
                                    <p>Game has ended</p>
                                )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};