import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getSongBySlug } from '@/app/actions'
import BreadcrumbsLinks from '@/components/Breadcrumbs'
import { Separator } from '@/components/ui/separator'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const song = await getSongBySlug(params.slug)

    return {
        title: song.name + ' by ' + song.artist + ' - Guitar tabs, chords, lyrics and video lessons | Phishub',
        description: 'Learn how to play ' + song.name + ' by ' + song.artist + ' with tabs, chords, lyrics, and video lessons.',
        keywords: song.name + ', ' + song.artist + ', Phish, tabs, tablature, chords, charts, guitar, bass, drums, keys, piano, video, lessons, jam band, rock',
        openGraph: {
            title: song.name + ' by ' + song.artist + ' - Guitar tabs, chords, lyrics and video lessons | Phishub',
            description: 'Learn how to play ' + song.name + ' by ' + song.artist + ' with tabs, chords, lyrics, and video lessons.',
            url: 'https://www.phishub.com',
            siteName: 'Phishub',
            locale: 'en_US',
            type: 'website'
        },
    }
}

export default async function SongPage({ params }: { params: { slug: string } }) {

    console.log('Getting song ' + params.slug);

    const song = await getSongBySlug(params.slug)

    if (!song) {
        notFound()
    }

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Songs', url: '/songs' },
        { name: song.name, url: '/songs/' + params.slug },
    ];

    return (

        <div className="container mx-auto px-4 py-4 min-h-screen">
            <div className="hidden md:block pb-4">
                <BreadcrumbsLinks data={breadcrumbs} />
                <Separator className="mt-3" />
            </div>
            <h1 className="text-3xl font-bold">{song.name}</h1>
            <h2 className="text-xl text-gray-500">{song.artist}</h2>
        </div>
    )

}