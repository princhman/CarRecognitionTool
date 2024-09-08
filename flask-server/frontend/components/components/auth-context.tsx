"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  email: string;
  name: string;
  user_id: string;
} | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (savedUser && token) {
      fetch('http://127.0.0.1:8080/api/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          if (response.ok) {
            setUser(JSON.parse(savedUser));
          } else {
            logout();
          }
        })
        .catch(() => {
          logout();
        });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);  
        localStorage.setItem('user_id', data.user.user_id);
        console.log(data.user.user_id);

        setUser(data.user); 
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}