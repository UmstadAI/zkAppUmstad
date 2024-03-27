import create from 'zustand';
import { type Chat } from '@/lib/types';
interface ChatState {
  chats: Chat[];
  isLoading: boolean;
  error: Error | null;
  setChats: (chats: Chat[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
}

const useChatStore = create<ChatState>((set) => ({
  chats: [],
  isLoading: false,
  error: null,
  setChats: (chats) => set({ chats }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

export default useChatStore;
