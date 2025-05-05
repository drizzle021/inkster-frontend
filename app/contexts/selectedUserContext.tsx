import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the User type
interface UserType {
  id: number;
  username: string;
  email: string;
  profile_picture: string;
  banner: string;
  followers: number;
  following: number;
  posts: any[];
  tags: string[];
  role: string;
}

interface SelectedUserContextType {
  selectedUser: UserType | null;
  setSelectedUser: (user: UserType | null) => void;
  currentUser: UserType | null;
  setCurrentUser: (user: UserType | null) => void;
}

// Create context
const SelectedUserContext = createContext<SelectedUserContextType | undefined>(undefined);

// Provider component
export const SelectedUserProvider = ({ children }: { children: ReactNode }) => {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  return (
    <SelectedUserContext.Provider value={{ selectedUser, setSelectedUser, currentUser, setCurrentUser }}>
      {children}
    </SelectedUserContext.Provider>
  );
};

// Custom hook
export const useSelectedUser = () => {
  const context = useContext(SelectedUserContext);
  if (!context) {
    throw new Error('useSelectedUser must be used within a SelectedUserProvider');
  }
  return context;
};
