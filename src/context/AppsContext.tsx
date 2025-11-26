import {
  createContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface AppsContextType {
  loaded: boolean;
}

export const AppsContext = createContext<AppsContextType | undefined>(undefined);

export const AppsProvider = ({ children }: { children: ReactNode }) => {
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    const handleLoad = () => setLoaded(true);

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return (
    <AppsContext.Provider value={{ loaded }}>
      {children}
    </AppsContext.Provider>
  );
}
