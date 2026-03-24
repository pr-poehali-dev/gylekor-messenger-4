export interface User {
  id: string;
  name: string;
  username: string;
  phone: string;
  email: string;
  avatar?: string;
  bio?: string;
  isOnline?: boolean;
}

export interface AppState {
  isAuthenticated: boolean;
  currentUser: User | null;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'voice' | 'system';
  fileName?: string;
  fileSize?: string;
  read?: boolean;
  emoji?: string;
  reactions?: { emoji: string; count: number }[];
}

export interface Chat {
  id: string;
  type: 'private' | 'group' | 'channel' | 'bot';
  name: string;
  username?: string;
  avatar?: string;
  lastMessage?: string;
  lastTime?: string;
  unreadCount?: number;
  isOnline?: boolean;
  members?: number;
  isPinned?: boolean;
  isSystem?: boolean;
  description?: string;
  messages: Message[];
}

export type ActiveSection = 'chats' | 'calls' | 'contacts' | 'settings';
export type CallType = 'audio' | 'video' | null;
