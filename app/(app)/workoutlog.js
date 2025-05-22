import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import {  FIREBASE_DB } from "../../FirebaseConfig.js";
import ExerciseBlock from "../../components/ExerciseBlock.js";
import { logWorkout } from "../../components/workoutlogger.js";
import { auth } from "../../FirebaseConfig.js";

export default function workoutlog() {
  const [muscleOptions, setMuscleOptions] = useState([]);
  const [exerciseMap, setExerciseMap] = useState({});
  const [exerciseInputs, setExerciseInputs] = useState([
    {
      id: Date.now().toString(),
      muscleGroup: "",
      exercise: "",
      sets: [{ reps: "", weight: "" }],
    },
  ]);


  useEffect(() => {
    const fetchMuscleGroups = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const snapshotMuscle = await getDocs(
          collection(FIREBASE_DB, `users/${user.uid}/muscleGroups`)
        );
        const options = snapshotMuscle.docs.map((doc) => ({
          label: doc.data().name,
          value: doc.data().name,
        }));

        setMuscleOptions(options);
      } catch (err) {
        console.error("Failed to fetch Muscle Groups: ", err.message);
      }
    };

    const fetchExercises = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const snapshot = await getDocs(
          collection(FIREBASE_DB, `users/${user.uid}/exercises`)
        );
        const exercisesByGroup = {};

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (!exercisesByGroup[data.muscleGroup]) {
            exercisesByGroup[data.muscleGroup] = [];
          }
          exercisesByGroup[data.muscleGroup].push({
            label: data.name,
            value: data.name,
          });
        });
        setExerciseMap(exercisesByGroup);
      } catch (err) {
        console.error("Error fetching exercises:", err);
      }
    };
    fetchMuscleGroups();
    fetchExercises();
  }, []);

  const updateInput = (id, key, value) => {
    setExerciseInputs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    );
  };

  const updateSetValue = (blockId, setIndex, key, value) => {
    setExerciseInputs((prev) =>
      prev.map((block) => {
        if (block.id !== blockId) return block;
        const updatedSets = block.sets.map((set, i) =>
          i == setIndex ? { ...set, [key]: value } : set
        );
        return { ...block, sets: updatedSets };
      })
    );
  };

  const addSetToBlock = (blockId) => {
    setExerciseInputs((prev) =>
      prev.map((block) =>
        block.id === blockId
          ? { ...block, sets: [...block.sets, { reps: "", weight: "" }] }
          : block
      )
    );
  };

  const removeSetFromBlock = (blockId, setIndex) => {
    setExerciseInputs((prev) =>
      prev.map((block) => {
        if (block.id !== blockId) return block;
        const updatedSets = block.sets.filter((_, i) => i !== setIndex);
        return { ...block, sets: updatedSets };
      })
    );
  };

  const addExerciseBlock = () => {
    setExerciseInputs((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        muscleGroup: "",
        exercise: "",
        sets: [{ reps: "", weight: "" }],
      },
    ]);
  };

  const removeExerciseBlock = (id) => {
    setExerciseInputs((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <View className="flex-1 bg-black">
    <ScrollView className="p-4 bg-black flex-1 mb-12">
      <Text className="text-white text-3xl text-center font-semibold mb-6">
        Build Your Workout
      </Text>

      {exerciseInputs.map((block, index) => (
        <ExerciseBlock
          key={block.id}
          block={block}
          index={index}
          muscleOptions={muscleOptions}
          exerciseMap={exerciseMap}
          updateInput={updateInput}
          updateSetValue={updateSetValue}
          addSetToBlock={addSetToBlock}
          removeSetFromBlock={removeSetFromBlock}
          removeExerciseBlock={removeExerciseBlock}
        />
      ))}

      <TouchableOpacity
        onPress={addExerciseBlock}
        className="bg-gray-700 rounded-xl py-4 mb-4"
      >
        <Text className="text-white text-center text-lg font-semibold">
          + Add Another Exercise
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={async () => {
          const result = await logWorkout(exerciseInputs);
          if (result.success) {
            Alert.alert("Workout Logged Successfully!");
          } else {
            Alert.alert("Failed to log workout: " + result.message);
          }
        }}
        className="bg-orange-400 rounded-xl py-4 mb-20"
      >
        <Text className="text-white text-center text-2xl font-bold">
          Finish Workout
        </Text>
      </TouchableOpacity>
    </ScrollView>
    </View>
  );
}
