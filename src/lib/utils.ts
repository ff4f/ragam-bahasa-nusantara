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

export const getMockUser = (email: string) => {
  const users = {
    "validator@gmail.com": {
      id: `validator_${Date.now()}`,
      name: 'Validator User',
      email,
      role: 'validator',
      points: 0,
      coins: 0,
      badges: [],
      validationCount: 127,
      notValidatedCount: 50,
      accuracy: 94.5,
      avatar: "",
      level: 1,
      nextLevel: 100,
    },
    "contributor@gmail.com": {
      id: `contributor_${Date.now()}`,
      name: 'Contributor User',
      email,
      role: 'contributor',
      points: 250,
      coins: 500000,
      badges: ['Pemula', 'Kontributor Aktif'],
      validationCount: 0,
      accuracy: 0,
      avatar: "",
      level: 2,
      nextLevel: 300,
    },
  };
  return users[email];
};

export const validateForm = (formData: any) => {
  const { province, language, text, textTranslation } = formData;
  return province.length > 0 && language && text && textTranslation;
};

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
