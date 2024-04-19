import React, { useEffect, useState } from 'react';
import { View, SectionList, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { colors } from '../../../Colors';
import { SelectList } from 'react-native-dropdown-select-list'
import { Calendar } from '../monthly/Calendar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useQuery, useRealm, useUser } from '@realm/react';
import { CardioWorkout } from '../../../schemas/CardioWorkoutSchema';
import { ResistanceWorkout } from '../../../schemas/ResistanceWorkoutSchema';
import { Workouts } from '../../../schemas/WorkoutSchema';
import { GeneralCardioStats } from '../general/GeneralCardioStats';
import { GeneralResistanceStats } from '../general/GeneralResistanceStats';
import { MonthSummary } from '../monthly/MonthSummary';


export const YearSummary = () => {

  const realm = useRealm();
  const user = useUser();

  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const months = [
    {key:'0', value:'Full Year'},
    {key:'1', value:'January'},
    {key:'2', value:'February'},
    {key:'3', value:'March'},
    {key:'4', value:'April'},
    {key:'5', value:'May'},
    {key:'6', value:'June'},
    {key:'7', value:'July'},
    {key:'8', value:'August'},
    {key:'9', value:'September'},
    {key:'10', value:'October'},
    {key:'11', value:'November'},
    {key:'12', value:'December'},
  ]

  const currentDate = new Date()
  const year = currentDate.getFullYear()

  const startOfYear = new Date(year, 0, 1)
  const endOfYear = new Date(year, 12, 0)

  const cardioObjectsWithinCurrentYear = realm.objects('CardioWorkout').sorted('dateCreated').filtered('dateCreated >= $0 AND dateCreated < $1', startOfYear, endOfYear);

  const resistanceObjectsWithinCurrentYear = realm.objects('ResistanceWorkout').sorted('dateCreated').filtered('dateCreated >= $0 AND dateCreated < $1', startOfYear, endOfYear);

  let monthValues = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  const calculateMonthNumber = (month: string) => {
    
    let index = monthValues.indexOf(month)
    //console.log("index: ", index)
   
    return index
  }

  console.log(calculateMonthNumber(selectedMonth))

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(
        realm.objects(CardioWorkout),
      );

      mutableSubs.add(
        realm.objects(ResistanceWorkout)
      );

      mutableSubs.add(
        realm.objects(Workouts)
      );
    });
  }, [realm, user]);

  
  return (

    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.monthOptions}>
      <SelectList 
        setSelected={(val:any) => {
          if(val == "Full Year")
          {
            setSelectedMonth('')
          }
          else
          {
            setSelectedMonth(val)
          }
          
        }} 
        data={months} 
        save="value"
        search={false}
        placeholder='Select month'
        closeicon={<MaterialCommunityIcons name="close" color={'black'} size={30} />}
      />
      </View>
      {
        selectedMonth != '' &&
        <MonthSummary selectedMonth={calculateMonthNumber(selectedMonth)}/>
      }
      {
        selectedMonth == '' &&
        <View style={styles.generalStats}>
        {
            cardioObjectsWithinCurrentYear.length > 0 &&
            <GeneralCardioStats cardioObjects={cardioObjectsWithinCurrentYear}/>
        }
        {
            resistanceObjectsWithinCurrentYear.length > 0 &&
            <GeneralResistanceStats resistanceObjects={resistanceObjectsWithinCurrentYear}/>
        }
        </View>
      }

      

      
      
    </ScrollView>
   

   
  );
};

const styles = StyleSheet.create({

  container: {
    width: '100%',

    display: 'flex',
    alignItems: 'center',
  },

  monthOptions: {
    width: 200,
    marginTop: 20,
    marginBottom: 10,
  },

  generalStats: {
    width: '100%',
  },

  expandButton: {
    position: 'absolute',
    top: 0,
    right: 20,
},

subtitle: {
    textAlign: 'center',
    fontSize: 20,
},

smallBorder: {
    width: 100,
    height: 2,
    backgroundColor: 'gray',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: 10,
},

text: {
    textAlign: 'center',
    fontSize: 20,
}
  
 

})
