import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AUTH_STORAGE_KEY = 'auth_session';

export function useAuth() {
  const [session, setSession] = useState<string | null>(() => {
    return localStorage.getItem(AUTH_STORAGE_KEY);
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      localStorage.setItem(AUTH_STORAGE_KEY, session);
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [session]);

  const login = (sessionToken: string) => {
    setSession(sessionToken);
    notifications.show({
      title: 'Success',
      message: 'Successfully logged in',
      color: 'green',
    });
    navigate('/dashboard');
  };

  const logout = () => {
    setSession(null);
    notifications.show({
      title: 'Success',
      message: 'Successfully logged out',
      color: 'blue',
    });
    navigate('/auth');
  };

  return {
    session,
    isAuthenticated: !!session,
    login,
    logout,
  };
}
