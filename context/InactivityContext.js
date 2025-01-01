import { createContext, useState, useRef, useMemo } from "react";

const INACTIVITYTIMEOUT = 60000;

export const InactivityContext = createContext({
  previousRoute: null,
  setPreviousRoute: () => {},
});

export const InactivityProvider = ({ children, navigationRef }) => {
  const [previousRoute, setPreviousRoute] = useState(null);
  const timeRef = useRef(null);

  const resetTimer = useMemo(() => {
    return () => {
      if (timeRef.current) {
        clearTimeout(timeRef.current);
      }
      timeRef.current = setTimeout(() => {
        const currentRoute = navigationRef?.current?.getCurrentRoute();
        setPreviousRoute(currentRoute?.name);
        navigationRef?.current?.navigate("Lock");
      }, INACTIVITYTIMEOUT);
    };
  }, [timeRef?.current, navigationRef?.current]);

  const handleUnlock = useMemo(() => {
    return () => {
      if (previousRoute) {
        navigationRef?.current?.navigate(previousRoute);
      } else {
        navigationRef?.current?.navigate("Home");
      }
    };
  }, [navigationRef?.current, previousRoute]);

  const setClearTimeout = useMemo(() => {
    return () => {
      if (timeRef?.current) {
        clearTimeout(timeRef.current);
      }
      timeRef.current = null;
    };
  }, [timeRef?.current]);

  return (
    <InactivityContext.Provider
      value={{ resetTimer, handleUnlock, setPreviousRoute, setClearTimeout }}
    >
      {children}
    </InactivityContext.Provider>
  );
};
