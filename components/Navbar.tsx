'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils'

import { sidebarLinks } from '@/data';

import { UserButton } from '@clerk/nextjs'

const Navbar = () => {
    const pathName = usePathname();
    return (
        <nav className='p-6 flex justify-between w-full items-center'>
            <Link href='/' className='flex items-center gap-2'>
                <Image src='icons/logo.svg' alt='logo' width={50} height={50} />
                <div className='text-white text-2xl font-bold'>Moom</div>
            </Link>

            <UserButton />


            <div className='sm:hidden'>
                <Sheet>
                    <SheetTrigger>
                        <Image
                            src="/icons/hamburger.svg"
                            width={36}
                            height={36}
                            alt="hamburger icon"
                            className="cursor-pointer"
                        />
                    </SheetTrigger>
                    <SheetContent className='w-full h-full text-white flex flex-col'>
                        <Link href='/' className='flex items-center gap-2 self-center'>
                            <Image src='icons/logo.svg' alt='logo' width={50} height={50} />
                            <div className='text-white text-2xl font-bold'>Moom</div>
                        </Link>

                        <SheetClose asChild>
                            <section className='flex flex-col gap-4'>
                                {sidebarLinks.map((item) => {
                                    return (
                                        <SheetClose asChild key={item.label}>
                                            <Link href={item.route}
                                                className={cn('flex self-start items-center gap-5 w-full p-3 rounded-xl', {
                                                    'bg-blue-1': pathName === item.route || pathName.startsWith(`/${item.route}`)
                                                })}>
                                                <Image src={item.imgURL} width={24} height={24} alt='icon' />
                                                <div className='text-white font-semibold' >{item.label}</div>
                                            </Link>
                                        </SheetClose>
                                    )
                                })}
                            </section>
                        </SheetClose>

                    </SheetContent>

                </Sheet>

            </div>


        </nav>
    )
}

export default Navbar