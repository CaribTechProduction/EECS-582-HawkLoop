import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStackScreen from './src/src/navigation/HomeStackScreen';
import SavedRoutesScreen from './src/src/screens/SavedRoutesScreen';
import ChatbotScreen from './src/src/screens/ChatbotScreen';
import AccountScreen from './src/src/screens/AccountScreen';
import SettingsScreen from './src/src/screens/SettingsScreen';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color, size }) => {
              if (route.name === 'Home') {
                return <Ionicons name="home" size={size} color={color} />;
              } else if (route.name === 'SavedRoutes') {
                return <MaterialCommunityIcons name="map-marker" size={size} color={color} />;
              } else if (route.name === 'Chatbot') {
                return <FontAwesome5 name="comments" size={size} color={color} />;
              } else if (route.name === 'Account') {
                return <Ionicons name="person" size={size} color={color} />;
              } else if (route.name === 'Settings') {
                return <Ionicons name="settings" size={size} color={color} />;
              }
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeStackScreen} />
          <Tab.Screen name="SavedRoutes" component={SavedRoutesScreen} />
          <Tab.Screen name="Chatbot" component={ChatbotScreen} />
          <Tab.Screen name="Account" component={AccountScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
