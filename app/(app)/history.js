import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import "../../global.css";
import {  FIREBASE_DB } from "../../FirebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { auth } from "../../FirebaseConfig";

export default function History() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const snapshot = await getDocs(
          collection(FIREBASE_DB, `users/${user.uid}/workout`)
        );

        const logs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(0), // fallback to epoch
          };
        });

        const sortedLogs = logs.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setWorkouts(sortedLogs);
      } catch (e) {
        console.log("Failed to set workouts: ", e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, []);

  const handleDeleteWorkout = (workoutId) => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (!user) return;

              await deleteDoc(
                doc(FIREBASE_DB, `users/${user.uid}/workout/${workoutId}`)
              );
              setWorkouts((prev) =>
                prev.filter((workout) => workout.id !== workoutId)
              );
              Alert.alert("Workout Deleted");
            } catch (e) {
              console.error("Error deleting item: ", e.message);
              Alert.alert("Error", "Failed to delete workout");
            }
          },
        },
      ]
    );
  };

  const renderWorkout = ({ item }) => (
    <View className="bg-white rounded-2xl p-4  mb-4 shadow-md">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-bold text-black mb-1">
          🗓 {/* Displaying MuscleGroups */}
          <View className="flex-row flex-wrap mb-2">
            {[
              ...new Set(
                item.exercises.map((exercise) => exercise.muscleGroup)
              ),
            ].map((group, idx) => (
              <View
                key={idx}
                className="bg-orange-200 rounded-full px-3 py-1 mr-2 mb-2 h-10 mt-3 justify-center "
              >
                <Text className="text-orange-800 font-bold text-lg">
                  {group}
                </Text>
              </View>
            ))}
          </View>
          {/* Displaying Date */}
          {new Date(item.createdAt).toLocaleDateString("en-US", {
            weekday: "short",
            month: "long",
            day: "2-digit",
          })}
        </Text>
        <TouchableOpacity
          className="justify-center"
          onPress={() =>
            setSelectedWorkoutId(selectedWorkoutId === item.id ? null : item.id)
          }
        >
          <Ionicons
            name={
              selectedWorkoutId === item.id
                ? "chevron-up-outline"
                : "chevron-down-outline"
            }
            size={25}
          />
        </TouchableOpacity>
      </View>

      {selectedWorkoutId === item.id && (
        <View className="flex-row justify-between">
          {/* Edit and Delete Icons */}

          {/*  */}
          <View>
            {item.exercises.map((exercise, idx) => (
              <View key={idx} className="mb-2 mt-4">
                <Text className="text-black font-semibold">
                  {exercise.exercise}
                  <Text className="text-gray-500 font-bold">
                    {" "}
                    ({exercise.muscleGroup})
                  </Text>
                </Text>
                {exercise.sets.map((set, i) => (
                  <Text key={i} className="text-gray-700 text-sm">
                    Set {i + 1}: {set.reps} reps @ {set.weight} kg
                  </Text>
                ))}
              </View>
            ))}
          </View>
          <View className="flex-row justify-end mb-2 space-x-4 mt-4">
            <View className="flex-col gap-4">
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: `/(app)/editWorkout?workoutId=${item.id}`,
                  })
                }
              >
                <Ionicons name="pencil" size={25} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleDeleteWorkout(item.id)}>
                <Ionicons name="trash" size={25} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView className="bg-black flex-1 px-4 pt-8 pb-32">
      <Text className="text-white text-4xl font-semibold text-center mb-6">
        Workout History
      </Text>

      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={renderWorkout}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}
