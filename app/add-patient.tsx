import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Picker } from '@react-native-picker/picker'; // For gender selection
import { ArrowLeft } from 'lucide-react-native'; // Optional back icon
import ip from '@/lib/url';
const CreatePatientPage = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    date_of_birth: '',
    gender: '',
    address: '',
    contact_number: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    const token = await SecureStore.getItemAsync('access_token');
    if (!token) {
      setError('You must be logged in as a nurse.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://${ip}:3000/api/patient/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create patient');
      } else {
        setSuccess('Patient created successfully!');
        setForm({
          email: '',
          password: '',
          full_name: '',
          date_of_birth: '',
          gender: '',
          address: '',
          contact_number: '',
        });
        Alert.alert('Success', 'Patient created successfully!');
        router.push('/Dashboard'); // Navigate to Dashboard after success
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.container}>
        <TouchableOpacity onPress={() => router.replace('/Dashboard')} style={styles.backButton}>
  <ArrowLeft color="#E0E3E6" size={24} />
  <Text style={styles.backButtonText}>Back</Text>
</TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Create New Patient</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => handleChange('email', text)}
            value={form.email}
            placeholder="patient@example.com"
            placeholderTextColor="#7F8C8D"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => handleChange('password', text)}
            value={form.password}
            placeholder="••••••••"
            placeholderTextColor="#7F8C8D"
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => handleChange('full_name', text)}
            value={form.full_name}
            placeholder="John Doe"
            placeholderTextColor="#7F8C8D"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => handleChange('date_of_birth', text)}
            value={form.date_of_birth}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#7F8C8D"
            keyboardType="numeric" // Suggest numeric for date input
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.gender}
              onValueChange={(itemValue) => handleChange('gender', itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => handleChange('address', text)}
            value={form.address}
            placeholder="123 Main Street"
            placeholderTextColor="#7F8C8D"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => handleChange('contact_number', text)}
            value={form.contact_number}
            placeholder="9876543210"
            placeholderTextColor="#7F8C8D"
            keyboardType="phone-pad"
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
        {success && <Text style={styles.successText}>{success}</Text>}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Creating...' : 'Create Patient'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C182F', // Deep Midnight Blue
    paddingHorizontal: 16,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#273244', // Charcoal Gray
    borderColor: '#444F61', // Dark Blue-Gray
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E0E3E6', // Light Gray
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#E0E3E6', // Light Gray
    marginBottom: 8,
  },
  textInput: {
    height: 50,
    borderColor: '#444F61', // Dark Blue-Gray
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#273244', // Charcoal Gray
    color: '#E0E3E6', // Light Gray for input text
    fontSize: 16,
  },
  pickerContainer: {
    borderColor: '#444F61', // Dark Blue-Gray
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#273244', // Charcoal Gray
  },
  picker: {
    height: 50,
    color: '#E0E3E6', // Light Gray for selected value
  },
  pickerItem: {
    color: '#E0E3E6', // Light Gray for picker items (iOS)
  },
  errorText: {
    color: '#E53935', // Vibrant Red
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  successText: {
    color: '#80E080', // Green
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#00BFFF', // Cyan Blue
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#0C182F', // Deep Midnight Blue (for contrast)
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 20,
},
backButtonText: {
  color: '#E0E3E6',
  fontSize: 16,
  marginLeft: 8,
},

});

export default CreatePatientPage;
