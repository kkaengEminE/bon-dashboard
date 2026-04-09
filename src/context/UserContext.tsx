"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface UserContextType {
  userName: string;
  setUserName: (name: string) => void;
  showNameModal: boolean;
  setShowNameModal: (show: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userName, setUserNameState] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("bon-user-name");
    if (stored) {
      setUserNameState(stored);
    } else {
      setShowNameModal(true);
    }
    setLoaded(true);
  }, []);

  const setUserName = (name: string) => {
    setUserNameState(name);
    localStorage.setItem("bon-user-name", name);
    document.cookie = `bon-user-name=${encodeURIComponent(name)}; path=/; max-age=31536000`;
  };

  if (!loaded) return null;

  return (
    <UserContext.Provider
      value={{ userName, setUserName, showNameModal, setShowNameModal }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
