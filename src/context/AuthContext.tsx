import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "cliente" | "vendedor" | "entregador";

interface User {
  id: string;
  tipo: UserRole;
  name: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  login: (tipo: UserRole, id?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (tipo: UserRole, id: string = "DRIVER-1") => {
    setUser({ id, tipo, name: tipo.charAt(0).toUpperCase() + tipo.slice(1) });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
