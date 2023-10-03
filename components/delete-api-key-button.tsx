'use client'

import * as React from 'react'

import { Button, type ButtonProps } from '@/components/ui/button'
import { IconSpinner } from '@/components/ui/icons'
import { cn } from '@/lib/utils'

interface DeleteApiKeyButtonProps extends ButtonProps {
    text?: string,
  }

export function DeleteApiKeyButton({ 
    text = 'DELETE EMBEDDED OPEN AI API KEY',
    className,
    ...props
}: DeleteApiKeyButtonProps) {
    const [isLoading, setIsLoading] = React.useState(false)
    function deleteApiKey(key: string) {
        console.log(key)
    }
    return (
        <>
            <Button
                variant="outline"
                onClick={() => {
                    setIsLoading(true)
                    deleteApiKey('')  
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