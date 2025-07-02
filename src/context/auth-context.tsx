'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// La funcionalidad de Firebase ha sido eliminada. Este es un mock para prevenir errores de compilación.
type User = object | null;

interface AuthContextType {
  user: User;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    console.warn("La funcionalidad de inicio de sesión ha sido eliminada.");
  };

  const logout = async () => {
    console.warn("La funcionalidad de inicio de sesión ha sido eliminada.");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Como el AuthProvider ya no se usa en el layout, cualquier llamada a useAuth fallaría.
    // Devolvemos un mock para que los componentes que aún lo usan (aunque no deberían) no rompan la compilación.
    return {
      user: null,
      loading: false,
      login: async () => console.warn("La funcionalidad de inicio de sesión ha sido eliminada."),
      logout: async () => console.warn("La funcionalidad de inicio de sesión ha sido eliminada."),
    };
  }
  return context;
};
