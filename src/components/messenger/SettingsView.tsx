import { useState } from 'react';
import { User } from './types';
import { Avatar } from './Sidebar';
import Icon from '@/components/ui/icon';

interface Props {
  user: User;
  onUpdateUser: (updates: Partial<User>) => void;
  onLogout: () => void;
}

type SettingsTab = 'profile' | 'notifications' | 'privacy' | 'appearance' | 'storage' | 'about';

const MUSKA_KNOWLEDGE_TABLE = [
  { category: 'Приветствия', keywords: 'привет, хай, здравствуй', responses: 'Мяу! Привет, дружочек! 🐱' },
  { category: 'Математика', keywords: 'сколько, посчитай, плюс', responses: 'Ой, математика! Я люблю считать рыбок...' },
  { category: 'Погода', keywords: 'погода, дождь, солнце', responses: 'Я живу в телефоне, не знаю погоды!' },
  { category: 'Анекдоты', keywords: 'анекдот, пошути, смешно', responses: 'Почему кошки любят компьютеры? Боятся мышей!' },
  { category: 'Любовь', keywords: 'люблю, нравишься, поцеловать', responses: 'Мур-мур ❤️ Я тоже тебя люблю!' },
  { category: 'Грусть', keywords: 'грустно, плохо, устал', responses: 'Мяу... Буду мурчать, станет лучше!' },
  { category: 'Кошки', keywords: 'кот, кошка, мяу', responses: 'МЯУ! Кошки — лучшие существа!' },
  { category: 'Время', keywords: 'время, который час', responses: 'Показывает текущее время' },
  { category: 'Дата', keywords: 'дата, сегодня, число', responses: 'Показывает текущую дату' },
  { category: 'Помощь', keywords: 'помоги, что умеешь', responses: 'Перечисляет свои возможности' },
  { category: 'Гылекор', keywords: 'гылекор, мессенджер', responses: 'Рассказывает о мессенджере' },
  { category: 'Еда', keywords: 'еда, голоден, рецепт', responses: 'Говорит о рыбке и молочке 🐟' },
  { category: 'Музыка', keywords: 'музыка, песня, слушать', responses: 'Мяу-мяу-мяу! 🎵 Любит мурчание!' },
  { category: 'Игры', keywords: 'игра, поиграем', responses: 'Отправляет в бота Игры Гылекора' },
  { category: 'Прощание', keywords: 'пока, до свидания, бай', responses: 'Мяу, пока-пока! Буду скучать!' },
  { category: 'Благодарность', keywords: 'спасибо, благодарю', responses: 'Мяу! Пожалуйста! 😸' },
  { category: 'Оскорбления', keywords: 'дура, тупая, ненавижу', responses: 'Мяу... Это обидно. Будь добрее.' },
  { category: 'О себе', keywords: 'кто ты, ты бот, расскажи', responses: 'Я Муська, нейросеть-кошка Гылекора!' },
  { category: 'Космос', keywords: 'космос, звезды, луна', responses: 'Есть ли там кошки? Наверное да! 🌌' },
  { category: 'Советы', keywords: 'совет, что делать', responses: 'Ляг, свернись клубочком и подумай!' },
];

