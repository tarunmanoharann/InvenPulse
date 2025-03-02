// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { firebaseAuthService } from '../services/firebaseAuthService';

interface AuthUser {
  email: string | null;
  uid: string;
  displayName: string | null;
  role: string;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  register: (email: string, password: string, displayName: string, phoneNumber?: string) => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get additional user data from Firestore
        try {
          const userData = await firebaseAuthService.getUserData(user.uid);
          setCurrentUser({
            email: user.email,
            uid: user.uid,
            displayName: user.displayName,
            role: userData?.role || 'user'
          });
        } catch (error) {
          console.error("Error getting user data:", error);
          setCurrentUser({
            email: user.email,
            uid: user.uid,
            displayName: user.displayName,
            role: 'user' // Default role
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  const value = {
    currentUser,
    loading,
    login: firebaseAuthService.loginWithEmail.bind(firebaseAuthService),
    loginWithGoogle: firebaseAuthService.loginWithGoogle.bind(firebaseAuthService),
    register: firebaseAuthService.registerWithEmail.bind(firebaseAuthService),
    logout: firebaseAuthService.logout.bind(firebaseAuthService),
    resetPassword: firebaseAuthService.resetPassword.bind(firebaseAuthService)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};