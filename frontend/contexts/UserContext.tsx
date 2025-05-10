'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface UserContextProps {
  isAuthenticated: boolean;
  userProfile: any | null;
  updateProfile: (data: any) => Promise<void>;
}

const UserContext = createContext<UserContextProps>({
  isAuthenticated: false,
  userProfile: null,
  updateProfile: async () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any | null>(null);

  useEffect(() => {
    if (user) {
      // We would typically fetch additional user data from our database here
      // For now, we'll just use the basic auth user data
      setUserProfile({
        id: user.uid,
        email: user.email,
        name: user.displayName,
        role: user.roles[0],
        preferences: {
          notifications: true,
          theme: 'light',
        },
      });
    } else {
      setUserProfile(null);
    }
  }, [user]);

  const updateProfile = async (data: any) => {
    try {
      // Here we would typically call an API to update the user's profile
      // For now, we'll just update the local state
      setUserProfile(prev => ({
        ...prev,
        ...data,
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        isAuthenticated: !!user,
        userProfile,
        updateProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}; 