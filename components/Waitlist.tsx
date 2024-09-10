'use client'

import React, { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useFormState, useFormStatus } from 'react-dom'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { toast } from 'sonner'
import { subscribeToWaitlist, FormState } from '@/app/actions/subscribe'

interface UtmParams {
    utm_source: string
    utm_medium: string
    utm_campaign: string
}

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Joining...' : 'Join'}
        </Button>
    )
}

const initialState: FormState = {
    success: false,
    message: '',
}

export default function Waitlist() {
    const [state, formAction] = useFormState(subscribeToWaitlist, initialState)
    const searchParams = useSearchParams()

    useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast.success(state.message)
            } else {
                toast.error(state.message)
            }
        }
    }, [state])

    const getUtmParams = (): UtmParams => ({
        utm_source: searchParams.get('utm_source') || '',
        utm_medium: searchParams.get('utm_medium') || '',
        utm_campaign: searchParams.get('utm_campaign') || '',
    })

    const utmParams = getUtmParams()

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Join the waitlist!</CardTitle>
                <CardDescription>Be notified when Phishub is launched.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    <Input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                    />
                    {Object.entries(utmParams).map(([key, value]) => (
                        <input key={key} type="hidden" name={key} value={value} />
                    ))}
                    <SubmitButton />
                </form>
            </CardContent>
        </Card>
    )
}