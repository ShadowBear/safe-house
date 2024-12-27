import { createContext, useState, useRef } from "react";

const INACTIVITYTIMEOUT = 60000;

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
      const currentRoute = navigationRef?.current?.getCurrentRoute();
      setPreviousRoute(currentRoute?.name);
      navigationRef?.current?.navigate("Lock");
    }, INACTIVITYTIMEOUT);
  };

  const handleUnlock = () => {
    if (previousRoute) {
      navigationRef.current.navigate(previousRoute);
    } else {
      navigationRef.current.navigate("Home");
    }
  };

  const setClearTimeout = () => {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
    }
    timeRef.current = null;
  };

  return (
    <InactivityContext.Provider
      value={{ resetTimer, handleUnlock, setPreviousRoute, setClearTimeout }}
    >
      {children}
    </InactivityContext.Provider>
  );
};
