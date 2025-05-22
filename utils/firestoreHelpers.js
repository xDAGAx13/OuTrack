import { View, Text } from 'react-native'
import React from 'react'
import { FIREBASE_AUTH, FIREBASE_DB } from '../FirebaseConfig'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


export default logWorkout = async({muscleGroups, exercises}) =>{
  try{
    const user = FIREBASE_AUTH.currentUser;
    if(!user) throw new Error("User not logged in!");

    const workoutRef = collection(FIREBASE_DB, "users", user.uid, "workouts");
    
    await addDoc(workoutRef, {
      date: serverTimestamp(),
      muscleGroups,
      exercises,
    });

    return true;
  } catch(err){
    console.log('Error logging workout: ', err);
    return false;
  }
};