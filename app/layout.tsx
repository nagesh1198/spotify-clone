import './globals.css'
import type { Metadata } from 'next'
import Sidebar from '@/components/Sidebar'
import { Figtree } from 'next/font/google'
import SupabaseProvider from '@/providers/SupabaseProvider'
import UserProvider from '@/providers/UserProvider'
import ModelProvider from '@/providers/ModelProvider'
import ToasterProvider from '@/providers/ToasterProvider'
import getSongsById from '@/actions/getSongByUserId'
import Player from '@/components/Player'

const font = Figtree({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Spotify',
  description: 'Listen to music!',
}
export const revalidate=0;
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userSongs=await getSongsById();

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider/>
        <SupabaseProvider>
          <UserProvider>
            <ModelProvider/>
        <Sidebar songs={userSongs}>
        {children}
        </Sidebar>
        <Player/>
        </UserProvider>
        </SupabaseProvider>
        </body>
    </html>
  )
}
