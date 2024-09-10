import Link from 'next/link'
import Image from 'next/image'
import SearchBar from './SearchBar'
import { Button } from "@/components/ui/button"

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-6 flex items-center justify-between">
                <Link href="/" className="flex items-center">
                    <Image src="/phishub-text-logo.svg" alt="Phishub Logo" width={150} height={50} priority />
                </Link>
                <nav className="flex items-center space-x-4">
                    <Button variant="ghost" asChild>
                        <Link href="/songs">Songs</Link>
                    </Button>
                    <SearchBar />
                </nav>
            </div>
        </header>
    )
}

export default Header