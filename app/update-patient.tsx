import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router'; // Assuming expo-router for navigation
import { ArrowLeft } from 'lucide-react-native'; // Optional back icon
interface PatientOption {
  id: string;
  full_name: string;
}
import ip from '@/lib/url';

const UpdatePatientHistory = () => {
  const router = useRouter();
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [form, setForm] = useState({ diagnosis: '', treatment: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch patient list on mount
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError('');
      try {
        const token = await SecureStore.getItemAsync('access_token');
        if (!token) {
          setError('You must be logged in');
          router.replace('/Login');
          return;
        }

        // Replace with your actual API endpoint for listing patients
        const response = await fetch(`http://${ip}:3000/api/patient/list`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load patients');
        }

        if (Array.isArray(data)) {
          setPatients(data);
          if (data.length > 0) {
            setSelectedPatientId(data[0].id); // Select first patient by default
          }
        } else {
          setError('Failed to load patients: Invalid data format');
        }

      } catch (err: any) {
        console.error('Error fetching patients:', err);
        setError(err.message || 'Something went wrong fetching patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    if (!selectedPatientId) {
      setError('Please select a patient.');
      setLoading(false);
      return;
    }
    if (!form.diagnosis && !form.treatment) {
      setError('Please enter a diagnosis or treatment.');
      setLoading(false);
      return;
    }

    try {
      const token = await SecureStore.getItemAsync('access_token');
      if (!token) {
        setError('You must be logged in');
        setLoading(false);
        router.replace('/Login');
        return;
      }

      const res = await fetch('http://172.20.184.127/api/patient/update', { // Adjust API endpoint if needed
        method: 'POST', // Changed to PUT as per typical update operations
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          patient_id: selectedPatientId,
          diagnosis: form.diagnosis,
          treatment: form.treatment
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to update patient history');
      } else {
        setSuccess('Medical history updated successfully!');
        setForm({ diagnosis: '', treatment: '' }); // Clear form
        // Optionally, refresh the patient list or specific patient data if needed
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong during update');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#00BFFF" />
        <Text style={styles.loadingText}>Loading patients...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.container}>
        <TouchableOpacity onPress={() => router.replace('/Dashboard')} style={styles.backButton}>
  <ArrowLeft color="#E0E3E6" size={24} />
  <Text style={styles.backButtonText}>Back</Text>
</TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Update Medical History</Text>

        {/* Patient Select */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Patient</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedPatientId}
              onValueChange={(itemValue) => setSelectedPatientId(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {patients.length > 0 ? (
                patients.map((p) => (
                  <Picker.Item key={p.id} label={p.full_name} value={p.id} />
                ))
              ) : (
                <Picker.Item label="No patients available" value="" />
              )}
            </Picker>
          </View>
        </View>

        {/* Diagnosis Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Diagnosis</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => handleChange('diagnosis', text)}
            value={form.diagnosis}
            placeholder="e.g. Flu, Fever"
            placeholderTextColor="#7F8C8D"
          />
        </View>

        {/* Treatment Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Treatment</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => handleChange('treatment', text)}
            value={form.treatment}
            placeholder="e.g. Paracetamol 500mg"
            placeholderTextColor="#7F8C8D"
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
        {success && <Text style={styles.successText}>{success}</Text>}

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Saving...' : 'Save History'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0C182F', // Deep Midnight Blue
  },
  loadingText: {
    marginTop: 10,
    color: '#E0E3E6', // Light Gray
    fontSize: 16,
  },
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

export default UpdatePatientHistory;
