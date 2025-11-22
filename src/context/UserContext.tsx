import {
  createContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { STORAGE_USER_KEY } from "@/lib/constants";
import authService from "@/services/auth.service";

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'contributor' | 'validator';
  is_active: boolean;
  created_at: string;
  // Legacy fields for compatibility with existing components
  data?: string;
  xp?: number;
  badges?: any[];
  validationCount?: number;
  accuracy?: number;
  avatar?: string;
  level?: number;
  nextXp?: number;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from backend if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Failed to load user:", error);
          authService.clearToken();
        }
      }
    };

    loadUser();
  }, []);

  // Persist to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_USER_KEY);
    }
  }, [user]);

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem(STORAGE_USER_KEY);
    }
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updatedUser));
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}
