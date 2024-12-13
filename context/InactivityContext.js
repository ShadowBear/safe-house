import { createContext, useState, useRef } from "react";

export const InactivityContext = createContext({
  previousRoute: null,
  setPreviousRoute: () => {},
});

export const InactivityProvider = ({ children, navigationRef }) => {
  const [previousRoute, setPreviousRoute] = useState(null);
  const timeRef = useRef(null);

  const resetTimer = () => {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
    }
    timeRef.current = setTimeout(() => {
      const currentRoute = navigationRef.current.getCurrentRoute();
      setPreviousRoute(currentRoute?.name);
      navigationRef.current.navigate("Lock");
    }, 60000);
  };

  const handleUnlock = () => {
    if (previousRoute) {
      navigationRef.current.navigate(previousRoute);
    }
  };

  return (
    <InactivityContext.Provider value={{ resetTimer, handleUnlock }}>
      {children}
    </InactivityContext.Provider>
  );
};
