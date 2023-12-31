import { auth } from '@/auth'
import { LoginButton } from '@/components/login-button'
import { GoogleLoginButton } from '@/components/google-login-button'
import { redirect } from 'next/navigation'
import { Landing } from '@/components/landing'

export default async function SignInPage() {
  const session = await auth()
  // redirect to home if user is already logged in
  if (session?.user) {
    redirect('/')
  }
  return (
    <div>
      <Landing />
      <div className="grid h-[calc(40vh-theme(spacing.32))] items-center justify-center gap-2 px-4 py-8">
        <LoginButton />
        <GoogleLoginButton />
      </div>
    </div>
  )
}
