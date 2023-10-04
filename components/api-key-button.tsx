'use client'

import * as React from 'react'

import { Button, type ButtonProps } from '@/components/ui/button'
import { IconSpinner } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'

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
        localStorage.setItem('openAIApiKey', key)
        const apiKey = localStorage.getItem('openAIApiKey')
        return apiKey
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