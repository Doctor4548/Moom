import React from 'react'
import { DeviceSettings, VideoPreview, useCall } from '@stream-io/video-react-sdk'



const MeetingSetUp = ({setIsSetUpComplete}: {setIsSetUpComplete: (value: boolean) => void}) => {
    const [isMicCamOn, setIsMicCamOn] = React.useState(false);

    const call = useCall();

    if (!call) {
        throw new Error('user call must be within StreamCall Component')
    }

    React.useEffect(() => {
        if (isMicCamOn) {
            call?.camera.disable();
            call?.microphone.disable();
        } else {
            call?.camera.enable();
            call?.microphone.enable();
        }
    }, [isMicCamOn, call?.camera, call?.microphone])

    return (
        <section className='w-full h-screen flex flex-col gap-4 items-center text-white'>
            <h2 className='text-2xl font-bold'>Setup</h2>
            <VideoPreview className='sm:w-1/2 w-full' />
            <div className='flex'>
                <input type='checkbox' checked={isMicCamOn} onChange={(e) => { setIsMicCamOn(e.target.checked) }} />
                <span>Join with mic and camera off</span>
            </div>
            <DeviceSettings />
            <button className='bg-green-500 py-2 px-4 rounded-xl m-0' onClick={()=>{call.join(); setIsSetUpComplete(true)}}>Join meeting</button>

        </section>
    )
}

export default MeetingSetUp