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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { logout } from "./utils/databaseHelper";
import { AppState, Pressable } from "react-native";
import LockScreen from "./screens/lockScreen";
import { useState, useRef, useEffect } from "react";

const Stack = createNativeStackNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const authCtx = React.useContext(AuthContext);

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
  }, [auth, auth?.currentUser?.emailVerified]);

  const [isInactive, setIsInactive] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIsInactive(true);
      console.log("Inactive Triggered: ");
    }, 5000); // 60 seconds
  };

  const handleUserActivity = () => {
    setIsInactive(false); // Reset inactivity
    resetTimer(); // Restart the timer
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active" && appState !== "active") {
        resetTimer(); // Restart the timer when app becomes active
      }
      setAppState(nextAppState);
    });

    // Initialize the timer
    resetTimer();

    return () => {
      subscription.remove();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [appState]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <AuthProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={({ route, navigation }) => ({
                headerShadowVisible: false,
                headerStyle: { backgroundColor: Colors.primary },
                headerTitle: () => <CustomHeader />,
                headerRight: () => {
                  if (route.name !== "Login") {
                    return (
                      <Pressable
                        onPress={() => {
                          async function signOut() {
                            result = await logout();
                            if (result) {
                              let currentScreen = navigation
                                .getState()
                                .routes.slice(-1)[0];
                              if (currentScreen.name !== "Home") {
                                //Switch to Home before it gets replaced
                                navigation.replace("Home");
                              }
                            }
                          }
                          signOut();
                        }}
                      >
                        <MaterialCommunityIcons
                          size={24}
                          name={"logout-variant"}
                          color={Colors.black}
                        />
                      </Pressable>
                    );
                  }
                  return null;
                },
              })}
            >
              <Stack.Screen name="Lock" component={LockScreen} />
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
              <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </AuthProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
