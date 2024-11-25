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
import { Pressable } from "react-native";

const Stack = createNativeStackNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const authCtx = React.useContext(AuthContext);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("myUser", user);
        authCtx.setUser({ user: user.email, password: null });
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
    return unsubscribe;
  }, []);

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
