import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View, TouchableOpacity, ScrollView, Image} from 'react-native';
import {colors} from './Colors';
import { LogWorkoutCardio } from './components/LogWorkoutCardio'; 
import { LogWorkoutResistance } from './components/LogWorkoutResistance';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SubmitCompletion } from './SubmitCompletion';
import { shadow } from './Shadow';


export function LogWorkoutScreen() {

  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showSection, setShowSection] = useState<string>('');

  const calcShowSection = (workoutType: string) => {
    setShowSection(workoutType)
    setShowGrid(false)
  }


  const clearWorkout = () => {
    setShowGrid(true)
    setShowSection('')
  }

  const onSubmit = (levelUp:boolean, gainedXp:number) => {
    setShowGrid(false)
    setShowSection('')

    setLevelUp(levelUp)
    setGainedXp(gainedXp)

    setShowResults(true)
  }

  const closeResults = () => {
    setShowResults(false)
    setShowGrid(true)
  }
  

  const [showResults, setShowResults] = useState<boolean>(false)
  const [gainedXp, setGainedXp] = useState<number>(0)
  const [levelUp, setLevelUp] = useState<boolean>(false)
  

  return (
    <View style={styles.viewWrapper}>

      { showResults &&
        <SubmitCompletion onPress={closeResults} levelUp={levelUp} gainedXp={gainedXp}/>
      }

      { showGrid &&
        <View style={styles.container}>  
          <TouchableOpacity style={[styles.gridOption, {backgroundColor: '#ED97A5'}, shadow.shadow]} onPress={() => calcShowSection("Cardio")}>
            <View style={[styles.circle, {backgroundColor: colors.red}]}>
              <Image style={styles.image} source={require('./resources/Heart.png')} />
            </View>
            <Text style={styles.plus}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gridOption, {backgroundColor: '#afb0b2'}, shadow.shadow]} onPress={() => calcShowSection("Resistance")}>
            <View style={[styles.circle, {backgroundColor: colors.black}]}>
              <MaterialCommunityIcons name="weight" color={'black'} size={80}/>
            </View>
            <Text style={styles.plus}>+</Text>
          </TouchableOpacity>
        </View>
      }

  
      

      <ScrollView contentContainerStyle={styles.containerForm}>

        { (!showGrid && !showResults) &&

          <Pressable style={styles.button} onPress={() => clearWorkout()}>
            <Text>Select a different workout</Text>
          </Pressable>
        }
        
        { showSection == "Cardio" &&
          <LogWorkoutCardio onPress={onSubmit}/>
        }
        { showSection == "Resistance" &&
          <LogWorkoutResistance onPress={onSubmit}/>
        }
        
        
      </ScrollView>

    </View>
  )
}

const styles = StyleSheet.create({
    viewWrapper: {
      padding: 10
    },

   
    container: {
      width: '97.5%',
      aspectRatio: 1/1,
      borderRadius: 20,
      marginRight: 'auto',
      marginLeft: 'auto',

      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },

    plus: {
      position: 'absolute',
      color: 'black',

      bottom: 0,
      right: 5,

      fontSize: 40,
    },

    gridOption: {
      width: '48%',
      aspectRatio: 1/1,
      borderRadius: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    circle: {
      width: '70%',
      aspectRatio: 1/1,
      borderRadius: 100,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    image: {
      width: '70%',
      height: '70%',
      resizeMode: 'contain',
    },

    containerForm: {
      display: 'flex',
      width: '100%',

      alignItems: 'center',
      justifyContent: 'center',
    }, 

    cardioContainer: {
      width: '97%',
      backgroundColor: colors.red,
      borderRadius: 10,
      padding: 10,
    },

    form: {
      width: 300,
      height: 400,
    },

    button: {
      width: 170,
      backgroundColor: 'lightgray',
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
    },

    

    
    
  });