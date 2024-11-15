import { View, Text } from "react-native";
import React, { createContext, useReducer, useState } from "react";

export const AuthContext = createContext({
  user: null,
  setUser: (id) => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const value = {
    user: user,
    setUser: setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
