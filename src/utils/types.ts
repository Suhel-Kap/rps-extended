import {Address} from "viem";

export enum Move {
    Null,
    Rock,
    Paper,
    Scissors,
    Spock,
    Lizard,
}

export type CreateGameType = {
    player2: Address | null;
    move: Move | null;
    salt: string;
    stake: number;
}

export type ContractState = {
    c1Hash?: string;
    c2?: number;
    stake?: bigint;
    j1?: Address;
    j2?: Address;
    lastAction?: bigint;
    TIMEOUT?: bigint;
}

export type GameState = {
    contractAddress: Address;
    player1: Address;
    player2: Address;
    player1Move?: Move;
    player2Move?: Move;
    salt?: string;
    stake?: number;
}