import {CreateOrPlay} from "@/components/Home/CreateOrPlay";
import {Rules} from "../components/Home/Rules";
import {HowToPlay} from "../components/Home/HowToPlay";

export default function Home() {
    return (
        <div>
            <CreateOrPlay/>
            <div className={"grid grid-cols-2 max-w-fit mx-auto"}>
                <Rules />
                <HowToPlay />
            </div>
        </div>
    );
}
