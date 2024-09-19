import { Metadata } from 'next';
import { getSongs } from '@/app/actions'
import BreadcrumbsLinks from '@/components/Breadcrumbs';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
    title: 'Setlists | Phishub',
    description: 'Create and share your own setlists from our database of Phish tabs, chords, lyrics, lessons, and videos.',
    keywords: 'Phish, setlists, tabs, chords, guitar, lessons, jam band, rock',
    openGraph: {
        title: 'Setlists | Phishub',
        description: 'Create and share your own setlists from our database of Phish tabs, chords, lyrics, lessons, and videos.',
        url: 'https://www.phishub.com',
        siteName: 'Phishub',
        locale: 'en_US',
        type: 'website'
    }
}

export default async function Setlists() {

    const songs = await getSongs()

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Setlists', url: '/setlists' },
    ];

    return (
        <div className="container mx-auto px-4 py-4 min-h-screen">
            <div className="hidden md:block pb-4">
                <BreadcrumbsLinks data={breadcrumbs} />
                <Separator className="mt-3" />
            </div>
            <h1 className="text-3xl font-bold">My Setlists</h1>
        </div>
    )

}