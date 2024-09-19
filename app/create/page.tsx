import ContentCreationForm from '@/components/ContentCreationForm'
import { getSongs } from '@/app/actions'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Create Content | Phishub',
    description: 'Discover and learn Phish guitar tabs, chords, and video lessons. The ultimate resource for Phish fans and musicians.',
    keywords: 'Phish, tabs, chords, guitar, lessons, jam band, rock',
    openGraph: {
        title: 'Create Content | Phishub',
        description: 'Discover and learn Phish guitar tabs, chords, and video lessons. The ultimate resource for Phish fans and musicians.',
        url: 'https://www.phishub.com',
        siteName: 'Phishub',
        locale: 'en_US',
        type: 'website'
    }
}

export default async function CreateContentPage() {
    const songs = await getSongs()

    return (
        <div className="container mx-auto px-4 py-4 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Create Content</h1>
            <ContentCreationForm initialSongs={songs} />
        </div>
    )
}