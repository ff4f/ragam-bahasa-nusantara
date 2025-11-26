import {
  createContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { STORAGE_KEY } from "@/lib/constants";
import authService from "@/services/auth.service";

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'contributor' | 'validator';
  is_active: boolean;
  created_at: string;
  // Stats and gamification fields - optional as backend may not return them initially
  points?: number;
  coins?: number;
  badges?: any[];
  level?: number;
  nextLevel?: number;
  // Legacy/optional fields for compatibility
  data?: string;
  xp?: number;
  validationCount?: number;
  accuracy?: number;
  avatar?: string;
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
      localStorage.setItem(STORAGE_KEY.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY.USER);
    }
  }, [user]);

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY.USER);
    }
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY.USER, JSON.stringify(updatedUser));
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}
