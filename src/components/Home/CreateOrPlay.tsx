import {GameCtaCard} from "@/components/Home/GameCtaCard";

export const CreateOrPlay = () => {
    return (
        <div className={"flex items-center justify-center my-3 max-w-fit mx-auto"}>
            <div className="grid gap-2 text-center lg:grid-cols-2">
                <GameCtaCard link={"/create-game"} text={"Create New Game"}/>
                <GameCtaCard link={"/play-game"} text={"Play Game"}/>
            </div>
        </div>
    )
}