import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image';
import { Montserrat } from 'next/font/google';

import { cn } from '@/lib/utils'
import { auth } from '@/auth'
import { clearChats } from '@/app/actions'
import { Button, buttonVariants } from '@/components/ui/button'
import { Sidebar } from '@/components/sidebar'
import { SidebarList } from '@/components/sidebar-list'
import {
  IconGitHub,
  IconNextChat,
  IconSeparator,
  IconVercel
} from '@/components/ui/icons'
import { SidebarFooter } from '@/components/sidebar-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { ClearHistory } from '@/components/clear-history'
import { UserMenu } from '@/components/user-menu'
import { LoginButton } from '@/components/login-button'
import Logo from '@/assets/logo/logo.svg'

const zen_tokyo_zoo = Montserrat({
  subsets: ['latin'],
  weight: '600',
})

export async function Header() {
  const session = await auth()
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        {session?.user ? (
          <Sidebar>
            <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
              {/* @ts-ignore */}
              <SidebarList userId={session?.user?.id} />
            </React.Suspense>
            <SidebarFooter>
              <ThemeToggle />
              <ClearHistory clearChats={clearChats} />
            </SidebarFooter>
          </Sidebar>
        ) : (
          <Link href="/" target="_blank" rel="nofollow">
            <Image src={Logo} alt='zkApp Umstad' className='h-16 w-16'/>
          </Link>
        )}
        <div className="flex items-center">
          <IconSeparator className="h-6 w-6 text-muted-foreground/50" />
          {session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <Button variant="link" asChild className="-ml-2">
              <Link href="/sign-in?callbackUrl=/">Login</Link>
            </Button>
          )}
        </div>
      </div>
      <div>
        { session?.user ? (
          <div className="hidden items-center justify-center space-x-2 sm:flex">
            <Link href="/" target="_blank" rel="nofollow" className='flex'>
              <Image src={Logo} alt='zkApp Umstad' className='h-16 w-16'/>
              <div className={zen_tokyo_zoo.className}>
                <h5 className='mt-5 hidden text-xl text-[#655bf7] dark:text-[#ffffff] md:flex'>ZKAPPS UMSTAD</h5>
              </div>
            </Link>
          </div>
        ) : ('') }
      </div>
      
      <div className="flex items-center justify-end space-x-2">
        <a
          target="_blank"
          href="https://github.com/UmstadAI"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: 'outline' }))}
        >
          <IconGitHub />
          <span className="ml-2 hidden md:flex">GitHub</span>
        </a>
        <a
          href="https://github.com/UmstadAI/zkAppUmstad/issues"
          target="_blank"
          className={cn(buttonVariants())}
        >
          <span className="hidden sm:block">Report a Bug</span>
        </a>
      </div>
    </header>
  )
}
