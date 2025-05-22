import { doc, getDocs, setDoc, collection, addDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../FirebaseConfig";

const defaultMuscleGroups = [
  'Back',
  'Biceps',
  'Chest',
  'Legs',
  'Shoulders',
  'Triceps',
  'Cardio',
  'Core/Abs'
];

const defaultExercises = [
  // Back
  { name: 'Lat Pulldown', muscleGroup: 'Back' },
  { name: 'Seated Cable Row', muscleGroup: 'Back' },
  { name: 'Bent Over Barbell Row', muscleGroup: 'Back' },
  { name: 'Pull-Ups', muscleGroup: 'Back' },

  // Biceps
  { name: 'Barbell Curl', muscleGroup: 'Biceps' },
  { name: 'Hammer Curl', muscleGroup: 'Biceps' },
  { name: 'Preacher Curl', muscleGroup: 'Biceps' },
  { name: 'Concentration Curl', muscleGroup: 'Biceps' },

  // Chest
  { name: 'Bench Press', muscleGroup: 'Chest' },
  { name: 'Incline Dumbbell Press', muscleGroup: 'Chest' },
  { name: 'Chest Fly (Cable or Dumbbell)', muscleGroup: 'Chest' },
  { name: 'Push-Ups', muscleGroup: 'Chest' },

  // Legs
  { name: 'Squat', muscleGroup: 'Legs' },
  { name: 'Leg Press', muscleGroup: 'Legs' },
  { name: 'Lunges', muscleGroup: 'Legs' },
  { name: 'Romanian Deadlift', muscleGroup: 'Legs' },

  // Shoulders
  { name: 'Shoulder Press', muscleGroup: 'Shoulders' },
  { name: 'Lateral Raise', muscleGroup: 'Shoulders' },
  { name: 'Front Raise', muscleGroup: 'Shoulders' },
  { name: 'Rear Delt Fly', muscleGroup: 'Shoulders' },

  // Triceps
  { name: 'Tricep Pushdown', muscleGroup: 'Triceps' },
  { name: 'Overhead Tricep Extension', muscleGroup: 'Triceps' },
  { name: 'Close-Grip Bench Press', muscleGroup: 'Triceps' },
  { name: 'Tricep Dips', muscleGroup: 'Triceps' },

  // Cardio
  { name: 'Running (Treadmill or Outdoor)', muscleGroup: 'Cardio' },
  { name: 'Cycling', muscleGroup: 'Cardio' },
  { name: 'Jump Rope', muscleGroup: 'Cardio' },
  { name: 'Rowing Machine', muscleGroup: 'Cardio' },

  // Core/Abs
  { name: 'Plank', muscleGroup: 'Core/Abs' },
  { name: 'Russian Twists', muscleGroup: 'Core/Abs' },
  { name: 'Leg Raises', muscleGroup: 'Core/Abs' },
  { name: 'Bicycle Crunches', muscleGroup: 'Core/Abs' },
];


export const initializeUserData = async (userId) => {
  const userDocRef = doc(FIREBASE_DB, 'users', userId);
  const muscleGroupsRef = collection(FIREBASE_DB, `users/${userId}/muscleGroups`);
  const exercisesRef = collection(FIREBASE_DB, `users/${userId}/exercises`);

  // Create user doc
  await setDoc(userDocRef, { createdAt: Date.now() }, { merge: true });

  // Add default muscle groups if none exist
  const existingGroups = await getDocs(muscleGroupsRef);
  if (existingGroups.empty) {
    for (const group of defaultMuscleGroups) {
      await addDoc(muscleGroupsRef, { name: group });
    }
  }

  // Add default exercises if none exist
  const existingExercises = await getDocs(exercisesRef);
  if (existingExercises.empty) {
    for (const ex of defaultExercises) {
      await addDoc(exercisesRef, ex);
    }
  }
};
