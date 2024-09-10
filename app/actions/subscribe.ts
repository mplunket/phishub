// app/actions/subscribe.ts
'use server'

import { createClient } from "@/utils/supabase/server"
import { createResendClient } from "@/utils/resend/client";

// Initialize Supabase client
const supabase = createClient()

// Initialize Resend client
const resend = createResendClient()

export interface FormState {
  success: boolean;
  message: string;
}

export async function subscribeToWaitlist(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const email = formData.get('email') as string
  const utmSource = formData.get('utm_source') as string
  const utmMedium = formData.get('utm_medium') as string
  const utmCampaign = formData.get('utm_campaign') as string

  try {
    // Store email and UTM parameters in Supabase
    const { error } = await supabase
      .from('waitlist')
      .insert({ email, utm_source: utmSource, utm_medium: utmMedium, utm_campaign: utmCampaign })

    if (error) throw error

    // Add email to Resend Audience
    await resend.contacts.create({ 
      email, 
      audienceId: process.env.NEXT_PUBLIC_RESEND_AUDIENCE_ID!,
    })

    return { success: true, message: 'Thanks for joining the waitlist!' }
  } catch (error) {
    console.error('Error:', error)
    return { success: false, message: 'An error occurred. Please try again.' }
  }
}