import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import DropDownPicker from 'react-native-dropdown-picker';
import '../global.css'

export default function ExerciseBlock({
  block,
  index,
  muscleOptions,
  exerciseMap,
  updateInput,
  updateSetValue,
  addSetToBlock,
  removeSetFromBlock,
  removeExerciseBlock,
}) {
  return (
    <View key={block.id} className="mb-6">
      <Text className="text-white text-xl mb-2 font-bold">Exercise {index + 1}</Text>

      {/* Muscle Group Picker */}
      <DropDownPicker
        open={block.muscleOpen || false}
        value={block.muscleGroup}
        items={muscleOptions}
        setOpen={(open) => updateInput(block.id, 'muscleOpen', open)}
        setValue={(callback) => {
          const val = callback(block.muscleGroup);
          updateInput(block.id, 'muscleGroup', val);
          updateInput(block.id, 'exercise', '');
        }}
        placeholder="Select Muscle Group"
        style={{ backgroundColor: 'white', borderRadius: 12, marginBottom: 10 }}
        dropDownContainerStyle={{ borderRadius: 12 }}
        textStyle={{ fontSize: 15 }}
        zIndex={1000 - index * 10}
        listMode="SCROLLVIEW"
      />

      {/* Exercise Picker */}
      {block.muscleGroup!==''&&(<DropDownPicker
        open={block.exerciseOpen || false}
        value={block.exercise}
        items={exerciseMap[block.muscleGroup] || []}
        setOpen={(open) => updateInput(block.id, 'exerciseOpen', open)}
        setValue={(callback) => {
          const val = callback(block.exercise);
          updateInput(block.id, 'exercise', val);
        }}
        placeholder="Select Exercise"
        style={{ backgroundColor: 'white', borderRadius: 12, marginBottom: 10 }}
        dropDownContainerStyle={{ borderRadius: 12 }}
        textStyle={{ fontSize: 15 }}
        zIndex={900 - index * 10}
        listMode="SCROLLVIEW"
      />)}
      

      {/* Sets */}
      
      {block.exercise!==''&&(
      block.sets.map((set, setIndex) => (
        <View key={setIndex} className="mb-3">
          <Text className="text-white mb-1 font-semibold">Set {setIndex + 1}</Text>
          <View className="flex-row gap-4 items-center  ">
            <TextInput
              className="bg-white px-4 py-2 w-24 text-black rounded-xl h-14 font-semibold"
              keyboardType="numeric"
              value={set.reps.toString()}
              placeholder="Reps"
              placeholderTextColor={'#ccc'}
              onChangeText={(val) => updateSetValue(block.id, setIndex, 'reps', val)}
            />
            <TextInput
              className="bg-white px-4 py-2 w-30 text-black rounded-xl h-14 font-semibold"
              keyboardType="numeric"
              value={set.weight.toString()}
              placeholder="Weight (kg)"
              placeholderTextColor={'#ccc'}
              onChangeText={(val) => updateSetValue(block.id, setIndex, 'weight', val)}
            />
            {block.sets.length > 1 && (
              <TouchableOpacity onPress={() => removeSetFromBlock(block.id, setIndex)}>
                <Text className="text-red-500 text-lg">Remove</Text>
              </TouchableOpacity>
            )}
          </View>
          
      <TouchableOpacity onPress={() => addSetToBlock(block.id)} className="mt-4">
        <Text className="text-white font-bold text-xl">+ Add Set</Text>
      </TouchableOpacity>
        </View>
      )
      ))}

      

      {index > 0 && (
        <TouchableOpacity onPress={() => removeExerciseBlock(block.id)}>
          <Text className="text-red-500 mt-2">Remove Exercise</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
