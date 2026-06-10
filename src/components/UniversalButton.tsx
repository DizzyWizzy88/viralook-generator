"use client";

import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}

export const UniversalButton = ({ title, onPress, style }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed, hovered }: any) => [
        styles.button,
        style,
        hovered && styles.buttonHover,
        pressed && styles.buttonPressed
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonHover: {
    backgroundColor: '#f0f0f0',
    transform: [{ scale: 1.02 }],
  },
  buttonPressed: {
    backgroundColor: '#e0e0e0',
    transform: [{ scale: 0.98 }],
  },
  text: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  }
});
