import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect } from "react";
import { AppState } from "react-native";
import { InactivityContext } from "../context/InactivityContext";

const AppStateHandler = ({ navigationRef }) => {
  const { setPreviousRoute } = useContext(InactivityContext);

  useEffect(() => {
    const handleNextState = (nextState) => {
      if (nextState === "background") {
        const previousRoute = navigationRef?.current?.getCurrentRoute();
        if (previousRoute?.name !== "Lock")
          setPreviousRoute(previousRoute?.name);
        navigationRef?.current?.navigate("Lock");
      }
    };
    const subscribe = AppState.addEventListener("change", handleNextState);
    return () => {
      subscribe.remove();
    };
  }, [navigationRef?.current]);

  return null;
};

export default AppStateHandler;
