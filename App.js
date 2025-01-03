import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/loginScreen";
import HomeScreen from "./screens/homeScreen";
import PwDetailsScreen from "./screens/pwDetailScreen";
import UserDetailsScreen from "./screens/userDetailsScreen";
import * as React from "react";
import CustomHeader from "./components/header";
import { PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { onAuthStateChanged } from "firebase/auth";
import auth from "./utils/firebaseConfig";
import { Colors } from "./utils/Colors";
import LockScreen from "./screens/lockScreen";
import { useState, useRef, useEffect } from "react";
import { InactivityProvider } from "./context/InactivityContext";
import AppStateHandler from "./utils/appStateHandler";
import HeaderSignout from "./components/headerSignout";
import RegisterDetailsScreen from "./screens/registerDetailsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const navigation = useRef(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Verification State: ", auth?.currentUser?.emailVerified);
      if (user && auth?.currentUser?.emailVerified) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
    return unsubscribe;
  }, [auth, auth?.currentUser?.emailVerified, auth?.currentUser]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <AuthProvider>
          <InactivityProvider navigationRef={navigation}>
            <AppStateHandler navigationRef={navigation} />
            <NavigationContainer ref={navigation}>
              <Stack.Navigator
                screenOptions={({ route, navigation }) => ({
                  headerShadowVisible: false,
                  headerStyle: { backgroundColor: Colors.primary },
                  headerTitle: () => <CustomHeader />,
                  headerRight: () => {
                    return route.name !== "Login" ? <HeaderSignout /> : null;
                  },
                })}
              >
                {loggedIn ? (
                  <Stack.Screen name="Home" component={HomeScreen} />
                ) : (
                  <Stack.Screen
                    options={{ headerStyle: { backgroundColor: Colors.white } }}
                    name="Login"
                    component={LoginScreen}
                  />
                )}
                <Stack.Screen name="PwDetails" component={PwDetailsScreen} />
                <Stack.Screen
                  name="UserDetails"
                  component={UserDetailsScreen}
                />
                <Stack.Screen
                  name="Registration"
                  component={RegisterDetailsScreen}
                  options={{
                    gestureEnabled: false,
                    headerBackVisible: false,
                  }}
                />
                <Stack.Screen
                  name="Lock"
                  component={LockScreen}
                  options={{
                    gestureEnabled: false,
                    headerBackVisible: false,
                  }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </InactivityProvider>
        </AuthProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
