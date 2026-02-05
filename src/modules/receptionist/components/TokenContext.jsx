import { createContext, useState, useEffect ,useContext } from "react";

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [tokens, setTokens] = useState(() => {
    try {
      const raw = localStorage.getItem("tokens");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("Failed to load tokens from localStorage", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("tokens", JSON.stringify(tokens));
    } catch (e) {
      console.warn("Failed to save tokens to localStorage", e);
    }
  }, [tokens]);

  const value = { tokens, setTokens };

  return (
    <TokenContext.Provider value={value}>
      {children}
    </TokenContext.Provider>
  );
};

export  const useTokens = () => {
  const context = useContext(TokenContext);
  return context || { tokens: [], setTokens: () => {} };
};
