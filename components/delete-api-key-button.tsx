'use client'

import * as React from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { IconSpinner } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import Swal from 'sweetalert2';

interface DeleteApiKeyButtonProps extends ButtonProps {
  text?: string;
}

export function DeleteApiKeyButton({
  text = 'DELETE KEY',
  className,
  ...props
}: DeleteApiKeyButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const css = `
      :root {
        --swal-bg-color: #fff; /* Light mode background */
        --swal-text-color: #000; /* Light mode text */
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --swal-bg-color: #333; /* Dark mode background */
          --swal-text-color: #fff; /* Dark mode text */
        }
      }
      .swal2-popup {
        background-color: var(--swal-bg-color) !important;
        color: var(--swal-text-color) !important;
      }
      .swal2-title {
        color: var(--swal-text-color) !important;
      }
      .swal2-content {
        color: var(--swal-text-color) !important;
      }
    `;
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');

    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);

    return () => {
      head.removeChild(style);
    };
  }, []);

  function deleteApiKey(key: string) {
    localStorage.removeItem('ai-token');
    Swal.fire('Done!', 'You deleted your API Key from local storage', 'success');
  }

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => {
          setIsLoading(true);
          deleteApiKey('');
          setIsLoading(false);
        }}
        disabled={isLoading}
        className={cn('flex', className)}
        {...props}
      >
        {isLoading ? <IconSpinner className="mr-2 animate-spin" /> : null}
        {text}
      </Button>
    </>
  );
}
