'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk'
import { useGetCallById } from '@/hooks/useGetCallById'

import MeetingRoom from '@/components/MeetingRoom'
import MeetingSetUp from '@/components/MeetingSetUp'
import Loader from '@/components/Loader'

const MeetingPage = () => {
  const { id } = useParams();
  const { user, isLoaded } = useUser();

  const [isSetUpComlete, setIsSetUpComplete] = React.useState(false);
  const { call, isCallLoading } = useGetCallById(id)

  if(!isLoaded || isCallLoading) return <Loader />

  return (
    <div className='w-full h-screen'>
      <StreamCall call={call}>
        <StreamTheme>
          {
            isSetUpComlete ?
              (<MeetingRoom />)
              :
              (<MeetingSetUp setIsSetUpComplete={setIsSetUpComplete}/>)
          }
        </StreamTheme>
      </StreamCall>

    </div>
  )
}

export default MeetingPage