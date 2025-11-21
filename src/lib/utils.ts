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
      xp: 0,
      badges: [],
      validationCount: 127,
      accuracy: 94.5,
      avatar: "",
      level: 1,
      nextXp: 100,
    },
    "contributor@gmail.com": {
      id: `contributor_${Date.now()}`,
      name: 'Contributor User',
      email,
      role: 'contributor',
      xp: 250,
      badges: ['Pemula', 'Kontributor Aktif'],
      validationCount: 0,
      accuracy: 0,
      avatar: "",
      level: 2,
      nextXp: 300,
    },
  };
  return users[email];
};

export const validateForm = (formData: any) => {
  const { province, language, text, textTranslation, sentence, sentenceTranslation, textAudio, sentenceAudio } = formData;
  return province.length > 0 && language && text && textTranslation && sentence && sentenceTranslation && textAudio && sentenceAudio;
};
