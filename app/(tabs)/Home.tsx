import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { User } from 'lucide-react-native'; // Using Lucide icon for the hero element
// import './global.css'; // Assuming global.css is configured for NativeWind

const { width, height } = Dimensions.get('window');

const HeroSection = () => {
  return (
    <View className="flex-1 bg-[#0C182F]">
      {/* Background Image for the Hero Section */}
      <ImageBackground
        source={{ uri: '../assets/images/image.png' }} // Placeholder image URL
        className="flex-1 w-full h-full justify-center items-center"
        resizeMode="cover"
      >
        <View className="flex-1 bg-[rgba(12,24,47,0.7)] justify-center items-center px-5">
          <View className="items-center max-w-[700px]">
            {/* Hero Icon/Logo */}
            <View className="mb-5">
              <User color="#00BFFF" size={64} />
            </View>

            {/* Title */}
            <Text className="text-[36px] font-bold text-[#E0E3E6] text-center mb-2">
              <Text className="text-[#00BFFF]">VITAL</Text>. Intelligent Patient Monitoring.
            </Text>

            {/* Subheading */}
            <Text className="text-lg text-[#7F8C8D] text-center mb-8 leading-6">
              The next generation of ICU monitoring. VITAL uses an intelligent multi-agent system to predict and prevent patient deterioration with unparalleled accuracy.
            </Text>

            {/* CTA Buttons */}
            {/* <View className="flex-row flex-wrap justify-center mt-5">
              <TouchableOpacity className="bg-[#00BFFF] py-[15px] px-[30px] rounded-xl mx-[10px] mb-[10px] shadow-md shadow-black/30 elevation-8">
                <Text className="text-[#0C182F] text-lg font-bold">Request a Demo</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-[#273244] py-[15px] px-[30px] rounded-xl mx-[10px] mb-[10px] border border-[#444F61] shadow-md shadow-black/30 elevation-8">
                <Text className="text-[#E0E3E6] text-lg font-bold">Learn More</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default HeroSection;
