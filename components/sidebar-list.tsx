'use client'
import React, { useState, useEffect } from 'react';
import { getChats, removeChat, shareChat } from '@/app/actions';
import { SidebarActions } from '@/components/sidebar-actions';
import { SidebarItem } from '@/components/sidebar-item';
import { type Chat } from '@/lib/types';

interface SidebarListProps {
  userId?: string;
}

export default function SidebarList({ userId }: SidebarListProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      try {
        const fetchedChats = await getChats(userId);
        setChats(fetchedChats);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchChats();
    }
  }, [userId]);

  if (isLoading) {
    return <div>Loading chats...</div>;
  }

  if (error) {
    return <div>Error fetching chats: {error.message}</div>;
  }

  return (
    <div className="flex-1 overflow-auto">
      {chats.length ? (
        <div className="space-y-2 px-2">
          {chats.map(chat => (
            <SidebarItem key={chat.id} chat={chat}>
              <SidebarActions
                chat={chat}
                removeChat={() => removeChat({ id: chat.id, path: '/path' })} // Ensure you handle these functions correctly
                shareChat={() => shareChat(chat)}
              />
            </SidebarItem>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No chat history</p>
        </div>
      )}
    </div>
  );
};

