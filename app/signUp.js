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
  ActivityIndicator,
} from "react-native";
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, getAuth, getRedirectResult, signInWithCredential, signInWithRedirect } from "firebase/auth";
import { initializeUserData } from "../utils/initializeUserData";
import { Ionicons } from "@expo/vector-icons";
import { GoogleAuthProvider } from "firebase/auth";
import { auth } from "../FirebaseConfig";

WebBrowser.maybeCompleteAuthSession();

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const[request, response, promptAsync]=Google.useAuthRequest({
    expoClientId: '335688520458-m9a7a7uo7f4qki0ml04064qoo61ckikn.apps.googleusercontent.com',
    iosClientId:'335688520458-u3fgqf2eupt3tvkihco1ioupqcirge1h.apps.googleusercontent.com',
    webClientId:'335688520458-m9a7a7uo7f4qki0ml04064qoo61ckikn.apps.googleusercontent.com',
  })
  useEffect(()=>{
    if(response?.type==='success'){
      const {id_token} = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
      .then((cred)=>{
        console.log('Google Sign In Success: ', cred.user);
      }).catch((e)=>{
        console.error('Firebase sign-in error: ',e)
      })
    }
  },[response])
  // Authenticating using Google Auth Provider
  
  const handleGoogleSignUp = async ()=>{
    try{
      const provider = new GoogleAuthProvider();
      signInWithRedirect(auth, provider);
    }catch(e){
      console.error('Error signing in w Google: ',e)
    }
  }


  //LoginCheck function
  const handleSignUp = async () => {
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;
      await initializeUserData(uid);
      router.replace("userinfo");
    } catch (e) {
      Alert.alert("SignUp Failed", e.message);
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
          <View className="pt-24 flex-col">
            <Text className="text-white text-center text-7xl font-extrabold ">
              OUTRACK
            </Text>
            <Text className="text-white text-center text-5xl font-semibold mt-4">
              SIGNUP
            </Text>
          </View>
          {/* IMAGE */}

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
            {loading ? (
              <ActivityIndicator size="large" />
            ) : (
              <View className="gap-3">
              <TouchableOpacity
                className="h-16 bg-gray-500 rounded-3xl justify-center mx-14"
                onPress={handleSignUp}
              >
                <Text className="text-white text-center text-3xl font-semibold">
                  Sign Up
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
              className=" bg-gray-200 rounded-3xl justify-center h-20 mt-3"
              onPress={()=>promptAsync()}
            >
              <View className="flex-row gap-5">
              <Ionicons name="logo-google" className="h-10 w-20 px-9" size={35}/>
              <Text className="text-black text-center text-3xl font-semibold ">
                Continue with Google
              </Text>
              </View>
            </TouchableOpacity>
            </View>
              
            )}

            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => router.push("/login")}
            >
              <Text className="text-white pt-4 text-center text-xl">
                Go back To login
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-1"></View>

          <View >
            <Text className="text-gray-200 text-center pt-16">
              Terms and Conditions may apply..
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
