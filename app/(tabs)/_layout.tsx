import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react'; // React needs to be imported for JSX

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#00BFFF', // Cyan Blue for active tab
        tabBarInactiveTintColor: '#7F8C8D', // Muted Gray for inactive tabs
        tabBarStyle: {
          backgroundColor: '#0C182F', // Deep Midnight Blue for tab bar background
          borderTopColor: '#0C182F', // Charcoal Gray for top border
          height: 50, // Adjust height as needed
        },
        headerShown: false, // Hide the header if you're using a custom one or don't need it
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
