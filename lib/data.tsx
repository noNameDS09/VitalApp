import React from 'react';

interface Alert {
  id: number;
  message: string;
  timestamp: string;
  severity: 'critical' | 'warning';
}

interface VitalDataPoint {
  time: string;
  hr: number;
  spo2: number;
  bp_sys: number;
  bp_dia: number;
}

export interface Patient {
  id: number;
  name: string;
  patientId: string;
  age: number;
  room: string;
  admissionDate: string;
  condition: string;
  vitalData: VitalDataPoint[];
  alerts: Alert[];
  vitalCards: {
    name: string;
    value: number | string;
    unit: string;
    icon: string; // Changed to string for React Native
    color: string; // Changed to hex code for React Native
    threshold: { critical: number[]; warning: number[] };
  }[];
}

export const patients: Patient[] = [
  {
    id: 1,
    name: 'P1',
    patientId: 'ID: P01',
    age: 65,
    room: 'ICU 2B',
    admissionDate: '2024-08-01',
    condition: 'Post-operative sepsis',
    vitalData: [
      { time: '10:00', hr: 75, spo2: 98, bp_sys: 120, bp_dia: 80 },
      { time: '10:15', hr: 78, spo2: 97, bp_sys: 122, bp_dia: 82 },
      { time: '10:30', hr: 80, spo2: 96, bp_sys: 125, bp_dia: 84 },
      { time: '10:45', hr: 82, spo2: 95, bp_sys: 128, bp_dia: 85 },
      { time: '11:00', hr: 85, spo2: 94, bp_sys: 130, bp_dia: 86 },
      { time: '11:15', hr: 84, spo2: 93, bp_sys: 129, bp_dia: 85 },
      { time: '11:30', hr: 86, spo2: 92, bp_sys: 132, bp_dia: 88 },
      { time: '11:45', hr: 88, spo2: 91, bp_sys: 135, bp_dia: 90 },
      { time: '12:00', hr: 90, spo2: 90, bp_sys: 140, bp_dia: 92 },
    ],
    alerts: [
      { id: 1, message: 'SpO₂ dropping below 95%. Early sign of distress.', timestamp: '11:00 AM', severity: 'warning' },
      { id: 2, message: 'Blood pressure rising. Monitor for hypertension.', timestamp: '11:45 AM', severity: 'warning' },
      { id: 3, message: 'SpO₂ critically low. Possible respiratory failure.', timestamp: '12:00 PM', severity: 'critical' },
    ],
    vitalCards: [
      { name: 'Heart Rate', value: 90, unit: 'bpm', icon: 'heart', color: '#00BFFF', threshold: { critical: [30, 110], warning: [40, 100] } },
      { name: 'SpO₂', value: 90, unit: '%', icon: 'atom', color: '#80E080', threshold: { critical: [0, 90], warning: [90, 95] } },
      { name: 'Blood Pressure', value: '140/92', unit: 'mmHg', icon: 'droplet', color: '#FFD54F', threshold: { critical: [0, 140], warning: [120, 139] } },
    ],
  },
  {
    id: 2,
    name: 'P2',
    patientId: 'ID: P02',
    age: 45,
    room: 'ICU 3A',
    admissionDate: '2024-07-28',
    condition: 'Acute respiratory failure',
    vitalData: [
      { time: '10:00', hr: 95, spo2: 89, bp_sys: 110, bp_dia: 75 },
      { time: '10:15', hr: 98, spo2: 88, bp_sys: 112, bp_dia: 76 },
      { time: '10:30', hr: 101, spo2: 87, bp_sys: 115, bp_dia: 78 },
      { time: '10:45', hr: 105, spo2: 86, bp_sys: 118, bp_dia: 80 },
      { time: '11:00', hr: 115, spo2: 82, bp_sys: 125, bp_dia: 85 },
      { time: '11:15', hr: 110, spo2: 83, bp_sys: 122, bp_dia: 82 },
      { time: '11:30', hr: 120, spo2: 80, bp_sys: 130, bp_dia: 88 },
      { time: '11:45', hr: 118, spo2: 81, bp_sys: 128, bp_dia: 87 },
      { time: '12:00', hr: 125, spo2: 78, bp_sys: 135, bp_dia: 90 },
    ],
    alerts: [
      { id: 1, message: 'Heart rate spike and oxygen saturation dropping.', timestamp: '11:00 AM', severity: 'critical' },
      { id: 2, message: 'Respiratory rate increasing. Tachycardia detected.', timestamp: '11:30 AM', severity: 'critical' },
      { id: 3, message: 'Severe hypoxia detected. CODE BLUE initiated.', timestamp: '12:00 PM', severity: 'critical' },
    ],
    vitalCards: [
      { name: 'Heart Rate', value: 125, unit: 'bpm', icon: 'heart', color: '#00BFFF', threshold: { critical: [30, 110], warning: [40, 100] } },
      { name: 'SpO₂', value: 78, unit: '%', icon: 'atom', color: '#80E080', threshold: { critical: [0, 90], warning: [90, 95] } },
      { name: 'Blood Pressure', value: '135/90', unit: 'mmHg', icon: 'droplet', color: '#FFD54F', threshold: { critical: [0, 140], warning: [120, 139] } },
    ],
  },
  {
    id: 3,
    name: 'P3',
    patientId: 'ID: P03',
    age: 72,
    room: 'ICU 1A',
    admissionDate: '2024-08-05',
    condition: 'Cardiac arrest',
    vitalData: [
      { time: '10:00', hr: 60, spo2: 99, bp_sys: 130, bp_dia: 85 },
      { time: '10:15', hr: 62, spo2: 99, bp_sys: 132, bp_dia: 86 },
      { time: '10:30', hr: 65, spo2: 98, bp_sys: 135, bp_dia: 88 },
      { time: '10:45', hr: 68, spo2: 98, bp_sys: 137, bp_dia: 89 },
      { time: '11:00', hr: 70, spo2: 98, bp_sys: 138, bp_dia: 90 },
      { time: '11:15', hr: 72, spo2: 98, bp_sys: 140, bp_dia: 91 },
      { time: '11:30', hr: 75, spo2: 98, bp_sys: 142, bp_dia: 92 },
      { time: '11:45', hr: 78, spo2: 97, bp_sys: 145, bp_dia: 94 },
      { time: '12:00', hr: 80, spo2: 96, bp_sys: 148, bp_dia: 96 },
    ],
    alerts: [
      { id: 1, message: 'Blood pressure rising. Hypertension detected.', timestamp: '10:25 AM', severity: 'warning' },
      { id: 2, message: 'Blood pressure continues to rise, approaching critical levels.', timestamp: '11:45 AM', severity: 'critical' },
    ],
    vitalCards: [
      { name: 'Heart Rate', value: 80, unit: 'bpm', icon: 'heart', color: '#00BFFF', threshold: { critical: [30, 110], warning: [40, 100] } },
      { name: 'SpO₂', value: 96, unit: '%', icon: 'atom', color: '#80E080', threshold: { critical: [0, 90], warning: [90, 95] } },
      { name: 'Blood Pressure', value: '148/96', unit: 'mmHg', icon: 'droplet', color: '#FFD54F', threshold: { critical: [0, 140], warning: [120, 139] } },
    ],
  },
  {
    id: 4,
    name: 'P4',
    patientId: 'ID: P04',
    age: 58,
    room: 'ICU 4D',
    admissionDate: '2024-08-04',
    condition: 'Diabetic ketoacidosis',
    vitalData: [
      { time: '10:00', hr: 85, spo2: 97, bp_sys: 125, bp_dia: 85 },
      { time: '10:15', hr: 88, spo2: 97, bp_sys: 128, bp_dia: 86 },
      { time: '10:30', hr: 90, spo2: 96, bp_sys: 130, bp_dia: 87 },
      { time: '10:45', hr: 92, spo2: 96, bp_sys: 132, bp_dia: 88 },
      { time: '11:00', hr: 95, spo2: 95, bp_sys: 135, bp_dia: 90 },
      { time: '11:15', hr: 98, spo2: 95, bp_sys: 138, bp_dia: 91 },
      { time: '11:30', hr: 100, spo2: 94, bp_sys: 140, bp_dia: 92 },
      { time: '11:45', hr: 110, spo2: 92, bp_sys: 145, bp_dia: 95 },
      { time: '12:00', hr: 115, spo2: 90, bp_sys: 150, bp_dia: 100 },
    ],
    alerts: [
      { id: 1, message: 'Heart rate steadily increasing. Monitor for agitation.', timestamp: '11:00 AM', severity: 'warning' },
      { id: 2, message: 'Hypoxia detected. Oxygen saturation dropping below 95%.', timestamp: '11:45 AM', severity: 'critical' },
      { id: 3, message: 'Blood pressure rising. Hypertension detected.', timestamp: '11:30 AM', severity: 'warning' },
    ],
    vitalCards: [
      { name: 'Heart Rate', value: 115, unit: 'bpm', icon: 'heart', color: '#00BFFF', threshold: { critical: [30, 110], warning: [40, 100] } },
      { name: 'SpO₂', value: 90, unit: '%', icon: 'atom', color: '#80E080', threshold: { critical: [0, 90], warning: [90, 95] } },
      { name: 'Blood Pressure', value: '150/100', unit: 'mmHg', icon: 'droplet', color: '#FFD54F', threshold: { critical: [0, 140], warning: [120, 139] } },
    ],
  },
  {
    id: 5,
    name: 'P5',
    patientId: 'ID: P05',
    age: 33,
    room: 'ICU 5C',
    admissionDate: '2024-08-03',
    condition: 'Traumatic brain injury',
    vitalData: [
      { time: '10:00', hr: 68, spo2: 99, bp_sys: 145, bp_dia: 95 },
      { time: '10:15', hr: 70, spo2: 99, bp_sys: 148, bp_dia: 96 },
      { time: '10:30', hr: 72, spo2: 99, bp_sys: 150, bp_dia: 98 },
      { time: '10:45', hr: 75, spo2: 98, bp_sys: 152, bp_dia: 100 },
      { time: '11:00', hr: 78, spo2: 98, bp_sys: 155, bp_dia: 102 },
      { time: '11:15', hr: 80, spo2: 98, bp_sys: 158, bp_dia: 104 },
      { time: '11:30', hr: 82, spo2: 98, bp_sys: 160, bp_dia: 105 },
      { time: '11:45', hr: 85, spo2: 97, bp_sys: 165, bp_dia: 108 },
      { time: '12:00', hr: 90, spo2: 96, bp_sys: 170, bp_dia: 110 },
    ],
    alerts: [
      { id: 1, message: 'Intracranial pressure increase. Blood pressure elevated.', timestamp: '10:45 AM', severity: 'critical' },
      { id: 2, message: 'Pupil reaction delayed. Neurological assessment advised.', timestamp: '11:00 AM', severity: 'warning' },
      { id: 3, message: 'Blood pressure continues to rise. CODE STROKE initiated.', timestamp: '12:00 PM', severity: 'critical' },
    ],
    vitalCards: [
      { name: 'Heart Rate', value: 90, unit: 'bpm', icon: 'heart', color: '#00BFFF', threshold: { critical: [30, 110], warning: [40, 100] } },
      { name: 'SpO₂', value: 96, unit: '%', icon: 'atom', color: '#80E080', threshold: { critical: [0, 90], warning: [90, 95] } },
      { name: 'Blood Pressure', value: '170/110', unit: 'mmHg', icon: 'droplet', color: '#FFD54F', threshold: { critical: [0, 140], warning: [120, 139] } },
    ],
  },
  {
    id: 6,
    name: 'P6',
    patientId: 'ID: P06',
    age: 28,
    room: 'ICU 6F',
    admissionDate: '2024-08-02',
    condition: 'Post-cardiac catheterization',
    vitalData: [
      { time: '10:00', hr: 70, spo2: 99, bp_sys: 115, bp_dia: 70 },
      { time: '10:15', hr: 71, spo2: 99, bp_sys: 116, bp_dia: 71 },
      { time: '10:30', hr: 72, spo2: 99, bp_sys: 117, bp_dia: 72 },
      { time: '10:45', hr: 73, spo2: 99, bp_sys: 118, bp_dia: 73 },
      { time: '11:00', hr: 74, spo2: 99, bp_sys: 119, bp_dia: 74 },
      { time: '11:15', hr: 75, spo2: 99, bp_sys: 120, bp_dia: 75 },
      { time: '11:30', hr: 76, spo2: 99, bp_sys: 121, bp_dia: 76 },
      { time: '11:45', hr: 75, spo2: 99, bp_sys: 120, bp_dia: 75 },
      { time: '12:00', hr: 74, spo2: 99, bp_sys: 119, bp_dia: 74 },
    ],
    alerts: [],
    vitalCards: [
      { name: 'Heart Rate', value: 74, unit: 'bpm', icon: 'heart', color: '#00BFFF', threshold: { critical: [30, 110], warning: [40, 100] } },
      { name: 'SpO₂', value: 99, unit: '%', icon: 'atom', color: '#80E080', threshold: { critical: [0, 90], warning: [90, 95] } },
      { name: 'Blood Pressure', value: '119/74', unit: 'mmHg', icon: 'droplet', color: '#FFD54F', threshold: { critical: [0, 140], warning: [120, 139] } },
    ],
  },
  {
    id: 7,
    name: 'P7',
    patientId: 'ID: P07',
    age: 55,
    room: 'ICU 1C',
    admissionDate: '2024-07-31',
    condition: 'Pneumonia',
    vitalData: [
      { time: '10:00', hr: 80, spo2: 93, bp_sys: 118, bp_dia: 78 },
      { time: '10:15', hr: 82, spo2: 92, bp_sys: 120, bp_dia: 80 },
      { time: '10:30', hr: 84, spo2: 91, bp_sys: 122, bp_dia: 81 },
      { time: '10:45', hr: 86, spo2: 90, bp_sys: 125, bp_dia: 83 },
      { time: '11:00', hr: 88, spo2: 89, bp_sys: 128, bp_dia: 85 },
      { time: '11:15', hr: 90, spo2: 88, bp_sys: 130, bp_dia: 86 },
      { time: '11:30', hr: 95, spo2: 85, bp_sys: 135, bp_dia: 90 },
      { time: '11:45', hr: 105, spo2: 80, bp_sys: 140, bp_dia: 95 },
      { time: '12:00', hr: 110, spo2: 75, bp_sys: 145, bp_dia: 100 },
    ],
    alerts: [
      { id: 1, message: 'Oxygen saturation falling. Consider non-invasive ventilation.', timestamp: '11:00 AM', severity: 'critical' },
      { id: 2, message: 'Heart rate steadily increasing.', timestamp: '10:30 AM', severity: 'warning' },
      { id: 3, message: 'SpO₂ dangerously low. Respiratory support is now critical.', timestamp: '11:45 AM', severity: 'critical' },
    ],
    vitalCards: [
      { name: 'Heart Rate', value: 110, unit: 'bpm', icon: 'heart', color: '#00BFFF', threshold: { critical: [30, 110], warning: [40, 100] } },
      { name: 'SpO₂', value: 75, unit: '%', icon: 'atom', color: '#80E080', threshold: { critical: [0, 90], warning: [90, 95] } },
      { name: 'Blood Pressure', value: '145/100', unit: 'mmHg', icon: 'droplet', color: '#FFD54F', threshold: { critical: [0, 140], warning: [120, 139] } },
    ],
  },
  {
    id: 8,
    name: 'P8',
    patientId: 'ID: P08',
    age: 62,
    room: 'ICU 5A',
    admissionDate: '2024-07-29',
    condition: 'Chronic kidney disease',
    vitalData: [
      { time: '10:00', hr: 78, spo2: 97, bp_sys: 140, bp_dia: 90 },
      { time: '10:15', hr: 80, spo2: 97, bp_sys: 142, bp_dia: 91 },
      { time: '10:30', hr: 82, spo2: 96, bp_sys: 145, bp_dia: 92 },
      { time: '10:45', hr: 84, spo2: 96, bp_sys: 148, bp_dia: 93 },
      { time: '11:00', hr: 86, spo2: 95, bp_sys: 150, bp_dia: 94 },
      { time: '11:15', hr: 88, spo2: 95, bp_sys: 152, bp_dia: 95 },
      { time: '11:30', hr: 90, spo2: 94, bp_sys: 155, bp_dia: 96 },
      { time: '11:45', hr: 92, spo2: 93, bp_sys: 158, bp_dia: 98 },
      { time: '12:00', hr: 95, spo2: 92, bp_sys: 160, bp_dia: 100 },
    ],
    alerts: [
      { id: 1, message: 'Elevated blood pressure. Consider medication adjustment.', timestamp: '10:30 AM', severity: 'warning' },
      { id: 2, message: 'SpO₂ dropping. Assess for fluid overload.', timestamp: '11:00 AM', severity: 'critical' },
      { id: 3, message: 'Hypertensive crisis approaching. BP spike.', timestamp: '12:00 PM', severity: 'critical' },
    ],
    vitalCards: [
      { name: 'Heart Rate', value: 95, unit: 'bpm', icon: 'heart', color: '#00BFFF', threshold: { critical: [30, 110], warning: [40, 100] } },
      { name: 'SpO₂', value: 92, unit: '%', icon: 'atom', color: '#80E080', threshold: { critical: [0, 90], warning: [90, 95] } },
      { name: 'Blood Pressure', value: '160/100', unit: 'mmHg', icon: 'droplet', color: '#FFD54F', threshold: { critical: [0, 140], warning: [120, 139] } },
    ],
  },
  {
    id: 9,
    name: 'P9',
    patientId: 'ID: P09',
    age: 48,
    room: 'ICU 3B',
    admissionDate: '2024-08-01',
    condition: 'Liver cirrhosis',
    vitalData: [
      { time: '10:00', hr: 88, spo2: 96, bp_sys: 105, bp_dia: 65 },
      { time: '10:15', hr: 85, spo2: 97, bp_sys: 104, bp_dia: 64 },
      { time: '10:30', hr: 82, spo2: 98, bp_sys: 103, bp_dia: 63 },
      { time: '10:45', hr: 79, spo2: 98, bp_sys: 102, bp_dia: 62 },
      { time: '11:00', hr: 76, spo2: 99, bp_sys: 101, bp_dia: 61 },
      { time: '11:15', hr: 73, spo2: 99, bp_sys: 100, bp_dia: 60 },
      { time: '11:30', hr: 70, spo2: 99, bp_sys: 99, bp_dia: 59 },
      { time: '11:45', hr: 65, spo2: 98, bp_sys: 95, bp_dia: 55 },
      { time: '12:00', hr: 60, spo2: 97, bp_sys: 90, bp_dia: 50 },
    ],
    alerts: [
      { id: 1, message: 'Heart rate decreasing. Monitor for bradycardia.', timestamp: '10:30 AM', severity: 'warning' },
      { id: 2, message: 'Blood pressure dropping. Potential hypotension.', timestamp: '11:45 AM', severity: 'critical' },
      { id: 3, message: 'Hypotensive crisis. Consider vasopressors.', timestamp: '12:00 PM', severity: 'critical' },
    ],
    vitalCards: [
      { name: 'Heart Rate', value: 60, unit: 'bpm', icon: 'heart', color: '#00BFFF', threshold: { critical: [30, 110], warning: [40, 100] } },
      { name: 'SpO₂', value: 97, unit: '%', icon: 'atom', color: '#80E080', threshold: { critical: [0, 90], warning: [90, 95] } },
      { name: 'Blood Pressure', value: '90/50', unit: 'mmHg', icon: 'droplet', color: '#FFD54F', threshold: { critical: [0, 140], warning: [120, 139] } },
    ],
  },
  {
    id: 10,
    name: 'P10',
    patientId: 'ID: P10',
    age: 39,
    room: 'ICU 4C',
    admissionDate: '2024-07-27',
    condition: 'Drug overdose',
    vitalData: [
      { time: '10:00', hr: 65, spo2: 98, bp_sys: 110, bp_dia: 70 },
      { time: '10:15', hr: 63, spo2: 98, bp_sys: 108, bp_dia: 69 },
      { time: '10:30', hr: 60, spo2: 97, bp_sys: 105, bp_dia: 68 },
      { time: '10:45', hr: 58, spo2: 97, bp_sys: 102, bp_dia: 67 },
      { time: '11:00', hr: 55, spo2: 96, bp_sys: 100, bp_dia: 66 },
      { time: '11:15', hr: 52, spo2: 95, bp_sys: 98, bp_dia: 65 },
      { time: '11:30', hr: 50, spo2: 94, bp_sys: 95, bp_dia: 64 },
      { time: '11:45', hr: 48, spo2: 92, bp_sys: 92, bp_dia: 62 },
      { time: '12:00', hr: 45, spo2: 90, bp_sys: 90, bp_dia: 60 },
    ],
    alerts: [
      { id: 1, message: 'Oxygen saturation dropping. Administer naloxone.', timestamp: '10:45 AM', severity: 'critical' },
      { id: 2, message: 'Severe bradycardia detected. Respiratory depression imminent.', timestamp: '11:30 AM', severity: 'critical' },
      { id: 3, message: 'Patient is unresponsive. CODE BLUE initiated.', timestamp: '12:00 PM', severity: 'critical' },
    ],
    vitalCards: [
      { name: 'Heart Rate', value: 45, unit: 'bpm', icon: 'heart', color: '#00BFFF', threshold: { critical: [30, 110], warning: [40, 100] } },
      { name: 'SpO₂', value: 90, unit: '%', icon: 'atom', color: '#80E080', threshold: { critical: [0, 90], warning: [90, 95] } },
      { name: 'Blood Pressure', value: '90/60', unit: 'mmHg', icon: 'droplet', color: '#FFD54F', threshold: { critical: [0, 140], warning: [120, 139] } },
    ],
  },
];
