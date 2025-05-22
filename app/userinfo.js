import {
  View,
  Text,
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import {  FIREBASE_DB } from "../FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";
import { getAuth } from "firebase/auth/cordova";
import { auth } from "../FirebaseConfig";

export default function userinfo() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    bodyFat: "",
    experience: null,
    frequency: "",
    gymAccess: null,
  });

  const [experienceOpen, setExperienceOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);

  const experienceItems = [
    { label: "None", value: "None" },
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Advanced", value: "Advanced" },
  ];
  const accessItems = [
    { label: "Yes - Full Gym", value: "full" },
    { label: "Yes - Dumbbells", value: "dumbbells" },
    { label: "No Access", value: "none" },
  ];

  const saveUserInfo = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      await setDoc(
        doc(FIREBASE_DB, `users/${user.uid}/userinfo/profile`),
        form
      );
      router.replace("(app)/home");
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };
  return (
    <ScrollView className="bg-black flex-1 px-6 pt-12">
      <Text className="text-white text-3xl text-center font-semibold mb-6">
        Tell us about yourself
      </Text>

      <TextInput
        placeholder="Name"
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
        className="bg-white text-black h-14 px-4 mb-4 rounded-xl text-lg"
        placeholderTextColor="#999"
      />

      {[
        { label: "Age", key: "age" },
        { label: "Height (cm)", key: "height" },
        { label: "Weight (kg)", key: "weight" },
        { label: "Body Fat % (optional)", key: "bodyFat" },
        { label: "Gym Frequency (days/week)", key: "frequency" },
      ].map(({ label, key }) => (
        <TextInput
          key={key}
          placeholder={label}
          keyboardType="numeric"
          value={form[key]}
          onChangeText={(text) => setForm({ ...form, [key]: text })}
          className="bg-white text-black px-4 py-3 mb-4 rounded-xl text-lg h-14"
          placeholderTextColor="#999"
        />
      ))}

      <DropDownPicker
        open={experienceOpen}
        setOpen={setExperienceOpen}
        value={form.experience}
        setValue={(val) => setForm({ ...form, experience: val() })}
        items={experienceItems}
        placeholder="Select Gym Experience"
        style={{ marginBottom: experienceOpen ? 200 : 16 }}
        listMode="SCROLLVIEW"
      />

      <DropDownPicker
        listMode="SCROLLVIEW"
        open={accessOpen}
        setOpen={setAccessOpen}
        value={form.gymAccess}
        setValue={(val) => setForm({ ...form, gymAccess: val() })}
        items={accessItems}
        placeholder="Select Gym Access"
        style={{ marginBottom: accessOpen ? 200 : 16 }}
      />

      <TouchableOpacity
        onPress={saveUserInfo}
        className="bg-orange-400 rounded-xl py-4 my-8"
      >
        <Text className="text-white text-center text-xl font-semibold">
          Save and Continue
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
