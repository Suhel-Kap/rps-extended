import {Address, createPublicClient, WalletClient, parseEther} from "viem";
import {RSPLS_CONSTRUCTOR_BYTECODE} from "@/contracts/bytecode";
import {rpslsAbi} from "@/contracts/RPS.abi";
import {sepolia} from "wagmi/chains";
import {ETH_SEPOLLIA_RPC} from "@/utils/env";
import {http} from "wagmi";

const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(ETH_SEPOLLIA_RPC),
})

const createGame = async (walletClient: WalletClient, moveHash: string, stake: number, player2: Address) => {
    const hash = await walletClient.deployContract({
        abi: rpslsAbi,
        bytecode: RSPLS_CONSTRUCTOR_BYTECODE,
        args: [moveHash as `0x${string}`, player2],
        value: parseEther(stake.toString()),
        account: walletClient.account!,
        chain: walletClient.chain,
    });

    const receipt = await publicClient.waitForTransactionReceipt({hash})

    return receipt.contractAddress;
}

const getContractByteCode = async (address: Address) => {
    return await publicClient.getCode({
        address
    })
}

const getContractState = async (address: Address) => {
    const contract = {
        address,
        abi: rpslsAbi
    } as const;

    const results = await publicClient.multicall({
        contracts: [
            {
                ...contract,
                functionName: 'c1Hash'
            },
            {
                ...contract,
                functionName: 'c2'
            },
            {
                ...contract,
                functionName: 'j1'
            },
            {
                ...contract,
                functionName: 'j2'
            },
            {
                ...contract,
                functionName: 'lastAction'
            },
            {
                ...contract,
                functionName: 'stake'
            },
            {
                ...contract,
                functionName: 'TIMEOUT'
            },
        ]
    })

    return {
        c1Hash: results[0],
        c2: results[1],
        j1: results[2],
        j2: results[3],
        lastAction: results[4],
        stake: results[5],
        TIMEOUT: results[6]
    }
}

export {
    createGame,
    getContractByteCode,
    getContractState
}
