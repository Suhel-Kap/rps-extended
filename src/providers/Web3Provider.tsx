"use client"

import {createConfig, http, WagmiProvider} from "wagmi";
import {ConnectKitProvider, getDefaultConfig} from "connectkit";
import {sepolia} from "wagmi/chains";
import {ETH_SEPOLLIA_RPC, WALLET_CONNECT_PROJECT_ID} from "@/utils/env";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const config = createConfig(getDefaultConfig({
    chains: [sepolia],
    transports: {
        [sepolia.id]: http(ETH_SEPOLLIA_RPC)
    },
    walletConnectProjectId: WALLET_CONNECT_PROJECT_ID,
    appName: "Rock Paper Scissor Lizard Spock",
}));

const queryClient = new QueryClient();

export const Web3Provider = ({children}: Readonly<{ children: React.ReactNode }>) => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ConnectKitProvider>
                    {children}
                </ConnectKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}