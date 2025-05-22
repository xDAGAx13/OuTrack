import { View, Text, ScrollView } from "react-native";
import React, { Children } from "react";
import { Platform } from "react-native";

export default function KeyboardAvoidingView() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {
          Children
        }
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
