import Link from "next/link";

const Navbar = (props) => {
    const {selected} = props;
     return (

        <ul className="flex p-2 border bg-indigo-500 font-bold w-full">
            <li className="mr-6">
                <Link href="/Score">
                    {selected === "/Score" ? (
                        <a className="text-white bg-indigo-800 p-2" >Score</a>
                    ) : (
                        <a className="text-gray-200 hover:text-white hover:bg-indigo-800 p-2" >Score</a>
                    )}
                </Link>
            </li>
            <li className="mr-6">
                <Link href="/Train">
                    {selected === "/Train" ? (
                        <a className="text-white bg-indigo-800 p-2" >Train</a>
                    ) : (
                        <a className="text-gray-200 hover:text-white hover:bg-indigo-800 p-2" >Train</a>
                        )}
                </Link>
            </li>
            <li className="mr-6">
                <Link href="/">
                    {selected === "/" ? (
                        <a className="text-white bg-indigo-800 p-2" >Settings</a>
                    ) : (
                        <a className="text-gray-200 hover:text-white hover:bg-indigo-800 p-2" >Settings</a>
                    )}
                </Link>
            </li>
        </ul>

    );
};

export default Navbar;