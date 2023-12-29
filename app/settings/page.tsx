import { auth } from '@/auth'
import { notFound, redirect } from 'next/navigation'
import { Settings } from '@/components/settings'

export default async function ChatPage() {
  const session = await auth()

  if (!session?.user) {
    redirect(`/login`)
  }

  return <Settings />
}
