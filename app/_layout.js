import { View, Text, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import React from 'react'
import '../global.css'
import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'


export default function _layout() {
  return (
    <View className="flex-1 bg-black ">
      <StatusBar style='light'/>
      <Slot screenOptions={{headerShown: false}} />
      
    </View>
  )
}