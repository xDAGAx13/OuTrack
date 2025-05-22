import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import '../../global.css'
import {  FIREBASE_DB } from '../../FirebaseConfig'
import { useRouter } from 'expo-router';
import { collection, getDoc, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { getAuth } from 'firebase/auth/cordova';
import { auth } from '../../FirebaseConfig';

export default function home() {
  const [username, setUsername] = useState('');
  const [lastworkout, setLastworkout] = useState('');
  const router = useRouter();
  
  useEffect(()=>{
    const user = auth.currentUser;
      if(!user) return;
    const fetchUserName = async()=>{
      try{
        const userinfoSnap = await getDocs(collection(FIREBASE_DB, `users/${user.uid}/userinfo`));

        if(!userinfoSnap.empty){
          const userInfoDoc = userinfoSnap.docs[0];
          const fullName = userInfoDoc.data().name;
          const firstName = fullName.split(' ')[0];
          setUsername(firstName);
        }
      }catch(e){
        console.error('Error fetching user name: ', e.message);
      }
    }

    const fetchLastWorkout = async()=>{
      try{
        const workoutRef = collection(FIREBASE_DB, `users/${user.uid}/workout`)
        const workoutQuery = query(workoutRef,orderBy('createdAt','desc'),limit(1));
        const workoutSnap = await getDocs(workoutQuery);

        
        
        if(!workoutSnap.empty){
          const latestWorkout = workoutSnap.docs[0].data();
          const workoutDate = latestWorkout.createdAt?.toDate?.();
          const formattedDate = workoutDate?workoutDate.toLocaleDateString('en-US',{
            weekday: 'short',
            month:'short',
            day:'numeric',
          }):'Unknown Date'

          const muscleGroups = [
            ...new Set(latestWorkout.exercises.map((ex)=>ex.muscleGroup))].join(', ');
            setLastworkout(`Last Workout: ${muscleGroups} (${formattedDate})`)
          
        }

      }catch(e){
        console.error('Error fetching last workout: ',e.message);
      }
    }
    fetchUserName();
    fetchLastWorkout();
  },[])

  return (
    <View className="bg-black flex-1 pb-32">
      {/* TITLE AND GREETING */}
    <View className="pt-20 flex-col ">
      <Text className="text-white text-7xl text-center font-bold">OuTrack</Text>
      <Text className="text-white text-center font-semibold text-4xl">Welcome, {username}</Text>
    </View>
    {/* Last Workout */}
    <View  className="mt-3 items-center flex">
      <TouchableOpacity className="bg-neutral-800 px-4 py-5 rounded-2xl " onPress={()=>router.replace('history')}>
      <Text className="text-neutral-400 text-xl">{lastworkout}</Text>
      </TouchableOpacity>
    </View>

    <View className="flex-row justify-center mt-20">
      <TouchableOpacity className="bg-orange-500 rounded-xl p-4 " onPress={()=>router.replace('/(app)/workoutlog')} activeOpacity={0.7}>
        <Text className="text-center text-4xl text-white font-extrabold p-5">START HUSTLING</Text>
      </TouchableOpacity>
    </View>
    </View>
  )
}