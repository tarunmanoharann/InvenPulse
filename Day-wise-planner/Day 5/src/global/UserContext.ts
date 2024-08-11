import { createContext, Dispatch, SetStateAction } from 'react';

interface User {
  name: string;
  email: string;
  picture: string;
}

export interface UserContextType {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
  logout: () => void;
}

// Create and export UserContext
export const UserContext = createContext<UserContextType | undefined>(undefined);
