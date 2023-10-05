'use client'

import * as React from 'react'

import { Button, type ButtonProps } from '@/components/ui/button'
import { IconSpinner } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import Link from "next/link";
import Swal from 'sweetalert2'

interface ApiKeyButtonProps extends ButtonProps {
    text?: string,
    apiKey: string
  }

export function ApiKeyButton({ 
    text = 'EMBED OPEN AI API KEY',
    apiKey,
    className,
    ...props
}: ApiKeyButtonProps) {
    const [isLoading, setIsLoading] = React.useState(false)
    function embedApiKey(key: string) {
        localStorage.setItem('ai-token', key)
        const apiKey = localStorage.getItem('openAIApiKey')
        Swal.fire(
            'Done!',
            'Open AI API Key Successfully Embedded!',
            'success'
          )
        return apiKey
    }
    return (
        <>
            <Link href="/">
                <Button
                    variant="outline"
                    onClick={() => {
                        setIsLoading(true)
                        embedApiKey(apiKey)  
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