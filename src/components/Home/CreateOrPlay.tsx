import {GameCtaCard} from "@/components/Home/GameCtaCard";

export const CreateOrPlay = () => {
    return (
        <div className={"w-full flex items-center justify-center my-3"}>
            <div className="grid gap-2 text-center lg:max-w-5xl lg:w-full lg:grid-cols-2">
                <GameCtaCard link={"/create-game"} text={"Create New Game"}/>
                <GameCtaCard link={"/play-game"} text={"Play Game"}/>
            </div>
        </div>
    )
}