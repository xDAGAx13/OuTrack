import { View, Text, Alert, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import {  FIREBASE_DB } from "../FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../FirebaseConfig";
import '../global.css'

export default function EditableField({ field, label, icon, value, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const docRef = doc(FIREBASE_DB, `users/${user.uid}/userinfo/profile`);
      await updateDoc(docRef, { [field]: inputValue });
      onUpdate(field, inputValue);
      setEditing(false);
      Alert.alert("Profile Updated");
    } catch (e) {
      console.error("Error updating field: ", e.message);
    }
  };
  return (
    <View className="bg-white flex-row h-20 items-center mx-10 rounded-2xl mb-2 gap-3 pr-4">
      <Ionicons
        name={icon}
        size={25}
        color="#000"
        style={{ paddingStart: 10 }}
      />
      {editing ? (
        <View className="flex-row flex-1 pr-4">
          <TextInput
            className="pl-4 text-2xl flex-1 font-semibold"
            value={inputValue}
            onChangeText={setInputValue}
            placeholder={`Enter ${label}`}
          />
          <TouchableOpacity onPress={handleSave} style={{paddingEnd:10}}>
            <Ionicons name="checkmark" size={30} color="#000" />
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-row flex-1 ">
          <Text className="pl-4 text-2xl flex-1">{value}{field==='height'?(' cm'):('')}{field==='weight'?(' kg'):('')}</Text>
          <TouchableOpacity onPress={() => setEditing(true)} style={{paddingEnd:10}}>
            <Ionicons name="pencil" size={25} color="#000" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
