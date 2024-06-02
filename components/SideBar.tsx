'use client'
import React from 'react'
import { sidebarLinks } from '@/data'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const SideBar = () => {
    const pathName = usePathname();
    return (
        <section className='sticky left-0 top-0 h-screen w-fit justify-between max-sm:hidden p-6 pt-16 lg:w-[264px]'>
            <div className='flex flex-col flex-1 h-full gap-8 items-center'>
                {sidebarLinks.map((item) => {
                    return (
                        <Link href={item.route} key={item.label}
                            className={cn('flex self-start items-center gap-5 w-full p-3 rounded-xl', {
                                'bg-blue-1': pathName === item.route || pathName.startsWith(`/${item.route}`)
                            })}>
                            <Image src={item.imgURL} width={24} height={24} alt='icon' />
                            <div className='text-white font-bold max-lg:hidden'>{item.label}</div>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}

export default SideBar