import { notFound } from 'next/navigation'
import { getSongBySlug } from '@/app/actions'

export default async function SongPage({ params }: { params: { slug: string } }) {

    console.log('Getting song ' + params.slug);

    const song = await getSongBySlug(params.slug)

    if (!song) {
        notFound()
    }

    return (
        <div className="container mx-auto py-4 min-h-screen">
            <h1 className="text-3xl font-bold">{song.name}</h1>
            <h2 className="text-xl text-gray-500">{song.artist}</h2>
        </div>
    )

}