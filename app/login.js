import {
  View,
  Text,
  Alert,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getAuth } from "firebase/auth/cordova";
import { auth } from "../FirebaseConfig";

export default function login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  //LoginCheck function
  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Login Successful", userCredential.user);
      router.replace("/(app)/home");
    } catch (e) {
      Alert.alert("Login Failed", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="pt-10">
          {/* TITLE OF THE APP */}
          <View className="pt-16 flex-col">
            <Text className="text-white text-center text-7xl font-extrabold ">
              OUTRACK
            </Text>
            <Text className="text-white text-center text-5xl font-semibold mt-4">
              LOGIN
            </Text>
          </View>
          {/* IMAGE */}
          <View className="items-center pt-6">
            <Image
              className="w-96 h-64"
              source={require("../assets/images/Workout-rafiki.png")}
            />
          </View>

          {/* Auth Inputs */}
          <View className="flex-col gap-4 pt-7">
            <TextInput
              value={email}
              onChangeText={setEmail}
              className="placeholder:text-gray-500 bg-white h-16 px-7 text-2xl rounded-2xl mx-7 focus:border-gray-300 border-2"
              placeholder="Email"
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              className=" placeholder:text-gray-500  bg-white h-16 text-2xl rounded-2xl mx-7 px-7"
              placeholder="Password"
              secureTextEntry
            />
          </View>

          {/* LOGIN BUTTON */}
          <View className="pt-5 flex-col">
            <TouchableOpacity
              className="h-16 bg-gray-500 rounded-3xl justify-center mx-14"
              onPress={handleLogin}
            >
              <Text className="text-white text-center text-3xl font-semibold">
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => router.push("/signUp")}
            >
              <Text className="text-white pt-4 text-center text-xl">
                Don't have an account?
              </Text>
            </TouchableOpacity>
          </View>

          <View className="">
            <Text className="text-gray-200 text-center mt-10">
              Made by Rohan Daga
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
