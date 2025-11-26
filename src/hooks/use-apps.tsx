import { useContext } from "react";
import { AppsContext } from "@/context/AppsContext";

export const useApps = () => {
  const ctx = useContext(AppsContext);
    if (!ctx) throw new Error("useApps must be used inside <AppsProvider>");
    return ctx;
};