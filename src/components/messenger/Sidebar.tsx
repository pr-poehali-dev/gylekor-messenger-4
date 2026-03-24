import { useState } from 'react';
import { Chat, User, ActiveSection } from './types';
import Icon from '@/components/ui/icon';

interface Props {
  chats: Chat[];
  currentUser: User;
  activeChat: Chat | null;
  section: ActiveSection;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSectionChange: (s: ActiveSection) => void;
  onChatSelect: (chat: Chat) => void;
  onCreateGroup: (name: string, type: 'group' | 'channel') => void;
  showCreateGroup: boolean;
  setShowCreateGroup: (v: boolean) => void;
}

function Avatar({ name, size = 40, green = false, avatar }: { name: string; size?: number; green?: boolean; avatar?: string }) {
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const colors = ['#3dba6e', '#2d9456', '#27855a', '#1e7a4f', '#158044'];
  const color = colors[name.charCodeAt(0) % colors.length];
  if (avatar) return <img src={avatar} className="rounded-full object-cover" style={{ width: size, height: size }} />;
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0 font-semibold"
      style={{ width: size, height: size, background: green ? 'var(--g-green)' : color, fontSize: size * 0.38, color: '#fff' }}
    >
      {initials}
    </div>
  );
}

export { Avatar };

export default function Sidebar({
  chats, currentUser, activeChat, section,
  searchQuery, onSearchChange, onSectionChange,
  onChatSelect, onCreateGroup, showCreateGroup, setShowCreateGroup
}: Props) {
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupType, setNewGroupType] = useState<'group' | 'channel'>('group');
  const [showMenu, setShowMenu] = useState(false);

  const filtered = chats.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.username && c.username.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatTime = (chat: Chat) => chat.lastTime || '';

  return (
    <div
      className="flex h-full"
      style={{ width: 340, minWidth: 280, borderRight: '1px solid var(--g-border)' }}
    >
      {/* Nav rail */}
      <div
        className="flex flex-col items-center py-4 gap-1"
        style={{ width: 56, background: 'var(--g-bg2)', borderRight: '1px solid var(--g-border)' }}
      >
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-all hover:opacity-80"
          style={{ background: 'var(--g-green)' }}
        >
          <svg width="20" height="20" viewBox="0 0 44 44" fill="none">
            <path d="M22 4C12.059 4 4 12.059 4 22C4 25.978 5.278 29.665 7.445 32.667L4.5 40L12.333 37.222C15.224 38.987 18.485 40 22 40C31.941 40 40 31.941 40 22C40 12.059 31.941 4 22 4Z" fill="white" fillOpacity="0.95"/>
            <circle cx="15" cy="22" r="2.5" fill="#3dba6e"/>
            <circle cx="22" cy="22" r="2.5" fill="#3dba6e"/>
            <circle cx="29" cy="22" r="2.5" fill="#3dba6e"/>
          </svg>
        </button>

        {[
          { id: 'chats', icon: 'MessageCircle', label: 'Чаты' },
          { id: 'contacts', icon: 'Users', label: 'Контакты' },
          { id: 'settings', icon: 'Settings', label: 'Настройки' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id as ActiveSection)}
            title={item.label}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-80 relative"
            style={{
              background: section === item.id ? 'rgba(61,186,110,0.15)' : 'transparent',
              color: section === item.id ? 'var(--g-green)' : 'var(--g-text-dim)',
            }}
          >
            <Icon name={item.icon} size={18} />
          </button>
        ))}

        <div className="flex-1" />
        <div className="relative">
          <Avatar name={currentUser.name} size={32} />
          <div
            className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
            style={{ background: 'var(--g-green)', borderColor: 'var(--g-bg2)' }}
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: 'var(--g-bg2)' }}>
        {/* Header */}
        <div className="px-3 pt-3 pb-2">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-base" style={{ color: 'var(--g-text)' }}>
              {section === 'chats' ? 'Сообщения' : section === 'contacts' ? 'Контакты' : 'Настройки'}
            </span>
            {section === 'chats' && (
              <button
                onClick={() => setShowCreateGroup(true)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
                style={{ background: 'rgba(61,186,110,0.15)', color: 'var(--g-green)' }}
              >
                <Icon name="Plus" size={16} />
              </button>
            )}
          </div>

          {section === 'chats' && (
            <div className="relative">
              <Icon
                name="Search"
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--g-text-faint)' }}
              />
              <input
                type="text"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  background: 'var(--g-surface)',
                  border: '1px solid var(--g-border)',
                  color: 'var(--g-text)',
                }}
              />
            </div>
          )}
        </div>

        {/* Create group modal */}
        {showCreateGroup && (
          <div
            className="mx-3 mb-3 rounded-xl p-3 animate-scale-in"
            style={{ background: 'var(--g-surface)', border: '1px solid var(--g-border)' }}
          >
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--g-text-dim)' }}>Создать</p>
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setNewGroupType('group')}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: newGroupType === 'group' ? 'var(--g-green)' : 'var(--g-bg3)',
                  color: newGroupType === 'group' ? '#fff' : 'var(--g-text-dim)',
                }}
              >
                👥 Группа
              </button>
              <button
                onClick={() => setNewGroupType('channel')}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: newGroupType === 'channel' ? 'var(--g-green)' : 'var(--g-bg3)',
                  color: newGroupType === 'channel' ? '#fff' : 'var(--g-text-dim)',
                }}
              >
                📡 Канал
              </button>
            </div>
            <input
              type="text"
              placeholder={newGroupType === 'group' ? 'Название группы' : 'Название канала'}
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none mb-2"
              style={{
                background: 'var(--g-bg3)',
                border: '1px solid var(--g-border)',
                color: 'var(--g-text)',
              }}
              autoFocus
            />
            <p className="text-xs mb-2" style={{ color: 'var(--g-text-faint)' }}>
              {newGroupType === 'group' ? 'Лимит: 50 участников' : 'Лимит: 10 подписчиков'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (newGroupName.trim()) {
                    onCreateGroup(newGroupName.trim(), newGroupType);
                    setNewGroupName('');
                  }
                }}
                className="flex-1 py-1.5 rounded-lg text-xs font-semibold"
                style={{ background: 'var(--g-green)', color: '#fff' }}
              >
                Создать
              </button>
              <button
                onClick={() => { setShowCreateGroup(false); setNewGroupName(''); }}
                className="flex-1 py-1.5 rounded-lg text-xs"
                style={{ background: 'var(--g-bg3)', color: 'var(--g-text-dim)' }}
              >
                Отмена
              </button>
            </div>
          </div>
        )}

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto g-scrollbar">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12" style={{ color: 'var(--g-text-faint)' }}>
              <Icon name="Search" size={32} className="mb-2 opacity-40" />
              <p className="text-sm">Ничего не найдено</p>
            </div>
          )}
          {filtered.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onChatSelect(chat)}
              className="w-full flex items-center gap-3 px-3 py-2.5 transition-all text-left hover:opacity-90 relative"
              style={{
                background: activeChat?.id === chat.id ? 'rgba(61,186,110,0.1)' : 'transparent',
                borderLeft: activeChat?.id === chat.id ? '3px solid var(--g-green)' : '3px solid transparent',
              }}
            >
              <div className="relative flex-shrink-0">
                <Avatar name={chat.name} size={44} />
                {chat.isOnline && (
                  <div
                    className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2"
                    style={{ background: 'var(--g-green)', borderColor: 'var(--g-bg2)' }}
                  />
                )}
                {chat.type === 'channel' && (
                  <div
                    className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--g-surface)', border: '1px solid var(--g-border)' }}
                  >
                    <Icon name="Radio" size={9} style={{ color: 'var(--g-text-dim)' }} />
                  </div>
                )}
                {chat.type === 'bot' && (
                  <div
                    className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--g-surface)', border: '1px solid var(--g-border)' }}
                  >
                    <span style={{ fontSize: 9 }}>🤖</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm truncate" style={{ color: 'var(--g-text)' }}>
                    {chat.name}
                    {chat.isSystem && (
                      <span className="ml-1 text-xs" style={{ color: 'var(--g-green)' }}>✓</span>
                    )}
                  </span>
                  <span className="text-xs flex-shrink-0 ml-1" style={{ color: 'var(--g-text-faint)' }}>
                    {formatTime(chat)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs truncate" style={{ color: 'var(--g-text-dim)' }}>
                    {chat.lastMessage || 'Нет сообщений'}
                  </span>
                  {(chat.unreadCount || 0) > 0 && (
                    <span
                      className="ml-1 flex-shrink-0 text-xs font-semibold rounded-full px-1.5 py-0.5 min-w-[20px] text-center"
                      style={{ background: 'var(--g-green)', color: '#fff', fontSize: 10 }}
                    >
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
