import { getSongs } from '@/app/actions'
import { Song, columns } from './columns'
import BreadcrumbsLinks from '@/components/Breadcrumbs';
import { Metadata } from 'next';
import { DataTable } from './data-table';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
    title: 'Phishub - Phish Tabs, Chords, and Lessons',
    description: 'Discover and learn Phish guitar tabs, chords, and video lessons. The ultimate resource for Phish fans and musicians.',
    keywords: 'Phish, tabs, chords, guitar, lessons, jam band, rock',
    openGraph: {
        title: 'Phishub - Phish Tabs, Chords, and Lessons',
        description: 'Discover and learn Phish guitar tabs, chords, and video lessons. The ultimate resource for Phish fans and musicians.',
        url: 'https://www.phishub.com',
        siteName: 'Phishub',
        locale: 'en_US',
        type: 'website'
    }
}

export default async function Songs() {

    const songs = await getSongs()

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Songs', url: '/songs' },
    ];

    return (
        <div className="container mx-auto px-4 py-4 min-h-screen">
            <div className="hidden md:block pb-4">
                <BreadcrumbsLinks data={breadcrumbs} />
                <Separator className="mt-3" />
            </div>
            <h1 className="text-3xl font-bold">Songs Phish has played</h1>
            <div className="py-5">
                <DataTable columns={columns} data={songs} />
            </div>
        </div>
    )

}