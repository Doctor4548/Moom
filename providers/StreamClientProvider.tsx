'use client'
import {
  StreamVideo,
  StreamVideoClient,
} from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import React from 'react';
import { tokenProvider } from '@/actions/stream.actions';
import Loader from '@/components/Loader';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;


export const StreamVideoProvider = ({ children }: { children: React.ReactNode }) => {
  const [videoClient, setVideoClient] = React.useState<StreamVideoClient>();

  const { user, isLoaded } = useUser()

  React.useEffect(() => {
    if (!user || !isLoaded) return;

    if (!apiKey) throw new Error('apiKey require');

    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: user.id,
        name: user?.username || user.id,
        image: user?.imageUrl
      },
      tokenProvider: tokenProvider
    })
    setVideoClient(client)

  }, [isLoaded, user])

  if (!videoClient) return <Loader />



  return (
    <StreamVideo client={videoClient}>
      {children}
    </StreamVideo>
  );
};