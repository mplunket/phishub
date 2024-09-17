import Waitlist from '@/components/Waitlist'
import { Suspense } from 'react'

export default function LandingPage() {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-7xl md:text-8xl font-black m-2 text-primary text-center">phishub</h1>
      <h2 className="my-4 text-center">#1 Site for Phish Guitar Tabs and Video Lessons</h2>
      <div className="my-8"></div>
      <Suspense fallback={<div>Loading...</div>}>
        <Waitlist />
      </Suspense>
    </div>
  )
}