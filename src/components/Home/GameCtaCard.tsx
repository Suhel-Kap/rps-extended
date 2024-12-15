import Link from "next/link";

export const GameCtaCard = ({link, text}: { link: string, text: string }) => {
    return (
        <Link
            href={link}
            className="rounded-lg border border-transparent px-5 py-4 border-gray-100 dark:border-gray-800 hover:border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:dark:border-gray-800">
            <h2 className={"text-2xl"}>{text}</h2>
        </Link>
    )
}