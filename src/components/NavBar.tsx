"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavBar = () => {
    const pathname = usePathname();
    const getLinkClass = (path: string) =>
        pathname === path ? 'text-blue-500 font-bold' : 'text-gray-700';

    return (
        <nav className="bg-gray-100 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex space-x-4">
                    <Link href="/" className={`px-3 py-2 rounded ${getLinkClass('/')}`}>
                        Home
                    </Link>
                    <Link href="/leaderboards" className={`px-3 py-2 rounded ${getLinkClass('/leaderboards')}`}>
                        Leaderboards
                    </Link>
                    <Link href="/players" className={`px-3 py-2 rounded ${getLinkClass('/players')}`}>
                        Players
                    </Link>
                    <Link href="/login" className={`px-3 py-2 rounded ${getLinkClass('/login')}`}>
                        Login
                    </Link>
                </div>
                <div>
                    <Link href="/" className="text-lg font-bold text-gray-700">
                        J.B. HUNT PING PONG ELO
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;