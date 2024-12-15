import {keccak256, encodePacked} from "viem"

export const createMoveHash = (move: number, salt: string) => {
    return keccak256(encodePacked(['uint8', 'uint256'],[move, BigInt(salt)]));
}