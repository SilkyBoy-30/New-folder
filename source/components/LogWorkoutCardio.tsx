import React, {useCallback, useState, useEffect, useRef} from 'react';
import {Alert, FlatList, ScrollView, Pressable, StyleSheet, Button, Switch, Text, View, TouchableOpacity, TextInput, Dimensions} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'
import {colors} from '../Colors';
import {BSON} from 'realm';
import {useUser, useRealm, useQuery} from '@realm/react';
import {CardioWorkout} from '../schemas/CardioWorkoutSchema';
import { Workouts } from '../schemas/WorkoutSchema';
import { UserStatistics } from '../schemas/UserStatisticsSchema';

type LogWorkoutCardioProps = {
  onPress:any
}


export const LogWorkoutCardio = (props:LogWorkoutCardioProps) => {
  const realm = useRealm();
  const user = useUser();

  const userStatistics = useQuery(UserStatistics).filtered("userId == $0", user.id);

  useEffect(() => {
      realm.subscriptions.update(mutableSubs => {
        mutableSubs.add(
          realm.objects(CardioWorkout),
        );

        mutableSubs.add(
          realm.objects(Workouts),
        );

        mutableSubs.add(
          realm.objects(UserStatistics)
        )
      });
  }, [realm, user]);

  const [forms, setForms] = useState([{ id: 1, exercise: {id: 1, value: ''}, inputs: [{id: 1}], timeInputs: [{ id: 1, value: '' }], distanceInputs: [{ id: 1, value: ''}], extraNotes: {id: 1, value: ''} }]);
  
  const handleAddForm = () => {
    const newForm = { id: forms.length + 1, exercise: {id: 1, value: ''}, inputs: [{id: 1}], timeInputs: [{ id: 1, value: '' }], distanceInputs: [{ id: 1, value: ''}], extraNotes: {id: 1, value: ''} };
    setForms([...forms, newForm]);
  };

  const handleRemoveForm = (formIndex:any) => {
    const updatedForms = forms.filter((_, i) => i !== formIndex);
    setForms(updatedForms);
  };

  const handleAddInput = (formIndex:any) => {
    const newInput = {id: forms[formIndex].inputs.length + 1}
    const newTimeInput = { id: forms[formIndex].timeInputs.length + 1, value: '' };
    const newDistanceInput = {id: forms[formIndex].distanceInputs.length + 1, value: ''}
    const updatedForms = [...forms];
    updatedForms[formIndex].timeInputs.push(newTimeInput);
    updatedForms[formIndex].distanceInputs.push(newDistanceInput);
    updatedForms[formIndex].inputs.push(newInput)
    setForms(updatedForms);
  };

  const handleRemoveInput = (formIndex:any, inputIndex:any) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].inputs = updatedForms[formIndex].inputs.filter((_, i) => i !== inputIndex)
    updatedForms[formIndex].timeInputs = updatedForms[formIndex].timeInputs.filter((_, i) => i !== inputIndex);
    updatedForms[formIndex].distanceInputs = updatedForms[formIndex].distanceInputs.filter((_, i) => i !== inputIndex);
    setForms(updatedForms);
  };

  const handleTimeInputChange = (text:any, formIndex:any, inputIndex:any) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].timeInputs[inputIndex].value = text;
    setForms(updatedForms);
  };

  const handleDistanceInputChange = (text:any, formIndex:any, inputIndex:any) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].distanceInputs[inputIndex].value = text;
    setForms(updatedForms);
  };

  const handleExerciseChange = (exercise:any, formIndex:any) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].exercise.value = exercise;
    setForms(updatedForms);
  }

  const handleExtraNotesInputChange = (text:any, formIndex:any) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].extraNotes.value = text;
    setForms(updatedForms);
  }


  const submitData = () => {
    

    let distances: string[] = [];
    let times: string[] = [];
    let exercises: string[] = [];
    let extraNotes: string[] = [];

    let totalTime:number = 0;
    let totalDistance:number = 0;
    let allExercises:string[] = [];

    for(let i = 0; i < forms.length; i++)
    {
      distances.push(JSON.stringify(forms[i].distanceInputs))
      times.push(JSON.stringify(forms[i].timeInputs))
      exercises.push(JSON.stringify(forms[i].exercise))
      extraNotes.push(JSON.stringify(forms[i].extraNotes))

      forms[i].timeInputs.forEach(item => totalTime += Number(item.value))
      forms[i].distanceInputs.forEach(item => totalDistance += Number(item.value))
      if(!allExercises.includes(forms[i].exercise.value))
      {
        allExercises.push(forms[i].exercise.value)
      }
    }

    let previousLevel = userStatistics[0].lvl;

    createItem(exercises, times, distances, extraNotes, totalTime, totalDistance, allExercises)
    logWorkout("Cardio")
    updateUserStatistics(totalTime, totalDistance)

    let postLevel = userStatistics[0].lvl;
    let levelUp = false;

    if(postLevel > previousLevel)
    {
      levelUp = true;
    }
    props.onPress(levelUp, (totalTime + totalDistance + 100))
  }


  const createItem = useCallback(
    (exerciseDataJson:string[], timeDataJson:string[], distanceDataJson:string[], extraNotesJson:string[], totalTime:number, totalDistance:number, allExercises:string[]) => {
      // if the realm exists, create an Item

      realm.write(() => {
  
        return new CardioWorkout(realm, {
          _id: new BSON.ObjectID,
          user_id: user?.id,
          dateCreated: new Date(),
          exercise: exerciseDataJson,
          time: timeDataJson,
          distance: distanceDataJson,
          extraNotes: extraNotesJson,
          totalTime: totalTime,
          totalDistance: totalDistance,
          allExercises: allExercises,
        });
      });
    },
    [realm, user],
  );

  const logWorkout = useCallback(
    (workoutType:string) => {
      realm.write(() => {
        return new Workouts(realm, {
          _id: new BSON.ObjectID,
          userId: user?.id,
          dateCreated: new Date(),
          workoutType: workoutType
        })
      })
    }, [realm, user])

  const updateUserStatistics = useCallback(
    (totalTime:number, totalDistance:number) => {

      let lvl = userStatistics[0].lvl;
      let xp = userStatistics[0].xp;

      let xpGained:number = totalTime + totalDistance + 100;

      let object = calculateLevel(lvl, xp, xpGained)

      let newLvl = userStatistics[0].lvl;
      let newXp = userStatistics[0].xp;
      let newXpTarget = userStatistics[0].xpTarget;

      if(object != null)
      {
        newLvl = object?.newLvl;
        newXp = object?.newXp;
        newXpTarget = object?.newXpTarget;
      }


      realm.write(() => {
        userStatistics[0].lvl = newLvl,
        userStatistics[0].xp = newXp,
        userStatistics[0].numWorkouts++,
        userStatistics[0].numCardioWorkouts++,
        userStatistics[0].xpTarget = newXpTarget
      })
    }, [realm, user])

    const calculateLevel = (currLvl:number, currXp:number, xpGained:number) => {

      let newLvl = currLvl;
      let newXp = 0;
      let newXpTarget = 0;

      let object = {
        newLvl: newLvl,
        newXp: newXp,
        newXpTarget: newXpTarget,
        xpGained: xpGained
      }

      let xpTarget = ((currLvl * 1000) + 1000)

      let continueLeveling = true;
      let xp = currXp + xpGained;

      while(continueLeveling)
      {
        if(xp < xpTarget)
        {
          continueLeveling = false;
          object.newXp = xp;
          object.newXpTarget = xpTarget;
          object.newLvl = newLvl;
          return object;  
        }

        xp -= xpTarget;
        newLvl++;
        xpTarget = ((newLvl * 1000) + 1000)
      }

    }
    
  const exercises = ["Treadmill", "Elliptical", "Bike"]
  const [selectedExercise, setSelectedExercise] = useState('')

  return (
    
    <View>
      {forms.map((form, formIndex) => (
        <View key={form.id} style={styles.form}>
      <SelectDropdown
        data={exercises}
        onSelect={(selectedItem, index) => {
          handleExerciseChange(selectedItem, formIndex)
        }}
        buttonStyle={styles.dropdownButton}
        search={true}
        defaultButtonText='Select Exercise'
      />
      {form.inputs.map((input:any, inputIndex:any) => (
        <View key={input.id} style={styles.row}>
            <View style={styles.inputs}>
              <View style={styles.inputContainer}>
                {
                  inputIndex == 0 &&
                  <Text style={{fontSize: 16, color: 'white'}}>Time</Text>
                }
                <TextInput
                  placeholder=""
                  value={input.value}
                  onChangeText={(text) => handleTimeInputChange(text, formIndex, inputIndex)}
                  style={styles.input}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.inputContainer}>
                {
                  inputIndex == 0 &&
                  <Text style={{fontSize: 16, color: 'white'}}>Distance</Text>
                }
                <TextInput
                  placeholder=""
                  value={input.value}
                  onChangeText={(text) => handleDistanceInputChange(text, formIndex, inputIndex)}
                  style={styles.input}
                  keyboardType="numeric"
                />
              </View>
            </View>
            
              <View style={styles.removeButtonContainer}>
                <Pressable onPress={() => handleRemoveInput(formIndex, inputIndex)} style={styles.removeButton}>
                  <Text style={{color: 'white', fontSize: 20}}>X</Text>
                </Pressable>
              </View>
        </View>
      ))}

      <View style={styles.textareaContainer}>
        <Text style={{color: 'white'}}>Extra Info</Text>
        <TextInput 
          value={form.extraNotes.value} 
          onChangeText={(text) => handleExtraNotesInputChange(text, formIndex)} 
          style={styles.textarea} 
          multiline={true} 
          numberOfLines={20}
          placeholder="" 
          keyboardType="default" 
        />
      </View>
      
      <Pressable onPress={() => handleAddInput(formIndex)} style={styles.addButton}>
        <Text>Add Interval</Text>
      </Pressable>

      {
        formIndex != 0 &&
        <Pressable onPress={() => handleRemoveForm(formIndex)} style={styles.addButton}>
          <Text>Remove Exercise</Text>
        </Pressable>
      }
      
      </View>
      ))}

      <Pressable onPress={handleAddForm} style={styles.button}>
        <Text>Add Exercise</Text>
      </Pressable>

      <TouchableOpacity onPress={submitData} style={styles.submitButton}>
        <Text>Submit Workout</Text>
      </TouchableOpacity>
      
    </View>
  
)};




