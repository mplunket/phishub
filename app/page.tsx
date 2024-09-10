'use client'

import Waitlist from '@/components/Waitlist'
import { Suspense } from 'react'

export default function LandingPage() {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-200 via-gray-200 to-gray-200 opacity-70 blur-[60px] scale-150 animate-pulse"></div>
      </div>
      <div className="relative z-10">
        <h1 className="text-7xl md:text-8xl font-black m-2 text-primary text-center">phishub</h1>
        <h2 className="text-lg my-4">#1 Site for Phish Guitar Tabs and Video Lessons</h2>
        <div className="my-8"></div>
        <Suspense fallback={<div>Loading...</div>}>
          <Waitlist />
        </Suspense>
      </div>
    </div>
  )
}