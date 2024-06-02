import React from 'react'

import Navbar from '@/components/Navbar'
import SideBar from '@/components/SideBar'

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='relative'>
      <Navbar />
      <div className='flex'>
        <SideBar />

        {children}

      </div>

    </main>
  )
}

export default HomeLayout