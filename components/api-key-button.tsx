'use client'

import * as React from 'react'

import { Button, type ButtonProps } from '@/components/ui/button'
import { IconSpinner } from '@/components/ui/icons'
import { cn, validateApiKey } from '@/lib/utils'
import Link from 'next/link'
import Swal from 'sweetalert2'

interface ApiKeyButtonProps extends ButtonProps {
  text?: string
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
    if (validateApiKey(key)) {
      localStorage.setItem('ai-token', key)
      const apiKey = localStorage.getItem('ai-token')
      Swal.fire('Done!', 'Open AI API Key Successfully Embedded!', 'success')

      return apiKey
    } else {
      Swal.fire(
        'Invalid API KEY',
        'Please provide a valid OPEN AI API KEY!',
        'error'
      )

      return null
    }
  }

  const isValidApiKey = validateApiKey(apiKey)

  return (
    <>
      {isValidApiKey ? (
        <Link href="/">
          <Button
            variant="secondary"
            onClick={() => {
              setIsLoading(true)
              embedApiKey(apiKey)
              setIsLoading(false)
            }}
            disabled={isLoading}
            className={cn('flex', className)}
            {...props}
          >
            {isLoading ? <IconSpinner className="mr-2 animate-spin" /> : null}
            {text}
          </Button>
        </Link>
      ) : (
        <Button
          variant="secondary"
          onClick={() => {
            setIsLoading(true)
            embedApiKey(apiKey)
            setIsLoading(false)
          }}
          disabled={isLoading}
          className={cn('flex', className)}
          {...props}
        >
          {isLoading ? <IconSpinner className="mr-2 animate-spin" /> : null}
          {text}
        </Button>
      )}
    </>
  )
}
