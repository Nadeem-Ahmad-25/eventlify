'use client'
import { IEvent } from '@/lib/Database/models/event.model'
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import Checkout from './Checkout'

const CheckoutButton = ({event}:{event:IEvent}) => {

    console.log(event)

    const hasEventFinished = new Date(event.endDateTime) < new Date() 
    const {user} = useUser();
    const userId = user?.publicMetadata.userId as string;

  return (
    <div className='flex items-center gap-3'>
        {/* check if tickets are available time wise */}
        {hasEventFinished ? (
            <p className='p-2 text-red-400'>Sorry Event has ended.</p>
        ): <>
            <SignedOut>
                <Button asChild className='button rounded-full' size="lg">
                    <Link href="/sign-in">
                        Get Tickets
                    </Link>
                </Button>
            </SignedOut>

            <SignedIn>
            <Checkout event={event} userId={userId}></Checkout>
            </SignedIn>
        </>}
    </div>
  )
}

export default CheckoutButton