export default function SettingsView({ user, onUpdateUser, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio || '');
  const [editUsername, setEditUsername] = useState(user.username);
  const [saved, setSaved] = useState(false);

  // Notification settings
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifGroups, setNotifGroups] = useState(true);
  const [notifChannels, setNotifChannels] = useState(false);
  const [notifCalls, setNotifCalls] = useState(true);
  const [notifSound, setNotifSound] = useState(true);
  const [notifVibration, setNotifVibration] = useState(true);

  // Privacy settings
  const [phoneVisible, setPhoneVisible] = useState<'all' | 'contacts' | 'nobody'>('contacts');
  const [onlineVisible, setOnlineVisible] = useState<'all' | 'contacts' | 'nobody'>('all');
  const [avatarVisible, setAvatarVisible] = useState<'all' | 'contacts'>('all');
  const [readReceipts, setReadReceipts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  // Appearance
  const [fontSize, setFontSize] = useState(14);
  const [compactMode, setCompactMode] = useState(false);
  const [animationsOn, setAnimationsOn] = useState(true);

  // Storage
  const [autoDownloadImages, setAutoDownloadImages] = useState(true);
  const [autoDownloadFiles, setAutoDownloadFiles] = useState(false);
  const [cacheSize] = useState('12.4 МБ');

  const handleSaveProfile = () => {
    onUpdateUser({ name: editName, bio: editBio, username: editUsername });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className="relative w-10 h-6 rounded-full transition-all flex-shrink-0"
      style={{ background: value ? 'var(--g-green)' : 'var(--g-surface2)' }}
    >
      <div
        className="absolute top-0.5 w-5 h-5 rounded-full transition-all"
        style={{
          left: value ? '18px' : '2px',
          background: '#fff',
        }}
      />
    </button>
  );

  const SettingRow = ({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) => (
    <div
      className="flex items-center justify-between p-4 rounded-xl"
      style={{ background: 'var(--g-bg2)', border: '1px solid var(--g-border)' }}
    >
      <div className="flex-1 min-w-0 mr-3">
        <p className="text-sm font-medium" style={{ color: 'var(--g-text)' }}>{label}</p>
        {desc && <p className="text-xs mt-0.5" style={{ color: 'var(--g-text-dim)' }}>{desc}</p>}
      </div>
      {children}
    </div>
  );

  const tabs: { id: SettingsTab; icon: string; label: string }[] = [
    { id: 'profile', icon: 'User', label: 'Профиль' },
    { id: 'notifications', icon: 'Bell', label: 'Уведомления' },
    { id: 'privacy', icon: 'Shield', label: 'Конфид.' },
    { id: 'appearance', icon: 'Palette', label: 'Вид' },
    { id: 'storage', icon: 'HardDrive', label: 'Память' },
    { id: 'about', icon: 'Info', label: 'О Муське' },
  ];

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--g-bg)' }}>
      {/* Header */}
      <div
        className="px-6 pt-6 pb-4 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--g-border)', background: 'var(--g-bg2)' }}
      >
        <h1 className="text-xl font-bold mb-4" style={{ color: 'var(--g-text)' }}>Настройки</h1>
        <div className="flex gap-1 overflow-x-auto g-scrollbar pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0"
              style={{
                background: activeTab === tab.id ? 'var(--g-green)' : 'var(--g-surface)',
                color: activeTab === tab.id ? '#fff' : 'var(--g-text-dim)',
              }}
            >
              <Icon name={tab.icon} size={13} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto g-scrollbar p-4">
        {/* Profile */}
        {activeTab === 'profile' && (
          <div className="space-y-3 animate-fade-in">
            <div
              className="p-5 rounded-2xl flex items-center gap-4"
              style={{ background: 'var(--g-bg2)', border: '1px solid var(--g-border)' }}
            >
              <Avatar name={user.name} size={64} />
              <div>
                <p className="font-bold text-lg" style={{ color: 'var(--g-text)' }}>{user.name}</p>
                <p className="text-sm" style={{ color: 'var(--g-green)' }}>@{user.username}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--g-text-dim)' }}>{user.phone}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--g-text-dim)' }}>Имя</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--g-bg2)', border: '1px solid var(--g-border)', color: 'var(--g-text)' }}
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--g-text-dim)' }}>@Username</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold" style={{ color: 'var(--g-green)' }}>@</span>
                  <input
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                    className="w-full pl-8 pr-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: 'var(--g-bg2)', border: '1px solid var(--g-border)', color: 'var(--g-text)' }}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--g-text-dim)' }}>О себе</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  maxLength={200}
                  rows={3}
                  placeholder="Напишите что-нибудь о себе..."
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                  style={{ background: 'var(--g-bg2)', border: '1px solid var(--g-border)', color: 'var(--g-text)' }}
                />
                <p className="text-xs text-right mt-1" style={{ color: 'var(--g-text-faint)' }}>{editBio.length}/200</p>
              </div>
            </div>

            <div
              className="p-4 rounded-xl"
              style={{ background: 'var(--g-bg2)', border: '1px solid var(--g-border)' }}
            >
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--g-text-dim)' }}>Данные аккаунта</p>
              <p className="text-sm" style={{ color: 'var(--g-text)' }}>📞 {user.phone}</p>
              <p className="text-sm mt-1" style={{ color: 'var(--g-text)' }}>📧 {user.email}</p>
            </div>

            <button
              onClick={handleSaveProfile}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: 'var(--g-green)', color: '#fff' }}
            >
              {saved ? '✓ Сохранено!' : 'Сохранить изменения'}
            </button>

            <button
              onClick={onLogout}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              Выйти из аккаунта
            </button>
          </div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-2 animate-fade-in">
            <p className="text-xs font-semibold px-1 mb-3" style={{ color: 'var(--g-text-dim)' }}>УВЕДОМЛЕНИЯ</p>
            <SettingRow label="Сообщения" desc="Личные чаты">
              <Toggle value={notifMessages} onChange={setNotifMessages} />
            </SettingRow>
            <SettingRow label="Группы" desc="Уведомления из групп">
              <Toggle value={notifGroups} onChange={setNotifGroups} />
            </SettingRow>
            <SettingRow label="Каналы" desc="Новые посты в каналах">
              <Toggle value={notifChannels} onChange={setNotifChannels} />
            </SettingRow>
            <SettingRow label="Звонки" desc="Входящие звонки">
              <Toggle value={notifCalls} onChange={setNotifCalls} />
            </SettingRow>
            <p className="text-xs font-semibold px-1 mt-4 mb-3" style={{ color: 'var(--g-text-dim)' }}>ЗВУК И ВИБРАЦИЯ</p>
            <SettingRow label="Звук" desc="Звуковые уведомления">
              <Toggle value={notifSound} onChange={setNotifSound} />
            </SettingRow>
            <SettingRow label="Вибрация" desc="Вибрация при уведомлениях">
              <Toggle value={notifVibration} onChange={setNotifVibration} />
            </SettingRow>
          </div>
        )}

        {/* Privacy */}
        {activeTab === 'privacy' && (
          <div className="space-y-2 animate-fade-in">
            <p className="text-xs font-semibold px-1 mb-3" style={{ color: 'var(--g-text-dim)' }}>ПРИВАТНОСТЬ</p>
            <SettingRow label="Номер телефона" desc="Кто видит ваш номер">
              <select
                value={phoneVisible}
                onChange={(e) => setPhoneVisible(e.target.value as typeof phoneVisible)}
                className="text-xs rounded-lg px-2 py-1 outline-none"
                style={{ background: 'var(--g-surface2)', color: 'var(--g-text)', border: '1px solid var(--g-border)' }}
              >
                <option value="all">Все</option>
                <option value="contacts">Контакты</option>
                <option value="nobody">Никто</option>
              </select>
            </SettingRow>
            <SettingRow label="Время онлайн" desc="Кто видит когда вы онлайн">
              <select
                value={onlineVisible}
                onChange={(e) => setOnlineVisible(e.target.value as typeof onlineVisible)}
                className="text-xs rounded-lg px-2 py-1 outline-none"
                style={{ background: 'var(--g-surface2)', color: 'var(--g-text)', border: '1px solid var(--g-border)' }}
              >
                <option value="all">Все</option>
                <option value="contacts">Контакты</option>
                <option value="nobody">Никто</option>
              </select>
            </SettingRow>
            <SettingRow label="Аватар" desc="Кто видит вашу фотографию">
              <select
                value={avatarVisible}
                onChange={(e) => setAvatarVisible(e.target.value as typeof avatarVisible)}
                className="text-xs rounded-lg px-2 py-1 outline-none"
                style={{ background: 'var(--g-surface2)', color: 'var(--g-text)', border: '1px solid var(--g-border)' }}
              >
                <option value="all">Все</option>
                <option value="contacts">Контакты</option>
              </select>
            </SettingRow>
            <SettingRow label="Уведомления о прочтении" desc="Показывать галочки прочтения">
              <Toggle value={readReceipts} onChange={setReadReceipts} />
            </SettingRow>
            <p className="text-xs font-semibold px-1 mt-4 mb-3" style={{ color: 'var(--g-text-dim)' }}>БЕЗОПАСНОСТЬ</p>
            <SettingRow label="Двухфакторная аутентификация" desc="Дополнительная защита аккаунта">
              <Toggle value={twoFactor} onChange={setTwoFactor} />
            </SettingRow>
            <div
              className="p-4 rounded-xl mt-2"
              style={{ background: 'rgba(61,186,110,0.05)', border: '1px solid rgba(61,186,110,0.15)' }}
            >
              <p className="text-xs" style={{ color: 'var(--g-text-dim)' }}>
                🔒 Все сообщения в Гылекоре защищены шифрованием. Ваши данные не передаются третьим лицам.
              </p>
            </div>
          </div>
        )}

        {/* Appearance */}
        {activeTab === 'appearance' && (
          <div className="space-y-2 animate-fade-in">
            <p className="text-xs font-semibold px-1 mb-3" style={{ color: 'var(--g-text-dim)' }}>ИНТЕРФЕЙС</p>
            <SettingRow label="Компактный режим" desc="Уменьшенный список чатов">
              <Toggle value={compactMode} onChange={setCompactMode} />
            </SettingRow>
            <SettingRow label="Анимации" desc="Плавные переходы">
              <Toggle value={animationsOn} onChange={setAnimationsOn} />
            </SettingRow>
            <div
              className="p-4 rounded-xl"
              style={{ background: 'var(--g-bg2)', border: '1px solid var(--g-border)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--g-text)' }}>Размер шрифта</p>
                  <p className="text-xs" style={{ color: 'var(--g-text-dim)' }}>Текст сообщений</p>
                </div>
                <span className="text-sm font-semibold" style={{ color: 'var(--g-green)' }}>{fontSize}px</span>
              </div>
              <input
                type="range"
                min={11}
                max={20}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-green-500"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs" style={{ color: 'var(--g-text-faint)' }}>Мелкий</span>
                <span className="text-xs" style={{ color: 'var(--g-text-faint)' }}>Крупный</span>
              </div>
            </div>
            <p className="text-xs font-semibold px-1 mt-4 mb-3" style={{ color: 'var(--g-text-dim)' }}>ТЕМА</p>
            <div
              className="p-4 rounded-xl flex items-center gap-3"
              style={{ background: 'var(--g-bg2)', border: '2px solid var(--g-green)' }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--g-green)' }}>
                <Icon name="Moon" size={16} style={{ color: '#fff' }} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--g-text)' }}>Тёмная (активна)</p>
                <p className="text-xs" style={{ color: 'var(--g-green)' }}>Зелёные акценты</p>
              </div>
              <Icon name="Check" size={16} style={{ color: 'var(--g-green)', marginLeft: 'auto' }} />
            </div>
          </div>
        )}

        {/* Storage */}
        {activeTab === 'storage' && (
          <div className="space-y-3 animate-fade-in">
            <div
              className="p-5 rounded-2xl"
              style={{ background: 'var(--g-bg2)', border: '1px solid var(--g-border)' }}
            >
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--g-text)' }}>Использование кэша</p>
              <p className="text-2xl font-bold mt-1" style={{ color: 'var(--g-green)' }}>{cacheSize}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--g-text-dim)' }}>Медиафайлы и данные чатов</p>
            </div>
            <p className="text-xs font-semibold px-1 mb-3 mt-4" style={{ color: 'var(--g-text-dim)' }}>АВТОЗАГРУЗКА</p>
            <SettingRow label="Фото и видео" desc="Автоматически загружать в Wi-Fi">
              <Toggle value={autoDownloadImages} onChange={setAutoDownloadImages} />
            </SettingRow>
            <SettingRow label="Файлы" desc="Автоматически загружать файлы">
              <Toggle value={autoDownloadFiles} onChange={setAutoDownloadFiles} />
            </SettingRow>
            <button
              className="w-full py-3 rounded-xl text-sm font-semibold mt-2 transition-all hover:opacity-90"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              Очистить кэш ({cacheSize})
            </button>
          </div>
        )}

        {/* About Muska */}
        {activeTab === 'about' && (
          <div className="space-y-3 animate-fade-in">
            <div
              className="p-5 rounded-2xl flex items-center gap-4"
              style={{ background: 'var(--g-bg2)', border: '1px solid var(--g-border)' }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
                style={{ background: 'rgba(61,186,110,0.1)' }}
              >
                🐱
              </div>
              <div>
                <p className="font-bold text-lg" style={{ color: 'var(--g-text)' }}>Муська</p>
                <p className="text-sm" style={{ color: 'var(--g-green)' }}>Нейросеть-кошка Гылекора</p>
                <p className="text-xs mt-1" style={{ color: 'var(--g-text-dim)' }}>Версия базы знаний: 1.0</p>
              </div>
            </div>

            <p className="text-sm font-semibold px-1" style={{ color: 'var(--g-text)' }}>
              База знаний Муськи — {MUSKA_KNOWLEDGE_TABLE.length} категорий
            </p>

            <div
              className="rounded-xl overflow-hidden"
              style={{ border: '1px solid var(--g-border)' }}
            >
              <div
                className="grid grid-cols-3 px-4 py-2 text-xs font-semibold"
                style={{ background: 'var(--g-surface2)', color: 'var(--g-text-dim)' }}
              >
                <span>Категория</span>
                <span>Ключевые слова</span>
                <span>Реакция</span>
              </div>
              {MUSKA_KNOWLEDGE_TABLE.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-3 px-4 py-2.5 text-xs"
                  style={{
                    background: i % 2 === 0 ? 'var(--g-bg2)' : 'transparent',
                    borderTop: '1px solid var(--g-border)',
                    color: 'var(--g-text)',
                  }}
                >
                  <span className="font-medium" style={{ color: 'var(--g-green)' }}>{row.category}</span>
                  <span style={{ color: 'var(--g-text-dim)' }}>{row.keywords}</span>
                  <span className="truncate" style={{ color: 'var(--g-text)' }}>{row.responses}</span>
                </div>
              ))}
            </div>

            <div
              className="p-4 rounded-xl mt-2"
              style={{ background: 'rgba(61,186,110,0.05)', border: '1px solid rgba(61,186,110,0.15)' }}
            >
              <p className="text-xs" style={{ color: 'var(--g-text-dim)' }}>
                🐾 Муська — системный бот Гылекора. Она обучена на 20 категориях знаний и всегда готова помочь, пошутить или просто помурлыкать! Написать ей можно в боте "🐱 Муська".
              </p>
            </div>

            <div
              className="p-4 rounded-xl"
              style={{ background: 'var(--g-bg2)', border: '1px solid var(--g-border)' }}
            >
              <p className="text-sm font-semibold mb-2" style={{ color: 'var(--g-text)' }}>О Гылекоре</p>
              <p className="text-xs" style={{ color: 'var(--g-text-dim)' }}>Версия: 1.0.0</p>
              <p className="text-xs mt-1" style={{ color: 'var(--g-text-dim)' }}>Гылекор — современный мессенджер с группами до 50 участников, каналами до 10 подписчиков, конструктором ботов и нейросетью-кошкой.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
