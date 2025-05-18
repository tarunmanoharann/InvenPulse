'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  // Add any additional user profile fields here
} | null;

interface UserContextType {
  profile: UserProfile;
  isLoading: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize profile from auth user
  useEffect(() => {
    if (user) {
      setProfile(user);
    }
  }, [user]);

  // Fetch user profile from API
  const refreshProfile = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('userToken');
      
      if (!token) return;
      
      const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const data = await response.json();
      setProfile(data);
      
      // Update localStorage with fresh data
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Profile refreshed');
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to refresh profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!isAuthenticated || !profile) return;
    
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('userToken');
      
      if (!token) return;
      
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const updatedData = await response.json();
      setProfile(updatedData);
      
      // Update localStorage with fresh data
      localStorage.setItem('userInfo', JSON.stringify(updatedData));
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating user profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        profile,
        isLoading,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
} 