 import React from 'react'
 import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import Image from 'next/image'
import { Separator } from "@/components/ui/separator"
import Navitems from './Navitems'

  
 
 const MobileNav = () => { 
   return (
     <nav className='md:hidden'>
        <Sheet>
            <SheetTrigger className='align-middle'>
                <Image src="/assets/icons/menu.svg" alt="menu" width={24} height={24} className='cursor-pointer'></Image>
            </SheetTrigger>
            <SheetContent className='flex flex-col gap-6 bg-white md:hidden'>
                <Image src="/assets/images/logo.svg" alt="eventlify logo" width={120} height={38} />
                <Separator className='border border-grey-50'/>
                    <Navitems></Navitems>
            </SheetContent>
        </Sheet>
     </nav>
   )
 }
 
 export default MobileNav
 