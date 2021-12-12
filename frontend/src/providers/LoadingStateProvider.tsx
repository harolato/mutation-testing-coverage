import { createContext, useContext, useState } from "react";
import React from "react";

const LoadingContext = React.createContext({
  loading: true,
  setLoading: null,
});

export const LoadingStateProvider = ({children}: { children: any }) => {
  const [loading, setLoading] = useState(false);
  const value = { loading, setLoading };
  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
}