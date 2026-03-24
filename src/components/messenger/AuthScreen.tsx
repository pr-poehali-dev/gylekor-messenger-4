import { useState } from 'react';
import { User } from './types';
import Icon from '@/components/ui/icon';

interface AuthScreenProps {
  onAuth: (user: User) => void;
}

type AuthStep = 'phone' | 'code' | 'register' | 'username';

const FAKE_CODE = '472851';

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [step, setStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentCode] = useState(FAKE_CODE);
  const [showCode, setShowCode] = useState(false);

  const handlePhoneSubmit = () => {
    setError('');
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Введите корректный номер телефона');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Введите корректный email');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('code');
    }, 1200);
  };

  const handleCodeSubmit = () => {
    setError('');
    if (code === sentCode) {
      setStep('register');
    } else {
      setError('Неверный код. Проверьте почту');
    }
  };

  const handleRegisterSubmit = () => {
    setError('');
    if (name.trim().length < 2) {
      setError('Введите имя (минимум 2 символа)');
      return;
    }
    setStep('username');
  };

  const handleUsernameSubmit = () => {
    setError('');
    const uname = username.replace('@', '').trim();
    if (uname.length < 3) {
      setError('@адрес должен содержать минимум 3 символа');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(uname)) {
      setError('@адрес может содержать только латинские буквы, цифры и _');
      return;
    }
    const user: User = {
      id: Date.now().toString(),
      name: name.trim(),
      username: uname,
      phone,
      email,
      bio: '',
      isOnline: true,
    };
    onAuth(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--g-bg)' }}>
      <div className="w-full max-w-sm px-6 animate-slide-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 animate-pulse-green"
            style={{ background: 'var(--g-green)' }}
          >
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <path
                d="M22 6C13.163 6 6 13.163 6 22C6 25.546 7.127 28.835 9.045 31.5L6.5 38L13.5 35.5C16.088 37.22 19.425 38 22 38C30.837 38 38 30.837 38 22C38 13.163 30.837 6 22 6Z"
                fill="white"
                fillOpacity="0.95"
              />
              <circle cx="15" cy="22" r="2.5" fill="#3dba6e" />
              <circle cx="22" cy="22" r="2.5" fill="#3dba6e" />
              <circle cx="29" cy="22" r="2.5" fill="#3dba6e" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--g-text)' }}>
            Гылекор
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--g-text-dim)' }}>
            Мессенджер нового поколения
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-6"
          style={{ background: 'var(--g-bg2)', border: '1px solid var(--g-border)' }}
        >
          {step === 'phone' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--g-text)' }}>
                  Вход / Регистрация
                </h2>
                <p className="text-sm" style={{ color: 'var(--g-text-dim)' }}>
                  Введите телефон и email для получения кода
                </p>
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--g-text-dim)' }}>
                  Номер телефона
                </label>
                <div className="relative">
                  <Icon name="Phone" size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--g-text-faint)' }} />
                  <input
                    type="tel"
                    placeholder="+7 (999) 000-00-00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: 'var(--g-surface)',
                      border: '1px solid var(--g-border)',
                      color: 'var(--g-text)',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--g-green)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--g-border)')}
                    onKeyDown={(e) => e.key === 'Enter' && handlePhoneSubmit()}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--g-text-dim)' }}>
                  Email для кода подтверждения
                </label>
                <div className="relative">
                  <Icon name="Mail" size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--g-text-faint)' }} />
                  <input
                    type="email"
                    placeholder="example@mail.ru"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: 'var(--g-surface)',
                      border: '1px solid var(--g-border)',
                      color: 'var(--g-text)',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--g-green)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--g-border)')}
                    onKeyDown={(e) => e.key === 'Enter' && handlePhoneSubmit()}
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}

              <button
                onClick={handlePhoneSubmit}
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: 'var(--g-green)', color: '#fff' }}
              >
                {loading ? 'Отправка кода...' : 'Получить код →'}
              </button>

              <p className="text-xs text-center" style={{ color: 'var(--g-text-faint)' }}>
                На один номер/email — только 1 аккаунт
              </p>
            </div>
          )}

          {step === 'code' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--g-text)' }}>
                  Введите код
                </h2>
                <p className="text-sm" style={{ color: 'var(--g-text-dim)' }}>
                  Код отправлен на {email}
                </p>
              </div>

              {/* Demo hint */}
              <div
                className="rounded-xl p-3 text-sm"
                style={{ background: 'rgba(61,186,110,0.08)', border: '1px solid rgba(61,186,110,0.2)' }}
              >
                <div className="flex items-center justify-between">
                  <span style={{ color: 'var(--g-green)' }}>
                    🔒 Демо-режим
                  </span>
                  <button
                    onClick={() => setShowCode(!showCode)}
                    className="text-xs underline"
                    style={{ color: 'var(--g-text-dim)' }}
                  >
                    {showCode ? 'скрыть' : 'показать код'}
                  </button>
                </div>
                {showCode && (
                  <p className="mt-1 text-xl font-mono font-bold" style={{ color: 'var(--g-green)' }}>
                    {sentCode}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--g-text-dim)' }}>
                  6-значный код
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 rounded-xl text-2xl font-mono text-center tracking-widest outline-none transition-all"
                  style={{
                    background: 'var(--g-surface)',
                    border: '1px solid var(--g-border)',
                    color: 'var(--g-text)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--g-green)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--g-border)')}
                  onKeyDown={(e) => e.key === 'Enter' && handleCodeSubmit()}
                  autoFocus
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                onClick={handleCodeSubmit}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: 'var(--g-green)', color: '#fff' }}
              >
                Подтвердить
              </button>

              <button
                onClick={() => setStep('phone')}
                className="w-full py-2 text-sm"
                style={{ color: 'var(--g-text-dim)' }}
              >
                ← Изменить данные
              </button>
            </div>
          )}

          {step === 'register' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--g-text)' }}>
                  Ваше имя
                </h2>
                <p className="text-sm" style={{ color: 'var(--g-text-dim)' }}>
                  Как вас будут видеть другие пользователи
                </p>
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--g-text-dim)' }}>
                  Имя и фамилия
                </label>
                <div className="relative">
                  <Icon name="User" size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--g-text-faint)' }} />
                  <input
                    type="text"
                    placeholder="Иван Иванов"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: 'var(--g-surface)',
                      border: '1px solid var(--g-border)',
                      color: 'var(--g-text)',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--g-green)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--g-border)')}
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleRegisterSubmit()}
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                onClick={handleRegisterSubmit}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: 'var(--g-green)', color: '#fff' }}
              >
                Далее →
              </button>
            </div>
          )}

          {step === 'username' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--g-text)' }}>
                  Создайте @адрес
                </h2>
                <p className="text-sm" style={{ color: 'var(--g-text-dim)' }}>
                  По нему вас смогут найти другие пользователи
                </p>
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--g-text-dim)' }}>
                  @username
                </label>
                <div className="relative">
                  <span
                    className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold"
                    style={{ color: 'var(--g-green)' }}
                  >
                    @
                  </span>
                  <input
                    type="text"
                    placeholder="ivan_ivanov"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace('@', '').replace(/[^a-zA-Z0-9_]/g, ''))}
                    className="w-full pl-8 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: 'var(--g-surface)',
                      border: '1px solid var(--g-border)',
                      color: 'var(--g-text)',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--g-green)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--g-border)')}
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleUsernameSubmit()}
                  />
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--g-text-faint)' }}>
                  Только латинские буквы, цифры и _ (мин. 3 символа)
                </p>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                onClick={handleUsernameSubmit}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: 'var(--g-green)', color: '#fff' }}
              >
                Войти в Гылекор 🚀
              </button>
            </div>
          )}
        </div>

        {/* Steps indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {(['phone', 'code', 'register', 'username'] as AuthStep[]).map((s, i) => (
            <div
              key={s}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: step === s ? '24px' : '6px',
                background: step === s ? 'var(--g-green)' : 'var(--g-border)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
