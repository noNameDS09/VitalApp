import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import ip from '@/lib/url';

export default function LoginScreen() {
  const router = useRouter();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`http://${ip}:3000/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      if (!data.access_token) {
        setError('No access token returned');
        setLoading(false);
        return;
      }

      // Save token securely
      await SecureStore.setItemAsync('access_token', data.access_token);

      // Redirect to dashboard
      router.replace('/(tabs)/Dashboard');
    } catch (err) {
      console.error(err);
      setError('Network or server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-3xl font-bold text-blue-600 mb-6">Staff Login</Text>

      <TextInput
        placeholder="Email"
        value={form.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
        className="w-full px-4 py-3 border rounded-md mb-4 text-black bg-white"
        placeholderTextColor="#888"
      />

      <TextInput
        placeholder="Password"
        value={form.password}
        onChangeText={(text) => handleChange('password', text)}
        secureTextEntry
        className="w-full px-4 py-3 border rounded-md mb-4 text-black bg-white"
        placeholderTextColor="#888"
      />

      {error !== '' && (
        <Text className="text-red-500 mb-4 text-sm text-center">{error}</Text>
      )}

      <TouchableOpacity
        className={`w-full py-3 rounded-md bg-blue-600 ${loading ? 'opacity-50' : ''}`}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-medium">Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
