import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the Post type
interface PostType {
  id: number;
  title: string;
  caption: string;
  description: string;
  post_type: string;
  created_at: string;
  author: {
    username: string;
    profile_picture: string;
    id: number;
  };
  tags: string[];
  likes: number;
  is_liked: boolean;
  is_saved: boolean;
  is_spoilered: boolean;
  software: string;
  images?: { id: number; position: number; image_name: string }[];
  thumbnail: string;
}

interface SelectedPostContextType {
  selectedPost: PostType | null;
  setSelectedPost: (post: PostType | null) => void;
}

// Create context
const SelectedPostContext = createContext<SelectedPostContextType | undefined>(undefined);

// Provider component
export const SelectedPostProvider = ({ children }: { children: ReactNode }) => {
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);

  return (
    <SelectedPostContext.Provider value={{ selectedPost, setSelectedPost }}>
      {children}
    </SelectedPostContext.Provider>
  );
};

// Custom hook
export const useSelectedPost = () => {
  const context = useContext(SelectedPostContext);
  if (!context) {
    throw new Error('useSelectedPost must be used within a SelectedPostProvider');
  }
  return context;
};
