import Link from 'next/link'
import Navigation from '@/components/Navigation'

export default async function Header() {
    return (
        <header className="bg-primary text-white">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-3xl font-bold">
                        phishub
                    </Link>
                    <Navigation />
                </div>
            </div>
        </header>
    )
}