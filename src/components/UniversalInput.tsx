"use client";

import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

interface Props {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
}

export const UniversalInput = ({ label, value, onChangeText, placeholder, multiline = false }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#555"
        multiline={multiline}
        style={[styles.input, multiline && styles.textArea]}
        // This ensures the keyboard doesn't cover the input on mobile
        cursorColor="#fff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    color: '#888',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
    paddingLeft: 4,
  },
  input: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 16,
    padding: 16,
    color: '#fff',
    fontSize: 14,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top', // Important for Android
  },
});
