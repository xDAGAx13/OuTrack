import { View, Text, Alert, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { FIREBASE_DB } from '../../FirebaseConfig';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { auth } from '../../FirebaseConfig';
export default function editWorkout() {
  const router = useRouter();
  const {workoutId} = useLocalSearchParams();
  console.log('Workout Id: ',workoutId)
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const fetchWorkout = async()=>{
      try{
        const user = auth.currentUser;
        if(!user) return;

        const workoutDoc = await getDoc(doc(FIREBASE_DB, `users/${user.uid}/workout/${workoutId}`));

        if(workoutDoc.exists()){
          const data = workoutDoc.data();
          setExercises(data.exercises || []);
        }else{
          Alert.alert('Workout not found');
          router.back();
        }
      }catch(e){
        console.error('Error fetching workout: ',e.message);
        router.back();
      }finally{
        setLoading(false);
      }
    }
    fetchWorkout();
  },[])

  const handleExerciseChange = (index, key, value)=>{
    setExercises((prev)=>{
      const updated = [...prev];
      updated[index][key] = value;
      return updated;
    });
  }

  const handleSetChange = (exerciseIndex, setIndex, key, value)=>{
    setExercises((prev)=>{
      const updated = [...prev];
      updated[exerciseIndex].sets[setIndex][key]=value;
      return updated;
    });
  };

  const saveWorkout = async()=>{
    try{
      const user = auth.currentUser;
      if(!user) throw new Error ('No user found');

      await updateDoc(doc(FIREBASE_DB,`users/${user.uid}/workout/${workoutId}`),{
        exercises,
      })

      Alert.alert('Workout Updated');
      router.replace('../(app)/history');
    }catch(e){
      console.error('Error Updating Workout: ',e.message);
    }
  }


  return (
    <ScrollView className="bg-black flex-1 px-4 pt-8">
      <Text className="text-white text-4xl font-semibold text-center mb-6">Edit Workout</Text>


      {exercises.map((exercise,idx)=>(
        <View key={idx} className="bg-white rounded-2xl p-4 mb-6">
          <Text className="text-black text-lg font-bold mb-2">
            Exercise {idx+1}
          </Text>
          <TextInput
            value={exercise.exercise}
            onChangeText={(text)=>handleExerciseChange(idx, 'exercise',text)}
            className="bg-gray-200 text-black rounded-xl p-3 mb-4"
            placeholder='Exercise Name'
          />
          {exercise.sets.map((set, setIdx)=>(
            <View key={setIdx} className="flex-row justify-between items-center mb-2">
              <TextInput
                value={set.reps.toString()}
                onChangeText={(text)=>handleSetChange(idx, setIdx, 'reps',text)}
                className="bg-gray-200 text-black rounded-xl p-3 w-[45%]"
                placeholder='Reps'
                keyboardType='numeric'
                />

<TextInput
                value={set.weight.toString()}
                onChangeText={(text)=>handleSetChange(idx, setIdx, 'weight',text)}
                className="bg-gray-200 text-black rounded-xl p-3 w-[45%]"
                placeholder='Weight'
                keyboardType='numeric'
                />
            </View>
          ))}
        </View>
      ))}

      <TouchableOpacity onPress={saveWorkout} className="bg-orange-400 rounded-2xl py-4 mb-10">
        <Text className="text-white text-center text-xl font-bold">
          Save Changes
        </Text>
      </TouchableOpacity>
    </ScrollView>

    
  )
}