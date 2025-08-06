import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StyleSheet, // Import StyleSheet for styling
  Alert, // Import Alert for showing messages
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Picker } from "@react-native-picker/picker";
import { Heart, Atom, Droplet, Bell, User, Sun } from "lucide-react-native"; // Lucide icons for React Native
import { LineChart } from "react-native-chart-kit"; // Charting library for React Native
import ip from "@/lib/url";
// Define the Patient interface based on your API response structure
interface Patient {
  id: number;
  name: string;
  patientId: string;
  age: number;
  room: string;
  admissionDate: string;
  condition: string;
  vitalData: {
    time: string;
    hr: number;
    spo2: number;
    bp_sys: number;
    bp_dia: number;
    // Add other vital signs as they appear in your API response
    temp?: number;
    nidiasabp?: number;
    sysabp?: number;
    diasabp?: number;
    ph?: number;
    paco2?: number;
    pao2?: number;
    platelets?: number;
    map?: number;
    k?: number;
    na?: number;
    fio2?: number;
    gcs?: number;
  }[];
  alerts: {
    id: number;
    message: string;
    timestamp: string;
    severity: 'critical' | 'warning';
  }[];
  vitalCards: {
    name: string;
    value: number | string;
    unit: string;
    icon: string;
    color: string;
    threshold: { critical: number[]; warning: number[] };
  }[];
}

const screenWidth = Dimensions.get("window").width;

// List of all possible vital sign fields from your API
const ALL_VITAL_FIELDS = [
  "hr", "spo2", "bp_sys", "bp_dia", // Core vitals
  "temp", "nidiasabp", "sysabp", "diasabp", "ph", "paco2", "pao2",
  "platelets", "map", "k", "na", "fio2", "gcs"
];

const VitalCard = ({ name, value, unit, icon, color, threshold }) => {
  let IconComponent;
  switch (icon) {
    case 'heart':
      IconComponent = Heart;
      break;
    case 'atom':
      IconComponent = Atom;
      break;
    case 'droplet':
      IconComponent = Droplet;
      break;
    case 'sun':
      IconComponent = Sun;
      break;
    default:
      IconComponent = Heart; // Default icon
  }

  let displayColor = color;
  if (
    name === "Heart Rate" &&
    (typeof value === 'number' && (value < threshold.critical[0] || value > threshold.critical[1]))
  ) {
    displayColor = "#E53935"; // Vibrant Red
  } else if (
    name === "SpO₂" &&
    (typeof value === 'number' && (value < threshold.critical[0] || value > threshold.critical[1]))
  ) {
    displayColor = "#E53935"; // Vibrant Red
  } else if (
    name === "Blood Pressure" &&
    typeof value === 'string' && (parseInt(value.split('/')[0]) > threshold.critical[1] || parseInt(value.split('/')[0]) < threshold.critical[0])
  ) {
    displayColor = "#E53935"; // Vibrant Red
  }

  return (
    <View style={styles.vitalCard}>
      <View style={styles.vitalCardHeader}>
        <Text style={styles.vitalCardName}>{name}</Text>
        <IconComponent color={displayColor} size={24} />
      </View>
      <Text style={[styles.vitalCardValue, { color: displayColor }]}>
        {value}
        <Text style={styles.vitalCardUnit}> {unit}</Text>
      </Text>
    </View>
  );
};

