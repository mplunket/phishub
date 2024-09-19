import Link from 'next/link'
import { Menu, Search } from 'lucide-react'
import SearchCommand from '@/components/SearchCommand'
import LogoutButton from '@/components/LogoutButton'
import { createClient } from '@/utils/supabase/server'

export default async function Header() {

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <header className="bg-primary text-white">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-3xl font-bold">
                        phishhub
                    </Link>
                    <div className="flex items-center space-x-4 md:hidden">
                        <SearchCommand>
                            <button aria-label="Toggle search">
                                <Search className="hover:text-blue-200" size={24} />
                            </button>
                        </SearchCommand>
                        <button aria-label="Toggle menu">
                            <Menu size={24} />
                        </button>
                    </div>
                    <nav className="hidden items-center md:flex space-x-4">
                        <SearchCommand>
                            <button aria-label="Toggle search">
                                <Search className="hover:text-blue-200" size={24} />
                            </button>
                        </SearchCommand>
                        <Link href="/songs" className="hover:text-blue-200">Songs</Link>
                        <Link href="/setlists" className="hover:text-blue-200">Setlists</Link>
                        <Link href="/create" className="hover:text-blue-200">Create</Link>
                        {user && <LogoutButton />}
                    </nav>
                </div>
            </div>
        </header>
    )
}