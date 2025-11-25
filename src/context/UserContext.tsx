import {
  createContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { STORAGE_KEY } from "@/lib/constants";

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
    const saved = localStorage.getItem(STORAGE_KEY.USER);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY.USER);
      }
    }
  }, []);

  // Persist to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY.USER);
    }
  }, [user]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY.USER);
  };

  const updateProfile = (data: User) => {
    setUser(data);
    localStorage.setItem(STORAGE_KEY.USER, JSON.stringify(data));
  };

  return (
    <UserContext.Provider value={{ user, logout, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}
