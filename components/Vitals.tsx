// components/VitalCard.tsx
import { Atom, Droplet, Heart } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

interface VitalCardProps {
  name: string;
  value: string | number;
  unit: string;
  icon: string;
  color: string;
  threshold: { critical: number[]; warning: number[] };
}

const iconMap = {
  heart: <Heart size={24} />,
  atom: <Atom size={24} />,
  droplet: <Droplet size={24} />
};

export const VitalCard = ({ name, value, unit, icon, color, threshold }: VitalCardProps) => {
  let displayColor = color;

  if (typeof value === 'number') {
    if (value < threshold.critical[0] || value > threshold.critical[1]) {
      displayColor = '#DC2626'; // Red for critical
    } else if (value < threshold.warning[0] || value > threshold.warning[1]) {
      displayColor = '#FBBF24'; // Yellow for warning
    }
  }

  return (
    <View className="bg-white rounded-2xl p-4 shadow-md w-full mb-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold text-gray-500">{name}</Text>
        {/* <View style={{ color }}>{iconMap[icon as keyof typeof iconMap]}</View> */}
      </View>
      <Text className="text-3xl font-bold" style={{ color: displayColor }}>
        {value}
        <Text className="text-base text-gray-500"> {unit}</Text>
      </Text>
    </View>
  );
};
