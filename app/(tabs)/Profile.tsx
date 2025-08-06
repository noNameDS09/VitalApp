import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'expo-router';
// import './global.css'; // Ensure NativeWind is configured and this is imported

interface TokenPayload {
  name: string;
  email: string;
  exp: number;
  iat: number;
}

const Settings = () => {
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync('access_token');
      if (!token) {
        router.replace('/Login');
        return;
      }

      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setName(decoded.name || decoded.email);
      } catch (err) {
        console.error('Invalid token:', err);
        router.replace('/Login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('access_token');
    router.replace('/Login');
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0C182F]">
        <ActivityIndicator size="large" color="#00BFFF" />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center px-5 bg-[#0C182F]">
      <Text className="text-2xl font-semibold mb-2 text-[#E0E3E6]">Welcome</Text>
      <Text className="text-xl text-[#00BFFF] mb-10">{name}</Text>

      <TouchableOpacity
        className="bg-[#E53935] px-6 py-3 rounded-lg"
        onPress={handleLogout}
      >
        <Text className="text-white font-semibold text-base">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;
