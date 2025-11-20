import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "recorded":
      return "bg-green-500/10 text-green-700 dark:text-green-400";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const capitalize = (sentence: string, firstWordOnly?: boolean) => {
  return sentence
    .split(" ")
    .map((word: string, idx: number) => !firstWordOnly || idx === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word)
    .join(" ");
};

export const getMockUser = (role = 'contributor') => {
  return {
    id: `user_${Date.now()}`,
    name: 'Demo User',
    email: 'demo@rana.id',
    role,
    xp: role === 'contributor' ? 250 : 0,
    badges: role === 'contributor' ? ['Pemula', 'Kontributor Aktif'] : [],
    validationCount: role === 'validator' ? 127 : 0,
    accuracy: role === 'validator' ? 94.5 : 0,
    avatar: "",
  };
};

