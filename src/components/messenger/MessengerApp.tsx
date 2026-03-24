import { useState, useEffect } from 'react';
import { User, Chat, ActiveSection } from './types';
import { createInitialChats } from './data';
import Sidebar from './Sidebar';
import ChatView from './ChatView';
import CallScreen from './CallScreen';
import ContactsView from './ContactsView';
import SettingsView from './SettingsView';
import Icon from '@/components/ui/icon';

interface Props {
  user: User;
  onLogout: () => void;
}

export default function MessengerApp({ user, onLogout }: Props) {
  const [chats, setChats] = useState<Chat[]>(() => createInitialChats(user.id));
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [section, setSection] = useState<ActiveSection>('chats');
  const [activeCall, setActiveCall] = useState<{ chat: Chat; type: 'audio' | 'video' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(user);

  const updateCurrentUser = (updates: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
  };

  const handleSendMessage = (chatId: string, text: string, type: 'text' | 'image' | 'file' = 'text', extra?: { fileName?: string; fileSize?: string }) => {
    const newMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text,
      timestamp: new Date(),
      type,
      fileName: extra?.fileName,
      fileSize: extra?.fileSize,
      read: false,
    };

    setChats(prev =>
      prev.map(c =>
        c.id === chatId
          ? {
              ...c,
              messages: [...c.messages, newMessage],
              lastMessage: type === 'file' ? `📎 ${extra?.fileName || 'Файл'}` : type === 'image' ? '🖼 Фото' : text,
              lastTime: 'сейчас',
              unreadCount: 0,
            }
          : c
      )
    );

    // Auto-responses for bots
    if (chatId === 'sys-muska') {
      import('./data').then(({ getMuskaResponse }) => {
        const response = getMuskaResponse(text);
        setTimeout(() => {
          setChats(prev =>
            prev.map(c =>
              c.id === chatId
                ? {
                    ...c,
                    messages: [
                      ...c.messages,
                      {
                        id: Date.now().toString() + '_r',
                        senderId: 'muska',
                        text: response,
                        timestamp: new Date(),
                        type: 'text' as const,
                      },
                    ],
                    lastMessage: response,
                    lastTime: 'сейчас',
                  }
                : c
            )
          );
        }, 800 + Math.random() * 700);
      });
    }

    if (chatId === 'sys-games') {
      const gameNum = parseInt(text.trim());
      if (!isNaN(gameNum) && gameNum >= 1 && gameNum <= 20) {
        const gameNames = ['Угадай число','Камень-ножницы-бумага','Викторина','Быки и коровы','Карточная игра','Змейка','Слова','Угадай мелодию','Шахматные загадки','Города','Судоку-лайт','Угадай флаг','Пятнашки','Угадай страну','Математические гонки','Анаграммы','Правда или ложь','Лабиринт','Реакция','Одноруких бандит'];
        const responses: Record<number, string> = {
          1: '🎲 **Угадай число!**\nЯ загадал число от 1 до 100.\nНапиши число, я подскажу больше/меньше!',
          2: '✂️ **Камень-ножницы-бумага!**\nНапиши: камень, ножницы или бумага!',
          3: '🧠 **Викторина!**\nВопрос: Какая планета ближе всего к Солнцу?\nА) Земля  Б) Меркурий  В) Венера',
          10: '🗺️ **Игра "Города"!**\nЯ начну: Москва\nТвой ход — город на букву А!',
        };
        const resp = responses[gameNum] || `🎮 Запускаю игру **${gameNames[gameNum-1]}**!\nИгра в разработке, скоро будет доступна! Пока попробуй игру №1, 2, 3 или 10.`;
        setTimeout(() => {
          setChats(prev =>
            prev.map(c =>
              c.id === chatId
                ? { ...c, messages: [...c.messages, { id: Date.now().toString() + '_g', senderId: 'games_bot', text: resp, timestamp: new Date(), type: 'text' as const }], lastMessage: resp.slice(0, 40), lastTime: 'сейчас' }
                : c
            )
          );
        }, 600);
      } else if (text === '1' || text.toLowerCase().includes('камень') || text.toLowerCase().includes('ножниц') || text.toLowerCase().includes('бумаг')) {
        const rps = ['камень', 'ножницы', 'бумага'];
        const botChoice = rps[Math.floor(Math.random() * 3)];
        const lower = text.toLowerCase();
        let result = '';
        if (lower.includes(botChoice)) result = 'Ничья! 🤝';
        else if ((lower.includes('камень') && botChoice === 'ножницы') || (lower.includes('ножниц') && botChoice === 'бумага') || (lower.includes('бумаг') && botChoice === 'камень')) result = 'Ты победил! 🎉';
        else result = 'Я победил! 😈';
        const resp2 = `Я выбрал: **${botChoice}**\n${result}\nСыграть снова? Напиши камень, ножницы или бумага!`;
        setTimeout(() => {
          setChats(prev => prev.map(c => c.id === chatId ? { ...c, messages: [...c.messages, { id: Date.now().toString() + '_g', senderId: 'games_bot', text: resp2, timestamp: new Date(), type: 'text' as const }], lastMessage: resp2.slice(0, 40), lastTime: 'сейчас' } : c));
        }, 600);
      } else if (text === 'А' || text === 'Б' || text === 'В') {
        const resp3 = text === 'Б' ? '✅ Правильно! Меркурий — ближайшая к Солнцу планета!\n🧠 +10 очков! Следующий вопрос: Сколько материков на Земле?\nА) 5  Б) 6  В) 7' : `❌ Неверно! Правильный ответ: **Б) Меркурий**\nПопробуй ещё раз: Сколько материков на Земле?\nА) 5  Б) 6  В) 7`;
        setTimeout(() => {
          setChats(prev => prev.map(c => c.id === chatId ? { ...c, messages: [...c.messages, { id: Date.now().toString() + '_g', senderId: 'games_bot', text: resp3, timestamp: new Date(), type: 'text' as const }], lastMessage: resp3.slice(0, 40), lastTime: 'сейчас' } : c));
        }, 600);
      }
    }

    if (chatId === 'sys-botmaker') {
      if (text.trim() === '/newbot') {
        const resp = '🤖 Создание нового бота!\n\nШаг 1 из 3: Введите имя для вашего бота\n(например: "Мой помощник")';
        setTimeout(() => {
          setChats(prev => prev.map(c => c.id === chatId ? { ...c, messages: [...c.messages, { id: Date.now().toString() + '_bm', senderId: 'botmaker', text: resp, timestamp: new Date(), type: 'text' as const }], lastMessage: resp.slice(0, 40), lastTime: 'сейчас' } : c));
        }, 600);
      } else if (text.trim() === '/mybots') {
        const resp = '🤖 Ваши боты:\n\nУ вас пока нет созданных ботов.\nНапишите /newbot чтобы создать первого!';
        setTimeout(() => {
          setChats(prev => prev.map(c => c.id === chatId ? { ...c, messages: [...c.messages, { id: Date.now().toString() + '_bm', senderId: 'botmaker', text: resp, timestamp: new Date(), type: 'text' as const }], lastMessage: resp.slice(0, 40), lastTime: 'сейчас' } : c));
        }, 600);
      }
    }
  };

  const handleCreateGroup = (name: string, type: 'group' | 'channel') => {
    const newChat: Chat = {
      id: Date.now().toString(),
      type,
      name,
      lastMessage: type === 'group' ? 'Группа создана' : 'Канал создан',
      lastTime: 'сейчас',
      members: 1,
      messages: [
        {
          id: 'sys1',
          senderId: 'system',
          text: type === 'group' ? `Группа "${name}" создана` : `Канал "${name}" создан`,
          timestamp: new Date(),
          type: 'system',
        },
      ],
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChat(newChat);
    setShowCreateGroup(false);
  };

  const activeChatData = activeChat ? chats.find(c => c.id === activeChat.id) || activeChat : null;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--g-bg)' }}>
      {/* Sidebar */}
      <Sidebar
        chats={chats}
        currentUser={currentUser}
        activeChat={activeChatData}
        section={section}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSectionChange={setSection}
        onChatSelect={(chat) => { setActiveChat(chat); setSection('chats'); }}
        onCreateGroup={handleCreateGroup}
        showCreateGroup={showCreateGroup}
        setShowCreateGroup={setShowCreateGroup}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {section === 'chats' && activeChatData ? (
          <ChatView
            chat={activeChatData}
            currentUser={currentUser}
            onSendMessage={(text, type, extra) => handleSendMessage(activeChatData.id, text, type, extra)}
            onStartCall={(type) => setActiveCall({ chat: activeChatData, type })}
            onBack={() => setActiveChat(null)}
          />
        ) : section === 'chats' && !activeChatData ? (
          <div className="flex-1 flex flex-col items-center justify-center" style={{ background: 'var(--g-bg)' }}>
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6"
              style={{ background: 'rgba(61,186,110,0.1)' }}
            >
              <svg width="52" height="52" viewBox="0 0 44 44" fill="none">
                <path d="M22 6C13.163 6 6 13.163 6 22C6 25.546 7.127 28.835 9.045 31.5L6.5 38L13.5 35.5C16.088 37.22 19.425 38 22 38C30.837 38 38 30.837 38 22C38 13.163 30.837 6 22 6Z" fill="#3dba6e" fillOpacity="0.7"/>
                <circle cx="15" cy="22" r="2.5" fill="white" />
                <circle cx="22" cy="22" r="2.5" fill="white" />
                <circle cx="29" cy="22" r="2.5" fill="white" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--g-text)' }}>
              Добро пожаловать в Гылекор
            </h2>
            <p className="text-sm text-center max-w-xs" style={{ color: 'var(--g-text-dim)' }}>
              Выберите чат слева или найдите пользователя по поиску
            </p>
          </div>
        ) : section === 'contacts' ? (
          <ContactsView
            chats={chats}
            currentUser={currentUser}
            onChatSelect={(chat) => { setActiveChat(chat); setSection('chats'); }}
          />
        ) : section === 'settings' ? (
          <SettingsView
            user={currentUser}
            onUpdateUser={updateCurrentUser}
            onLogout={onLogout}
          />
        ) : null}
      </div>

      {/* Call overlay */}
      {activeCall && (
        <CallScreen
          chat={activeCall.chat}
          callType={activeCall.type}
          currentUser={currentUser}
          onEnd={() => setActiveCall(null)}
        />
      )}
    </div>
  );
}
