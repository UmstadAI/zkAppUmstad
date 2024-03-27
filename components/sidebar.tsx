'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { IconPlus, IconSidebar } from '@/components/ui/icons'
import { buttonVariants } from '@/components/ui/button' 
import { cn } from '@/lib/utils'


export interface SidebarProps {
  children?: React.ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  const router = useRouter() 

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="-ml-2 h-9 w-9 p-0">
          <IconSidebar className="h-6 w-6" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="inset-y-0 flex h-auto w-[300px] flex-col p-0">
        <SheetHeader className="p-4">
          <SheetTitle className="text-sm">Chat History</SheetTitle>
          <button
            onClick={e => {
              e.preventDefault()
              router.push('/')
            }}
            className={cn(
              buttonVariants({ size: 'sm', variant: 'outline' }),
              'group flex w-full items-center py-4 pl-8 pr-16 text-left'
            )}
          >
            <IconPlus className="mr-2" />
            <span>New Chat</span>
          </button>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  )
}
