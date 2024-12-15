import type {Metadata} from "next";
import "./globals.css";
import {Web3Provider} from "@/providers/Web3Provider";
import {Header} from "@/components/Header";

export const metadata: Metadata = {
    title: "Rock Paper Scissor Lizard Spock",
    description: "A simple Rock Paper Scissor Lizard Spock game on-chain",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
            <Web3Provider>
                <Header />
                {children}
            </Web3Provider>
        </body>
        </html>
    );
}
