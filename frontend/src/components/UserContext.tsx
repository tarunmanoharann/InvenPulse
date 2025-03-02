import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

interface User {
  email: string;
  role: string;
  uid?: string;
  displayName?: string;
}

interface UserContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  loading: boolean;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  loading: true
});

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // If we have demo users with specific roles
        if (firebaseUser.email === 'admin@gmail.com') {
          setUser({
            email: 'admin@gmail.com',
            role: 'admin',
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || 'Admin'
          });
        } else {
          setUser({
            email: firebaseUser.email || '',
            role: 'user', // Default role, you might fetch this from your database
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || ''
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [auth]);

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      isAuthenticated: !!user,
      loading
    }}>
      {children}
    </UserContext.Provider>
  );
};