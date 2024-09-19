'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { logout } from '@/app/actions'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export default function LogoutButton() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleLogout = async () => {
        setIsLoading(true)
        try {
            await logout()
            router.push('/login') // Redirect to login page after logout
        } catch (error) {
            toast.error('Unable to logout.');
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            onClick={handleLogout}
            disabled={isLoading}
            variant="secondary"
        >
            {isLoading ? 'Logging out...' : 'Logout'}
        </Button>
    )
}
