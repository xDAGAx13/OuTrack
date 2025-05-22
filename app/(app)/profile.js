import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {  FIREBASE_DB } from "../../FirebaseConfig";
import "../../global.css";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import EditableField from "../../components/EditableField";
import { getAuth } from "firebase/auth/cordova";
import { auth } from "../../FirebaseConfig";

export default function profile() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [userinfo, setUserinfo] = useState({});
  const [editingField, setEditingField] = useState(false);
  const [fieldValues, setFieldValues] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userinfoSnap = await getDoc(
          doc(FIREBASE_DB, `users/${user.uid}/userinfo/profile`)
        );
        const data = userinfoSnap.data();
        setUserinfo(data);
        setFieldValues(data);
      } catch (e) {
        console.error("Error Fetching Data :", e.message);
      }
    };
    fetchUserData();
  }, []);

  const updateUserinfo = async (field) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const docRef = doc(FIREBASE_DB, `users/${user.uid}/userinfo/profile`);
      await updateDoc(docRef, { [field]: fieldValues[field] });
      setUserinfo((prev) => ({ ...prev, [field]: fieldValues[field] }));
      setEditingField[null];
      Alert.alert("Profile updated");
    } catch (e) {
      console.error("Failed to update profile: ", e);
      Alert.alert("Update Failed");
    }
  };

  const handleSignout = async () => {
    setLoading(true);
    try {
      auth.signOut();
      router.push("../login");
    } catch (error) {
      Alert.alert("Signout Failed", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View className="pb-32 flex-1 bg-black">
      <View className="flex-col">
        <Text className="text-white text-5xl font-semibold text-center mt-10">
          {userinfo.name}
        </Text>
        <Text className="text-white text-3xl text-center font-semibold mt-5">
          Customize your profile
        </Text>
      </View>

      {/* Displaying User Information */}
      <View className="flex-1 flex-col gap-4 mt-5 mx-2">
        <EditableField
          field="name"
          label="Name"
          icon="person"
          value={userinfo.name}
          onUpdate={(key, val) =>
            setUserinfo((prev) => ({ ...prev, [key]: val }))
          }
        />
        <EditableField
          field="age"
          label="Age"
          icon="calendar"
          value={userinfo.age}
          onUpdate={(key, val) =>
            setUserinfo((prev) => ({ ...prev, [key]: val }))
          }
        />
        <EditableField
          field="height"
          label="Height"
          icon="analytics"
          value={userinfo.height}
          onUpdate={(key, val) =>
            setUserinfo((prev) => ({ ...prev, [key]: val }))
          }
        />
        <EditableField
          field="weight"
          label="Weight"
          icon="barbell"
          value={userinfo.weight}
          onUpdate={(key, val) =>
            setUserinfo((prev) => ({ ...prev, [key]: val }))
          }
        />
      </View>

      <TouchableOpacity
        className="items-center bg-orange-400 h-20 mt-10 justify-center mx-20 rounded-2xl"
        onPress={handleSignout}
      >
        <Text className="text-white text-4xl font-semibold">Signout</Text>
      </TouchableOpacity>
    </View>
  );
}
