import {ConnectButton} from "@/components/Header/ConnectButton";
import Link from "next/link";

export const Header = () => {
    return (
        <div
            className={"flex flex-row justify-between items-center p-3 border border-x-0 border-t-0 border-b-2 border-gray-200"}>
            <Link href={"/"}>
                <h1 className={"text-2xl font-semibold"}>RCSLS</h1>
            </Link>
            <ConnectButton/>
        </div>
    )
}