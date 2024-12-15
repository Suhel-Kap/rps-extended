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