import Link from "next/link";

export const GameCtaCard = ({link, text}: { link: string, text: string }) => {
    return (
        <Link
            href={link}
            className="rounded-lg border border-transparent px-5 py-4 border-gray-100 hover:border-gray-300 hover:bg-gray-100">
            <h2 className={"text-2xl"}>{text}</h2>
        </Link>
    )
}