import { View, Text } from "react-native";
import React, { createContext, useReducer, useState } from "react";

export const AuthContext = createContext({
  user: null,
  setUser: (id) => {},
  key: null,
  setKey: (key) => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [key, setKey] = useState(null);

  const value = {
    user: user,
    setUser: setUser,
    key: key,
    setKey: setKey,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