const ChartCard = ({ vitalData, selectedAttributes }) => {
  // Map selected attributes to datasets for react-native-chart-kit
  const datasets = selectedAttributes.map((key, index) => {
    // Assign colors from a predefined palette or generate dynamically
    const chartColors = ['#00BFFF', '#80E080', '#FFD54F', '#E53935', '#6A5ACD']; // Cyan, Green, Amber, Red, SlateBlue
    const strokeColor = chartColors[index % chartColors.length];

    return {
      data: vitalData.map(d => d[key] || 0), // Use 0 if data point is missing
      color: () => strokeColor,
      strokeWidth: 2,
      name: key.toUpperCase(), // Display attribute name in uppercase
    };
  });

  const chartData = {
    labels: vitalData.map(v => v.time),
    datasets: datasets,
    // Add legend if needed, but react-native-chart-kit's legend is basic
  };

  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Patient Vitals Trend</Text>
      {selectedAttributes.length > 0 ? (
        <LineChart
          data={chartData}
          width={screenWidth - 32 - 32} // Screen width - horizontal padding - card padding
          height={220}
          chartConfig={{
            backgroundColor: "#273244",
            backgroundGradientFrom: "#273244",
            backgroundGradientTo: "#273244",
            color: (opacity = 1) => `rgba(224, 227, 230, ${opacity})`, // Light Gray for labels/lines
            labelColor: (opacity = 1) => `rgba(127, 140, 141, ${opacity})`, // Muted Gray for labels
            decimalPlaces: 0,
            propsForDots: { r: '0' },
            propsForBackgroundLines: { stroke: '#444F61', strokeDasharray: '3 3' }, // Border color for grid
            propsForLabels: { fill: '#E0E3E6' },
            fillShadowGradient: '#00BFFF', // Fill under the line
            fillShadowGradientOpacity: 0.1,
          }}
          bezier
          style={styles.chartStyle}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          withInnerLines={true}
          withOuterLines={true}
          withHorizontalLines={true}
          withVerticalLines={true}
        />
      ) : (
        <Text style={styles.noChartDataText}>Select vital signs to display the chart.</Text>
      )}
    </View>
  );
};

const AlertsCard = ({ alerts }) => (
  <View style={styles.alertsCard}>
    <View style={styles.alertsCardHeader}>
      <Text style={styles.alertsCardTitle}>Real-time Alerts</Text>
      <Bell color="#E53935" size={24} />
    </View>
    {alerts.length > 0 ? (
      alerts.map((alert) => (
        <View
          key={alert.id}
          style={[
            styles.alertItem,
            { borderBottomColor: alerts.indexOf(alert) === alerts.length - 1 ? 'transparent' : '#444F61' }, // No border for last item
          ]}
        >
          <Text style={[styles.alertMessage, { color: alert.severity === 'critical' ? '#E53935' : '#80E080' }]}>
            {alert.message}
          </Text>
          <Text style={styles.alertTimestamp}>{alert.timestamp}</Text>
        </View>
      ))
    ) : (
      <Text style={styles.noAlertsText}>No active alerts.</Text>
    )}
  </View>
);

