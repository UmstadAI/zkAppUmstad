'use client'

import * as React from 'react'

import { Button, type ButtonProps } from '@/components/ui/button'
import { IconSpinner } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import Link from "next/link";
import Swal from 'sweetalert2'

interface ReturnChatButtonProps extends ButtonProps {
    text?: string
  }

export function ReturnChatButton({ 
    text = 'RETURN BACK TO CHAT',
    className,
    ...props
}: ReturnChatButtonProps) {
    const [isLoading, setIsLoading] = React.useState(false)
    
    return (
        <>
            <Link href="/">
                <Button
                    variant="secondary"
                    onClick={() => {
                        setIsLoading(true)
                        setIsLoading(false)
                    }}
                    disabled={isLoading}
                    className={cn(
                        'flex',
                        className
                    )}
                    {...props}
                    >
                    {isLoading ? (
                        <IconSpinner className="mr-2 animate-spin" />
                    ) : 
                    null}
                    {text}
                </Button>
            </Link>
        </>
    )
}