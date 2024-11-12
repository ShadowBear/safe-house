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

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ headerTitle: () => <CustomHeader /> }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="PwDetails" component={PwDetailsScreen} />
            <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
