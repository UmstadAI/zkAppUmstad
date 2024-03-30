'use client'

import * as React from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { IconSpinner } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import Swal from 'sweetalert2';
import { swalCustomStyles } from '@/lib/styles/sweetalert2CustomStyles';

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
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
  
    style.type = 'text/css';
    style.appendChild(document.createTextNode(swalCustomStyles));
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