const Dashboard = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedChartAttributes, setSelectedChartAttributes] = useState<string[]>(['hr']); // Initially select only heart rate
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In React Native, use your local IP or actual backend URL
        const res = await fetch(`http://${ip}:3000/api/patient/vitals`);
        const data = await res.json();
        setPatients(data.patients);

        if (data.patients.length > 0) {
          const firstPatient = data.patients[0];
          setSelectedPatient(firstPatient);

          // Dynamically get available vital keys from the first patient's data
          const sampleVitals = firstPatient.vitalData?.[0] || {};
          const availableKeys = Object.keys(sampleVitals).filter(key =>
            ALL_VITAL_FIELDS.includes(key.toLowerCase()) && key !== 'time'
          );

          // Set initial chart attributes to HR if available, otherwise the first valid key
          const defaultKey = availableKeys.find(k => k.toLowerCase() === 'hr') || availableKeys[0];
          if (defaultKey) {
            setSelectedChartAttributes([defaultKey]);
          } else {
            setSelectedChartAttributes([]); // No default if no valid keys found
          }
        }
      } catch (error) {
        console.error("Failed to fetch patient data", error);
        Alert.alert("Error", "Failed to fetch patient data. Please check your network and server.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectChange = (itemValue: number) => {
    const foundPatient = patients.find((p) => p.id === itemValue);
    if (foundPatient) {
      setSelectedPatient(foundPatient);
    }
  };

  // Handler for chart attribute checkboxes with max 3 selection limit
  const handleChartAttributeChange = (attribute: string) => {
    setSelectedChartAttributes((prev) => {
      const isAlreadySelected = prev.some(item => item.toLowerCase() === attribute.toLowerCase());

      if (isAlreadySelected) {
        return prev.filter((item) => item.toLowerCase() !== attribute.toLowerCase());
      } else if (prev.length < 3) {
        return [...prev, attribute];
      } else {
        Alert.alert('Selection Limit', 'You can select a maximum of 3 vital signs for the chart.');
        return prev;
      }
    });
  };

  const handleAddPatient = async () => {
    // This function will likely navigate to a separate AddPatient screen
    router.push("/add-patient"); // Assuming you have an add-patient route
  };

  const handleUpdatePatient = async () => {
    // This function will likely navigate to a separate UpdatePatient screen
    router.push("/update-patient"); // Assuming you have an update-patient route
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BFFF" />
        <Text style={styles.loadingText}>Loading patient data...</Text>
      </View>
    );
  }

  if (!selectedPatient) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>No patient data available.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.dashboardTitle}>Patient Dashboard</Text>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddPatient}>
            <Text style={styles.addButtonText}>Add Patient</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdatePatient}>
            <Text style={styles.updateButtonText}>Update Patients</Text>
          </TouchableOpacity>
        </View>

        {/* Patient Picker */}
        <View style={styles.pickerWrapper}>
          <Text style={styles.pickerLabel}>Select Patient</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedPatient.id}
              onValueChange={handleSelectChange}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {patients.map((p) => (
                <Picker.Item
                  key={p.id}
                  label={`${p.name} (ID: ${p.patientId})`}
                  value={p.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Chart Attribute Selection */}
        <View style={styles.chartOptionsCard}>
          <Text style={styles.chartOptionsTitle}>Chart Display Options</Text>
          <Text style={styles.chartOptionsSubtitle}>
            Select up to 3 vital signs to display in the chart ({selectedChartAttributes.length}/3 selected)
          </Text>
          <View style={styles.checkboxContainer}>
            {selectedPatient?.vitalData?.[0] &&
              Object.keys(selectedPatient.vitalData[0])
                .filter((key) => ALL_VITAL_FIELDS.includes(key.toLowerCase()) && key !== "time")
                .map((key) => {
                  const isSelected = selectedChartAttributes.some(attr => attr.toLowerCase() === key.toLowerCase());
                  const isDisabled = !isSelected && selectedChartAttributes.length >= 3;

                  return (
                    <TouchableOpacity
                      key={key}
                      style={styles.checkboxLabel}
                      onPress={() => handleChartAttributeChange(key)}
                      disabled={isDisabled}
                    >
                      <View style={[styles.checkbox, isSelected && styles.checkboxChecked, isDisabled && styles.checkboxDisabled]}>
                        {isSelected && <Text style={styles.checkboxCheckmark}>✓</Text>}
                      </View>
                      <Text style={[styles.checkboxText, isDisabled && styles.checkboxTextDisabled]}>{key.toUpperCase()}</Text>
                    </TouchableOpacity>
                  );
                })}
          </View>
        </View>

        {/* Main Dashboard Content */}
        <View style={styles.mainGrid}>
          <View style={styles.chartSection}>
            <ChartCard vitalData={selectedPatient.vitalData} selectedAttributes={selectedChartAttributes} />
          </View>
          <View style={styles.sidebarSection}>
            <View style={styles.patientInfoCard}>
              <View style={styles.patientInfoHeader}>
                <View style={styles.patientIconContainer}>
                  <User color="#0C182F" size={28} />
                </View>
                <View>
                  <Text style={styles.patientName}>{selectedPatient.name}</Text>
                  <Text style={styles.patientId}>ID: {selectedPatient.patientId}</Text>
                </View>
              </View>
              <View style={styles.patientDetailsGrid}>
                <View style={styles.patientDetailItem}>
                  <Text style={styles.patientDetailLabel}>Age</Text>
                  <Text style={styles.patientDetailValue}>{selectedPatient.age} years</Text>
                </View>
                <View style={styles.patientDetailItem}>
                  <Text style={styles.patientDetailLabel}>Room</Text>
                  <Text style={styles.patientDetailValue}>{selectedPatient.room}</Text>
                </View>
                <View style={styles.patientDetailItem}>
                  <Text style={styles.patientDetailLabel}>Admission Date</Text>
                  <Text style={styles.patientDetailValue}>{selectedPatient.admissionDate}</Text>
                </View>
                <View style={styles.patientDetailItem}>
                  <Text style={styles.patientDetailLabel}>Condition</Text>
                  <Text style={styles.patientConditionValue}>{selectedPatient.condition}</Text>
                </View>
              </View>
            </View>
            <AlertsCard alerts={selectedPatient.alerts} />
          </View>
        </View>

        {/* Vital Cards */}
        <View style={styles.vitalCardsGrid}>
          {selectedPatient.vitalCards.map((vital) => (
            <VitalCard key={vital.name} {...vital} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0C182F', // Deep Midnight Blue
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0C182F',
  },
  loadingText: {
    marginTop: 10,
    color: '#E0E3E6',
    fontSize: 16,
  },
  dashboardTitle: {
    color: '#E0E3E6',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#00BFFF', // Cyan Blue
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#0C182F', // Deep Midnight Blue
    fontWeight: 'bold',
  },
  updateButton: {
    backgroundColor: '#FFD54F', // Amber Yellow
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  updateButtonText: {
    color: '#0C182F', // Deep Midnight Blue
    fontWeight: 'bold',
  },
  pickerWrapper: {
    marginBottom: 16,
  },
  pickerLabel: {
    color: '#E0E3E6',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  pickerContainer: {
    borderColor: '#273244', // Charcoal Gray
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
  chartOptionsCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#273244',
    borderColor: '#444F61',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartOptionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E0E3E6',
    marginBottom: 8,
  },
  chartOptionsSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12, // Gap between checkboxes
  },
  checkboxLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    height: 20,
    width: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#444F61', // Border color for checkbox
    backgroundColor: '#273244', // Background for checkbox
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#00BFFF', // Cyan Blue when checked
    borderColor: '#00BFFF',
  },
  checkboxDisabled: {
    opacity: 0.5,
  },
  checkboxCheckmark: {
    color: '#0C182F', // Deep Midnight Blue for checkmark
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxText: {
    color: '#E0E3E6', // Light Gray
    fontSize: 16,
  },
  checkboxTextDisabled: {
    color: '#7F8C8D', // Muted Gray when disabled
  },
  mainGrid: {
    flexDirection: 'column', // Default to column on small screens
    gap: 16,
  },
  chartSection: {
    flex: 1,
  },
  sidebarSection: {
    flexDirection: 'column',
    gap: 16,
  },
  patientInfoCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#273244',
    borderColor: '#444F61',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  patientInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  patientIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00BFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  patientName: {
    color: '#E0E3E6',
    fontSize: 20,
    fontWeight: 'bold',
  },
  patientId: {
    color: '#7F8C8D',
  },
  patientDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  patientDetailItem: {
    width: '48%', // Approx half width for two columns
    marginBottom: 12,
  },
  patientDetailLabel: {
    color: '#7F8C8D',
    fontSize: 14,
  },
  patientDetailValue: {
    color: '#E0E3E6',
    fontWeight: 'bold',
    fontSize: 14,
  },
  patientConditionValue: {
    color: '#E53935', // Vibrant Red for critical condition
    fontWeight: 'bold',
    fontSize: 14,
  },
  chartCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#273244',
    borderColor: '#444F61',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 300, // Fixed height for chart card
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E0E3E6',
    marginBottom: 8,
  },
  chartStyle: {
    borderRadius: 16,
  },
  noChartDataText: {
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  alertsCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#273244',
    borderColor: '#444F61',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  alertsCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  alertsCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E0E3E6',
  },
  alertItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  alertMessage: {
    fontWeight: '600',
    fontSize: 14,
  },
  alertTimestamp: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  noAlertsText: {
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 10,
  },
  vitalCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  vitalCard: {
    width: '48%', // Two cards per row on small screens
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#273244',
    borderColor: '#444F61',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 16, // Spacing between rows
  },
  vitalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  vitalCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  vitalCardValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  vitalCardUnit: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#7F8C8D',
  },
});
export default Dashboard