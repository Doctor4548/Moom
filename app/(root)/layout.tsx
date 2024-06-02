import { StreamVideoProvider } from "@/providers/StreamClientProvider"

const Rootlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <StreamVideoProvider>
        {children}

      </StreamVideoProvider>
    </main>
  )
}

export default Rootlayout