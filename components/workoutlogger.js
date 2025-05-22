import { View, Text } from 'react-native'
import React from 'react'
import { auth, FIREBASE_DB } from '../FirebaseConfig'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export const logWorkout = async (exerciseInputs) =>{

  try{
    const user = auth.currentUser;
    if(!user) throw new Error ('User not authenticated');

    const workoutRef = collection(FIREBASE_DB, `users/${user.uid}/workout`);

    await addDoc(workoutRef, {
      createdAt: serverTimestamp(),
      exercises: exerciseInputs.map(({muscleGroup, exercise, sets})=>({
        muscleGroup,
        exercise,
        sets
      }))
    });

    return{success:true};
  }catch(err){
    console.error('Error logging workout: ', err);
    return {success:false, message: err.message};
  }
};