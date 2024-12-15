import {GameContractAddressForm} from "@/components/PlayGame/GameContractAddressForm";

export default function Page() {
    return (
        <div className={"p-3"}>
            <h1 className="text-2xl font-semibold">Play Game</h1>
            <GameContractAddressForm />
        </div>
    )
}