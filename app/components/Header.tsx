import Image from "next/image"
const Header = () => {
    return (
        <nav className="bg-zinc-100 flex w-full sticky top-0 justify-between items-center px-4 py-4 md:px-16">
            <Image src={"intrepid-logo-small.svg"} width={100} height={100} alt="Logo"></Image>
            <h4 className="text-xl font-semibold mb-4 text-center">Smart Travel Scout</h4>
        </nav>
    )
}

export default Header