import { useState } from 'react';
import { Chat, User } from './types';
import { Avatar } from './Sidebar';
import Icon from '@/components/ui/icon';

interface Props {
  chats: Chat[];
  currentUser: User;
  onChatSelect: (chat: Chat) => void;
}

export default function ContactsView({ chats, currentUser, onChatSelect }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'groups' | 'channels' | 'bots'>('all');

  const filtered = chats.filter(c => {
    const matchSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.username && c.username.toLowerCase().includes(searchQuery.toLowerCase()));

    if (activeTab === 'groups') return matchSearch && c.type === 'group';
    if (activeTab === 'channels') return matchSearch && c.type === 'channel';
    if (activeTab === 'bots') return matchSearch && c.type === 'bot';
    return matchSearch;
  });

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--g-bg)' }}>
      {/* Header */}
      <div
        className="px-6 pt-6 pb-4 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--g-border)', background: 'var(--g-bg2)' }}
      >
        <h1 className="text-xl font-bold mb-4" style={{ color: 'var(--g-text)' }}>
          Контакты и поиск
        </h1>
        <div className="relative mb-4">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--g-text-faint)' }} />
          <input
            type="text"
            placeholder="Поиск по имени, @username, телефону..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{
              background: 'var(--g-surface)',
              border: '1px solid var(--g-border)',
              color: 'var(--g-text)',
            }}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'Все' },
            { id: 'groups', label: '👥 Группы' },
            { id: 'channels', label: '📡 Каналы' },
            { id: 'bots', label: '🤖 Боты' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: activeTab === tab.id ? 'var(--g-green)' : 'var(--g-surface)',
                color: activeTab === tab.id ? '#fff' : 'var(--g-text-dim)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto g-scrollbar p-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(61,186,110,0.1)' }}
            >
              <Icon name="Search" size={28} style={{ color: 'var(--g-green)' }} />
            </div>
            <p className="text-base font-medium mb-1" style={{ color: 'var(--g-text)' }}>
              Ничего не найдено
            </p>
            <p className="text-sm" style={{ color: 'var(--g-text-dim)' }}>
              Попробуйте другой запрос
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onChatSelect(chat)}
                className="w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-90 text-left"
                style={{ background: 'var(--g-bg2)', border: '1px solid var(--g-border)' }}
              >
                <div className="relative flex-shrink-0">
                  <Avatar name={chat.name} size={48} />
                  {chat.isOnline && (
                    <div
                      className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2"
                      style={{ background: 'var(--g-green)', borderColor: 'var(--g-bg2)' }}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-semibold text-sm" style={{ color: 'var(--g-text)' }}>
                      {chat.name}
                    </span>
                    {chat.isSystem && (
                      <Icon name="BadgeCheck" size={14} style={{ color: 'var(--g-green)' }} />
                    )}
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full ml-auto"
                      style={{
                        background: chat.type === 'bot' ? 'rgba(61,186,110,0.1)' :
                                   chat.type === 'channel' ? 'rgba(100,150,255,0.1)' :
                                   chat.type === 'group' ? 'rgba(255,180,50,0.1)' : 'rgba(61,186,110,0.1)',
                        color: chat.type === 'bot' ? 'var(--g-green)' :
                               chat.type === 'channel' ? '#6496ff' :
                               chat.type === 'group' ? '#ffb432' : 'var(--g-green)',
                      }}
                    >
                      {chat.type === 'bot' ? '🤖 бот' :
                       chat.type === 'channel' ? '📡 канал' :
                       chat.type === 'group' ? '👥 группа' : '💬 личный'}
                    </span>
                  </div>
                  {chat.username && (
                    <p className="text-xs mb-0.5" style={{ color: 'var(--g-green)' }}>
                      @{chat.username}
                    </p>
                  )}
                  {chat.description && (
                    <p className="text-xs truncate" style={{ color: 'var(--g-text-dim)' }}>
                      {chat.description}
                    </p>
                  )}
                </div>

                <Icon name="ChevronRight" size={16} style={{ color: 'var(--g-text-faint)', flexShrink: 0 }} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
