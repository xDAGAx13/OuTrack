export const addMuscleGroup = ()=>{
  setMuscleGroups([...muscleGroups, {id:Date.now(), value:''}]);
};

export const removeMuscleGroup = (id)=>{
  setMuscleGroups(muscleGroups.filter(group=>group.id!==id));
}

export const updateMuscleGroup = (id, newValue)=>{
  setMuscleGroups(
    muscleGroups.map(group =>
      group.id ===id?{...group, value: newValue}:group
    )
  );
};


