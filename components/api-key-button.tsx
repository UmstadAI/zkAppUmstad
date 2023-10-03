'use client'

import * as React from 'react'

import { Button, type ButtonProps } from '@/components/ui/button'
import { IconSpinner } from '@/components/ui/icons'
import { cn } from '@/lib/utils'

interface ApiKeyButtonProps extends ButtonProps {
    text?: string,
    apiKey: string
  }

export function ApiKeyButton({ 
    text = 'Embed OPEN AI API KEY',
    apiKey,
    className,
    ...props
}: ApiKeyButtonProps) {
    const [isLoading, setIsLoading] = React.useState(false)
    function embedApiKey(key: string) {
        console.log(key)
    }
    return (
        <>
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
        </>
    )
}