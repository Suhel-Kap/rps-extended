import {
    Address,
    createPublicClient,
    parseEther,
    WalletClient,
    WriteContractParameters,
    SimulateContractReturnType
} from "viem";
import {RSPLS_CONSTRUCTOR_BYTECODE, RSPLS_RUNTIME_BYTECODE} from "@/contracts/bytecode";
import {rpslsAbi} from "@/contracts/RPS.abi";
import {sepolia} from "wagmi/chains";
import {ETH_SEPOLLIA_RPC} from "@/utils/env";
import {http} from "wagmi";
import {ContractState} from "@/utils/types";

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

const simulatePlayGame = async (contractAddress: Address, player: Address, move: number) => {
    const stake = await getContractStake(contractAddress);

    return await publicClient.simulateContract({
        address: contractAddress,
        abi: rpslsAbi,
        functionName: 'play',
        args: [move],
        account: player,
        value: stake
    });
}

const playGame = async (walletClient: WalletClient, simulateContractResult: SimulateContractReturnType) => {
    const hash = await walletClient.writeContract(simulateContractResult.request as WriteContractParameters);

    await publicClient.waitForTransactionReceipt({hash})
    return hash;
}

const simulateSolveGame = async (contractAddress: Address, player: Address, move: number, salt: string) => {
    return await publicClient.simulateContract({
        address: contractAddress,
        abi: rpslsAbi,
        functionName: 'solve',
        args: [move, BigInt(salt)],
        account: player
    });
}

const solveGame = async (walletClient: WalletClient, simulateContractResult: SimulateContractReturnType) => {
    const hash = await walletClient.writeContract(simulateContractResult.request as WriteContractParameters);

    await publicClient.waitForTransactionReceipt({hash})
    return hash;
}

const simulateJ1Timeout = async (contractAddress: Address, player: Address) => {
    return await publicClient.simulateContract({
        address: contractAddress,
        abi: rpslsAbi,
        functionName: 'j1Timeout',
        account: player
    });
}

const j1Timeout = async (walletClient: WalletClient, simulateContractResult: SimulateContractReturnType) => {
    const hash = await walletClient.writeContract(simulateContractResult.request as WriteContractParameters);

    await publicClient.waitForTransactionReceipt({hash})
    return hash;
}

const simulateJ2Timeout = async (contractAddress: Address, player: Address) => {
    return await publicClient.simulateContract({
        address: contractAddress,
        abi: rpslsAbi,
        functionName: 'j2Timeout',
        account: player
    });
}

const j2Timeout = async (walletClient: WalletClient, simulateContractResult: SimulateContractReturnType) => {
    const hash = await walletClient.writeContract(simulateContractResult.request as WriteContractParameters);

    await publicClient.waitForTransactionReceipt({hash})
    return hash;
}

const getContractByteCode = async (address: Address) => {
    return await publicClient.getCode({
        address
    })
}

const isContractRpsls = async (address: Address) => {
    const code = await getContractByteCode(address);
    return code === RSPLS_RUNTIME_BYTECODE;
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
        c1Hash: results[0].status === 'success' ? results[0].result : null,
        c2: results[1].status === 'success' ? results[1].result : null,
        j1: results[2].status === 'success' ? results[2].result : null,
        j2: results[3].status === 'success' ? results[3].result : null,
        lastAction: results[4].status === 'success' ? results[4].result : null,
        stake: results[5].status === 'success' ? results[5].result : null,
        TIMEOUT: results[6].status === 'success' ? results[6].result : null,
    } as ContractState;
}

const getContractStake = async (address: Address) => {
    return await publicClient.readContract({
        address,
        abi: rpslsAbi,
        functionName: 'stake'
    })
}

const getCurrentBlockTimestamp = async () => {
    return await publicClient.getBlock().then(block => block.timestamp)
}

export {
    createGame,
    getContractByteCode,
    getContractState,
    isContractRpsls,
    getCurrentBlockTimestamp,
    simulatePlayGame,
    playGame,
    simulateSolveGame,
    solveGame,
    simulateJ1Timeout,
    j1Timeout,
    simulateJ2Timeout,
    j2Timeout,
}
