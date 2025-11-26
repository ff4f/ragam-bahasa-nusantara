import {
  createContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface AppsContextType {
  loaded: boolean;
  animated: boolean;
  setAnimated: (param: any) => void;
}

export const AppsContext = createContext<AppsContextType | undefined>(undefined);

export const AppsProvider = ({ children }: { children: ReactNode }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [animated, setAnimated] = useState<boolean>(false);

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
    <AppsContext.Provider value={{ loaded, animated, setAnimated }}>
      {children}
    </AppsContext.Provider>
  );
}
