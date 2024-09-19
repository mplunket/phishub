'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Search } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import SearchCommand from '@/components/SearchCommand'
import LogoutButton from '@/components/LogoutButton'

const navItems = [
    { href: '/songs', label: 'Songs' },
    { href: '/setlists', label: 'Setlists' },
    { href: '/create', label: 'Create' },
]

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    return (
        <nav>
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
                {navItems.map((item) => (
                    <Link key={item.href} href={item.href} className="hover:text-blue-200">
                        {item.label}
                    </Link>
                ))}
                <SearchCommand>
                    <button aria-label="Toggle search">
                        <Search size={24} className="hover:text-blue-200" />
                    </button>
                </SearchCommand>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
                <button onClick={toggleMenu} aria-label="Toggle menu">
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                {isMenuOpen && (
                    <div className="absolute left-0 right-0 pt-2 mt-2 bg-primary z-10  drop-shadow-lg">
                        <Separator className="bg-white/25" />
                        <div className="flex flex-col text-center">
                            {navItems.map((item) => (
                                <>
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="block hover:bg-sky-500 py-4"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                    <Separator key={item.href} className="bg-white/25" />
                                </>
                            ))}
                            <div className="mx-auto p-4">
                                <LogoutButton />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}