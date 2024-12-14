"use client"
import {Title} from "@mantine/core";
import {ConnectKitButton} from "connectkit";

export const Header = () => {
    if (typeof window !== 'undefined') {
        return (
            <div className={"flex flex-row justify-between items-center p-3 border border-x-0 border-t-0 border-b-2 border-gray-200"}>
                <Title className={"text-2xl font-semibold"} maw={'fit-content'}>RCSLS</Title>
                <ConnectKitButton/>
            </div>
        )
    }
}