const styles = StyleSheet.create({
  container: {
    width: '95%',
  },

  form: {
    backgroundColor: colors.red,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },

  dropdownButton: {
    width: '100%',
    borderRadius: 5,
    marginBottom: 10,
    height: 40,
  },

  row: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'row',

    marginBottom: 10,
  },

  inputs: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  inputContainer: {
    width: '48%',
    display: 'flex',
    flexDirection: 'column',

    alignItems: 'center',
  },

  input: {
    backgroundColor: '#F7D1D7',
    borderRadius: 5,
    width: '100%',
    height: 40,
  },

  removeButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 30,
  },

  removeButton: {
    backgroundColor: 'black',
    height: 30,
    width: 30,
    borderRadius: 3,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textareaContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
  },

  textarea: {
    backgroundColor: '#F7D1D7',
    borderRadius: 5,
    width: '100%',
    height: 100,
    textAlignVertical: "top"
  },

  addButton: {
    width: 120,
    backgroundColor: 'white',
    borderRadius: 5,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: 5,
  },

  button: {
    width: 150,
    backgroundColor: 'lightgray',
    borderRadius: 5,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: 5,
  },

  submitButton: {
    width: 200,
    height: 50,
    backgroundColor: colors.green,
    borderRadius: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: 5,
  },
    
  });