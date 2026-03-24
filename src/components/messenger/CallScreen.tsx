import { useState, useEffect } from 'react';
import { Chat, User } from './types';
import { Avatar } from './Sidebar';
import Icon from '@/components/ui/icon';

interface Props {
  chat: Chat;
  callType: 'audio' | 'video';
  currentUser: User;
  onEnd: () => void;
}

export default function CallScreen({ chat, callType, currentUser, onEnd }: Props) {
  const [duration, setDuration] = useState(0);
  const [status, setStatus] = useState<'connecting' | 'ringing' | 'active'>('connecting');
  const [muted, setMuted] = useState(false);
  const [speakerOff, setSpeakerOff] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setStatus('ringing'), 800);
    const timer2 = setTimeout(() => setStatus('active'), 2500);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  useEffect(() => {
    if (status !== 'active') return;
    const interval = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(interval);
  }, [status]);

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const statusText = status === 'connecting' ? 'Подключение...' : status === 'ringing' ? 'Вызов...' : formatDuration(duration);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-between z-50 animate-fade-in"
      style={{
        background: callType === 'video'
          ? 'linear-gradient(135deg, #0a1a0f 0%, #0e2018 50%, #081510 100%)'
          : 'linear-gradient(135deg, #0a1510 0%, #0e1f18 100%)',
      }}
    >
      {/* Top info */}
      <div className="w-full flex items-center justify-between px-6 pt-8">
        <div
          className="px-3 py-1.5 rounded-full flex items-center gap-2 text-sm"
          style={{ background: 'rgba(61,186,110,0.15)', color: 'var(--g-green)' }}
        >
          <Icon name={callType === 'video' ? 'Video' : 'Phone'} size={14} />
          {callType === 'video' ? 'Видеозвонок' : 'Аудиозвонок'}
        </div>
        <div
          className="text-sm px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)' }}
        >
          Гылекор
        </div>
      </div>

      {/* Avatar / video area */}
      <div className="flex flex-col items-center">
        <div className="relative mb-6">
          <div
            className="rounded-full animate-pulse-green"
            style={{
              padding: 4,
              background: status === 'active' ? 'rgba(61,186,110,0.3)' : 'transparent',
              transition: 'background 0.5s',
            }}
          >
            <Avatar name={chat.name} size={120} />
          </div>
          {status === 'ringing' && (
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-30"
              style={{ background: 'var(--g-green)', transform: 'scale(1.3)' }}
            />
          )}
        </div>

        <h2 className="text-2xl font-bold mb-2" style={{ color: '#fff' }}>
          {chat.name}
        </h2>
        <p
          className="text-base"
          style={{ color: status === 'active' ? 'var(--g-green)' : 'rgba(255,255,255,0.5)' }}
        >
          {statusText}
        </p>

        {callType === 'video' && status === 'active' && (
          <div
            className="mt-4 w-32 h-20 rounded-xl overflow-hidden flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <div className="flex flex-col items-center gap-1">
              <Icon name="VideoOff" size={20} style={{ color: 'rgba(255,255,255,0.3)' }} />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Ваша камера</span>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="w-full px-8 pb-12">
        <div className="flex justify-center gap-5 mb-6">
          <button
            onClick={() => setMuted(!muted)}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{
              background: muted ? 'rgba(255,80,80,0.2)' : 'rgba(255,255,255,0.1)',
              color: muted ? '#ff5050' : '#fff',
              border: `1px solid ${muted ? 'rgba(255,80,80,0.3)' : 'rgba(255,255,255,0.15)'}`,
            }}
            title={muted ? 'Включить микрофон' : 'Выключить микрофон'}
          >
            <Icon name={muted ? 'MicOff' : 'Mic'} size={22} />
          </button>

          {callType === 'video' && (
            <button
              onClick={() => setCameraOff(!cameraOff)}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90"
              style={{
                background: cameraOff ? 'rgba(255,80,80,0.2)' : 'rgba(255,255,255,0.1)',
                color: cameraOff ? '#ff5050' : '#fff',
                border: `1px solid ${cameraOff ? 'rgba(255,80,80,0.3)' : 'rgba(255,255,255,0.15)'}`,
              }}
            >
              <Icon name={cameraOff ? 'VideoOff' : 'Video'} size={22} />
            </button>
          )}

          <button
            onClick={() => setSpeakerOff(!speakerOff)}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{
              background: speakerOff ? 'rgba(255,80,80,0.2)' : 'rgba(255,255,255,0.1)',
              color: speakerOff ? '#ff5050' : '#fff',
              border: `1px solid ${speakerOff ? 'rgba(255,80,80,0.3)' : 'rgba(255,255,255,0.15)'}`,
            }}
          >
            <Icon name={speakerOff ? 'VolumeX' : 'Volume2'} size={22} />
          </button>
        </div>

        {/* End call */}
        <div className="flex justify-center">
          <button
            onClick={onEnd}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            style={{ background: '#ef4444', color: '#fff', boxShadow: '0 0 20px rgba(239,68,68,0.4)' }}
          >
            <Icon name="PhoneOff" size={26} />
          </button>
        </div>
      </div>
    </div>
  );
}
