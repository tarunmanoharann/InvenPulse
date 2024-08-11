import { googleLogout } from '@react-oauth/google';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { UserContext, UserContextType } from './UserContext';
interface User {
  name: string;
  email: string;
  picture: string;
}

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  // Initialize user state from localStorage
  const [user, setUser] = useState<User>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : { name: '', email: '', picture: '' };
  });

  const logout = () => {
    if (user.picture.includes("google")){
      googleLogout();
    }
    setUser({ name: '', email: '', picture: '' });
    localStorage.removeItem('user');
  };

  // Save user to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const contextValue = useMemo<UserContextType>(() => ({
    user,
    setUser,
    logout,
  }), [user]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}
