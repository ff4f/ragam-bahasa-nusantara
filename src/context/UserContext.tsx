import {
  createContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { STORAGE_USER_KEY } from "@/lib/constants";

export interface User {
  data: string;
  name: string;
  email: string;
  role: string;
  points: number;
  coins: number;
  badges: any[];
  validationCount: number;
  accuracy: number;
  avatar?: string;
  level: number;
  nextLevel: number;
}

interface UserContextType {
  user: User | null;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load saved user when app starts
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_USER_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_USER_KEY);
      }
    }
  }, []);

  // Persist to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_USER_KEY);
    }
  }, [user]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_USER_KEY);
  };

  const updateProfile = (data: User) => {
    setUser(data);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data));
  };

  return (
    <UserContext.Provider value={{ user, logout, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}
