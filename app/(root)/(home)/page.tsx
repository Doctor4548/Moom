'use client'
import React from 'react'
import { cn } from "@/lib/utils"
import Image from "next/image";
import MeetingModal from '@/components/HomeModal';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from '@/components/ui/textarea';
import ReactDatePicker from 'react-datepicker';
import { Input } from '@/components/ui/input';

interface HomeCardProps {
  className?: string;
  img: string;
  title: string;
  description: string;
  handleClick?: () => void;
}

const HomeCard = ({ className, img, title, description, handleClick }: HomeCardProps) => {
  return (
    <section
      className={cn(
        'bg-orange-1 px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer',
        className
      )}
      onClick={handleClick}
    >
      <div className="flex-center glassmorphism size-12 rounded-[10px]">
        <Image src={img} alt="meeting" width={27} height={27} />
      </div>
      
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-lg font-normal">{description}</p>
      </div>
    </section>
  );
};

const page = () => {
  const now = new Date();
  const router = useRouter();
  const { toast } = useToast()

  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const date = (new Intl.DateTimeFormat('en-US', { dateStyle: 'full' })).format(now);

  const [meetingState, setMeetingState] = React.useState<
    'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined
  >(undefined);

  const { user } = useUser();
  const client = useStreamVideoClient();
  const [values, setValues] = React.useState({
    dateTime: new Date(),
    description: '',
    link: ''
  })

  const [callDetail, setCallDetails] = React.useState<Call>();
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`;


  const createMeeting = async () => {
    if (!client || !user) return;
    try {
      if (!values.dateTime) {
        toast({
          title: "Please select date and time",
        })
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call('default', id);

      if (!call) throw new Error('Failed to create meeting');

      const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Instant Meeting';
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });
      setCallDetails(call);
      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }

      toast({
        title: "Meeting created",
      })
    } catch (err) {
      console.error(err);
      toast({
        title: "Fail to create an meeting",
      })
    }
  }


  return (
    <main className='text-white w-full'>
      <section className='bg-hero bg-cover w-full h-[303px]'>
        <div className='flex flex-col justify-between p-5 h-full'>
          <div className='bg-gray-600 text-lg font-semibold max-w-[303px] py-1 px-4'>Upcoming meeting at 12:30</div>

          <div className='p-2 w-full'>
            <h1 className='text-5xl font-bold'>{time}</h1>
            <div className=''>{date}</div>
          </div>
        </div>
      </section>

      <div className='grid max-sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mt-3'>
        <HomeCard
          img="/icons/add-meeting.svg"
          title="New Meeting"
          description="Start an instant meeting"
          handleClick={() => setMeetingState('isInstantMeeting')}
        />
        <HomeCard
          img="/icons/join-meeting.svg"
          title="Join Meeting"
          description="via invitation link"
          className="bg-blue-1"
          handleClick={() => setMeetingState('isJoiningMeeting')}
        />
        <HomeCard
          img="/icons/schedule.svg"
          title="Schedule Meeting"
          description="Plan your meeting"
          className="bg-purple-1"
          handleClick={() => setMeetingState('isScheduleMeeting')}
        />
        <HomeCard
          img="/icons/recordings.svg"
          title="View Recordings"
          description="Meeting Recordings"
          className="bg-yellow-1"
          handleClick={() => router.push('/recordings')}
        />
      </div>
      {!callDetail ? (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Create Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Add a description
            </label>
            <Textarea
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Select Date and Time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Meeting Created"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: 'Link Copied' });
          }}
          image={'/icons/checked.svg'}
          buttonIcon="/icons/copy.svg"
          className="text-center"
          buttonText="Copy Meeting Link"
        />
      )}

      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Type the link here"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="Meeting link"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </MeetingModal>

      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />





    </main>
  )
}

export default page