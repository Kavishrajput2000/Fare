'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

type AuthContextType = {
  isAuthOpen: boolean;
  openAuth: () => void;
  closeAuth: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const openAuth = () => setIsAuthOpen(true);
  const closeAuth = () => setIsAuthOpen(false);

  return (
    <AuthContext.Provider value={{ isAuthOpen, openAuth, closeAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily use the context
export const useAuthModal = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthProvider');
  }
  return context;
};