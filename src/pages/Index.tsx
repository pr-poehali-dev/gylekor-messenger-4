import { useState } from 'react';
import AuthScreen from '@/components/messenger/AuthScreen';
import MessengerApp from '@/components/messenger/MessengerApp';
import { AppState } from '@/components/messenger/types';

export default function Index() {
  const [appState, setAppState] = useState<AppState>({
    isAuthenticated: false,
    currentUser: null,
  });

  if (!appState.isAuthenticated) {
    return (
      <AuthScreen
        onAuth={(user) => setAppState({ isAuthenticated: true, currentUser: user })}
      />
    );
  }

  return (
    <MessengerApp
      user={appState.currentUser!}
      onLogout={() => setAppState({ isAuthenticated: false, currentUser: null })}
    />
  );
}
