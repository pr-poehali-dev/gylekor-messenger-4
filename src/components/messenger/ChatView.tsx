import { useState, useRef, useEffect } from 'react';
import { Chat, User, Message } from './types';
import { Avatar } from './Sidebar';
import Icon from '@/components/ui/icon';

interface Props {
  chat: Chat;
  currentUser: User;
  onSendMessage: (text: string, type?: 'text' | 'image' | 'file', extra?: { fileName?: string; fileSize?: string }) => void;
  onStartCall: (type: 'audio' | 'video') => void;
  onBack: () => void;
}

const EMOJIS = ['😀','😂','😍','🥰','😎','🤔','😅','🤣','❤️','🔥','👍','👎','✅','❌','🎉','🎊','💯','🚀','⭐','💚','🐱','🌟','😭','🥹','💪','🙏','👋','😊','🤗','😴'];

export default function ChatView({ chat, currentUser, onSendMessage, onStartCall, onBack }: Props) {
  const [input, setInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    onSendMessage(text);
    setInput('');
    setShowEmoji(false);
    textareaRef.current?.focus();
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const size = file.size < 1024 * 1024
      ? `${(file.size / 1024).toFixed(1)} KB`
      : `${(file.size / 1024 / 1024).toFixed(1)} MB`;
    if (type === 'image') {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onSendMessage(ev.target?.result as string, 'image');
      };
      reader.readAsDataURL(file);
    } else {
      onSendMessage(`📎 ${file.name}`, 'file', { fileName: file.name, fileSize: size });
    }
    setShowAttach(false);
    e.target.value = '';
  };

  const formatTime = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return 'Сегодня';
    if (d.toDateString() === yesterday.toDateString()) return 'Вчера';
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  };

  const groupByDate = (messages: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = [];
    messages.forEach((msg) => {
      const date = formatDate(msg.timestamp);
      const last = groups[groups.length - 1];
      if (last && last.date === date) {
        last.messages.push(msg);
      } else {
        groups.push({ date, messages: [msg] });
      }
    });
    return groups;
  };

  const isOutgoing = (msg: Message) => msg.senderId === currentUser.id;

  const getBotName = () => {
    if (chat.id === 'sys-muska') return '🐱 Муська';
    if (chat.id === 'sys-games') return '🎮 Игры';
    if (chat.id === 'sys-botmaker') return '🤖 Конструктор';
    return chat.name;
  };

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--g-bg)' }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--g-border)', background: 'var(--g-bg2)' }}
      >
        <button
          onClick={onBack}
          className="mr-1 transition-all hover:opacity-70 md:hidden"
          style={{ color: 'var(--g-text-dim)' }}
        >
          <Icon name="ArrowLeft" size={20} />
        </button>

        <div className="relative">
          <Avatar name={chat.name} size={40} />
          {chat.isOnline && (
            <div
              className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full border-2"
              style={{ background: 'var(--g-green)', borderColor: 'var(--g-bg2)' }}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-sm truncate" style={{ color: 'var(--g-text)' }}>
              {chat.name}
            </span>
            {chat.isSystem && (
              <Icon name="BadgeCheck" size={14} style={{ color: 'var(--g-green)', flexShrink: 0 }} />
            )}
          </div>
          <p className="text-xs truncate" style={{ color: 'var(--g-text-dim)' }}>
            {chat.type === 'bot' ? (chat.isOnline ? '🟢 онлайн' : 'бот') :
             chat.type === 'channel' ? `📡 канал · ${chat.members || 1} подписч.` :
             chat.type === 'group' ? `👥 группа · ${chat.members || 1} участн.` :
             chat.isOnline ? '🟢 онлайн' : 'был(а) недавно'}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {chat.type !== 'channel' && chat.type !== 'bot' && (
            <>
              <button
                onClick={() => onStartCall('audio')}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
                style={{ background: 'rgba(61,186,110,0.1)', color: 'var(--g-green)' }}
                title="Аудиозвонок"
              >
                <Icon name="Phone" size={16} />
              </button>
              <button
                onClick={() => onStartCall('video')}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
                style={{ background: 'rgba(61,186,110,0.1)', color: 'var(--g-green)' }}
                title="Видеозвонок"
              >
                <Icon name="Video" size={16} />
              </button>
            </>
          )}
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
            style={{ background: 'rgba(61,186,110,0.05)', color: 'var(--g-text-dim)' }}
          >
            <Icon name="MoreVertical" size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto g-scrollbar px-4 py-4"
        style={{ background: 'var(--g-bg)' }}
      >
        {groupByDate(chat.messages).map((group) => (
          <div key={group.date}>
            <div className="flex justify-center my-4">
              <span
                className="text-xs px-3 py-1 rounded-full"
                style={{ background: 'var(--g-surface)', color: 'var(--g-text-dim)' }}
              >
                {group.date}
              </span>
            </div>
            {group.messages.map((msg) => {
              if (msg.type === 'system') {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <span
                      className="text-xs px-3 py-1 rounded-full"
                      style={{ background: 'var(--g-surface)', color: 'var(--g-text-dim)' }}
                    >
                      {msg.text}
                    </span>
                  </div>
                );
              }

              const out = isOutgoing(msg);
              const senderName = out ? currentUser.name : getBotName();

              return (
                <div
                  key={msg.id}
                  className={`flex mb-3 ${out ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  {!out && (
                    <div className="mr-2 mt-auto flex-shrink-0">
                      <Avatar name={senderName} size={28} />
                    </div>
                  )}
                  <div className={`max-w-[70%] ${out ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div
                      className="px-3 py-2 rounded-2xl relative"
                      style={{
                        background: out ? 'var(--g-green)' : 'var(--g-surface)',
                        color: out ? '#fff' : 'var(--g-text)',
                        borderRadius: out ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        maxWidth: '100%',
                      }}
                    >
                      {msg.type === 'image' ? (
                        <img
                          src={msg.text}
                          alt="фото"
                          className="rounded-xl max-w-xs max-h-64 object-cover"
                          style={{ display: 'block' }}
                        />
                      ) : msg.type === 'file' ? (
                        <div className="flex items-center gap-2 py-1">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: out ? 'rgba(255,255,255,0.2)' : 'rgba(61,186,110,0.15)' }}
                          >
                            <Icon name="FileText" size={18} style={{ color: out ? '#fff' : 'var(--g-green)' }} />
                          </div>
                          <div>
                            <p className="text-sm font-medium leading-tight">{msg.fileName}</p>
                            <p className="text-xs opacity-70">{msg.fileSize}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      )}
                    </div>
                    <span className="text-xs mt-1 px-1" style={{ color: 'var(--g-text-faint)' }}>
                      {formatTime(msg.timestamp)}
                      {out && <span className="ml-1" style={{ color: 'var(--g-green)' }}>✓✓</span>}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {chat.type !== 'channel' && (
        <div
          className="px-4 py-3 flex-shrink-0"
          style={{ borderTop: '1px solid var(--g-border)', background: 'var(--g-bg2)' }}
        >
          {showEmoji && (
            <div
              className="mb-2 p-3 rounded-xl flex flex-wrap gap-2 animate-slide-up"
              style={{ background: 'var(--g-surface)', border: '1px solid var(--g-border)' }}
            >
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  className="text-xl hover:scale-110 transition-transform"
                  onClick={() => { setInput(prev => prev + e); textareaRef.current?.focus(); }}
                >
                  {e}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2">
            <div className="relative">
              <button
                onClick={() => { setShowAttach(!showAttach); setShowEmoji(false); }}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-80"
                style={{
                  background: showAttach ? 'rgba(61,186,110,0.15)' : 'var(--g-surface)',
                  color: showAttach ? 'var(--g-green)' : 'var(--g-text-dim)',
                }}
              >
                <Icon name="Paperclip" size={18} />
              </button>

              {showAttach && (
                <div
                  className="absolute bottom-12 left-0 rounded-xl p-2 flex flex-col gap-1 animate-scale-in z-10"
                  style={{ background: 'var(--g-surface2)', border: '1px solid var(--g-border)', minWidth: 140 }}
                >
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:opacity-80"
                    style={{ color: 'var(--g-text)' }}
                  >
                    <Icon name="Image" size={16} style={{ color: 'var(--g-green)' }} />
                    Фото/Видео
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:opacity-80"
                    style={{ color: 'var(--g-text)' }}
                  >
                    <Icon name="FileText" size={16} style={{ color: 'var(--g-green)' }} />
                    Файл
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Написать сообщение..."
                rows={1}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none g-scrollbar"
                style={{
                  background: 'var(--g-surface)',
                  border: '1px solid var(--g-border)',
                  color: 'var(--g-text)',
                  maxHeight: 120,
                  lineHeight: '1.5',
                }}
                onInput={(e) => {
                  const t = e.target as HTMLTextAreaElement;
                  t.style.height = 'auto';
                  t.style.height = Math.min(t.scrollHeight, 120) + 'px';
                }}
              />
            </div>

            <button
              onClick={() => { setShowEmoji(!showEmoji); setShowAttach(false); }}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-80 flex-shrink-0"
              style={{
                background: showEmoji ? 'rgba(61,186,110,0.15)' : 'var(--g-surface)',
                color: showEmoji ? 'var(--g-green)' : 'var(--g-text-dim)',
              }}
            >
              <span className="text-lg">😊</span>
            </button>

            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
              style={{
                background: input.trim() ? 'var(--g-green)' : 'var(--g-surface)',
                color: input.trim() ? '#fff' : 'var(--g-text-faint)',
              }}
            >
              <Icon name="Send" size={16} />
            </button>
          </div>
        </div>
      )}

      {chat.type === 'channel' && (
        <div
          className="px-4 py-3 text-center text-sm flex-shrink-0"
          style={{ borderTop: '1px solid var(--g-border)', background: 'var(--g-bg2)', color: 'var(--g-text-faint)' }}
        >
          📡 Канал — только чтение
        </div>
      )}

      <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => handleFile(e, 'file')} />
      <input ref={imageInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={(e) => handleFile(e, 'image')} />
    </div>
  );
}
