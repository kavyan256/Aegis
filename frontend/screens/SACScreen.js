import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RoomCard from '../components/RoomCard';
import { useTheme } from '../context/ThemeContext';
import { MATTE_COLORS, LAYOUT } from '../utils/theme';

export default function SAC({ navigation }) {
  const { isDarkMode, toggleTheme } = useTheme();

  const rooms = [
    { name: 'Snooker Room', occupied: true, leaveTime: '7:30 PM' },
    { name: 'Table Tennis Room', occupied: false, leaveTime: null },
    { name: 'Virtuosi', occupied: true, leaveTime: '8:00 PM' },
    { name: 'Cricket Room', occupied: false, leaveTime: null },
  ];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: MATTE_COLORS.darkBg,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 8 : 0,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: LAYOUT.spacing.lg,
          marginBottom: LAYOUT.spacing.lg,
          marginTop: LAYOUT.spacing.sm,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <Ionicons name="arrow-back" size={24} color={MATTE_COLORS.textPrimary} />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: MATTE_COLORS.textPrimary,
          }}
        >
          SAC Rooms
        </Text>

        <TouchableOpacity onPress={toggleTheme} style={{ padding: 8 }}>
          <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={24} color={MATTE_COLORS.accentPrimary} />
        </TouchableOpacity>
      </View>

      {/* Rooms List */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: LAYOUT.spacing.lg,
          paddingBottom: LAYOUT.spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        {rooms.map((room, idx) => (
          <View
            key={idx}
            style={{
              backgroundColor: MATTE_COLORS.cardBg,
              borderRadius: 16,
              padding: LAYOUT.spacing.lg,
              marginBottom: LAYOUT.spacing.md,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: MATTE_COLORS.textPrimary,
                }}
              >
                {room.name}
              </Text>

              {room.occupied ? (
                <View
                  style={{
                    backgroundColor: '#f4433630',
                    borderRadius: 12,
                    paddingVertical: 4,
                    paddingHorizontal: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#f44336',
                      fontWeight: '500',
                    }}
                  >
                    Occupied
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    backgroundColor: '#4caf5030',
                    borderRadius: 12,
                    paddingVertical: 4,
                    paddingHorizontal: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#4caf50',
                      fontWeight: '500',
                    }}
                  >
                    Available
                  </Text>
                </View>
              )}
            </View>

            {room.occupied && (
              <Text
                style={{
                  marginTop: 6,
                  fontSize: 13,
                  color: MATTE_COLORS.textSecondary,
                }}
              >
                Expected to be free by <Text style={{ fontWeight: 'bold' }}>{room.leaveTime}</Text>
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
