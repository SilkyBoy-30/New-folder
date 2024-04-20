import React, {useCallback, useState, useEffect} from 'react';
import {Alert, FlatList, Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, View} from 'react-native';
import { colors } from '../../../Colors'
import { useQuery, useRealm, useUser } from '@realm/react';
import { Workouts } from '../../../schemas/WorkoutSchema';
import { CardioWorkout } from '../../../schemas/CardioWorkoutSchema';
import { ResistanceWorkout } from '../../../schemas/ResistanceWorkoutSchema';
import { TouchableOpacity } from 'react-native';


type CalendarProps = {
    onPress:any,
    selectedMonth:number,
}

export const Calendar = (props: CalendarProps) => {

    const realm = useRealm();
    const user = useUser();

    const currentDate = new Date()
    let currentDay = currentDate.toISOString().split("T")[0].split("-")[2]
    const year = currentDate.getFullYear()
    let month = currentDate.getMonth()

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let monthWord = monthNames[month];

    if(props.selectedMonth != -1)
    {
      month = props.selectedMonth;
      currentDay = ''
    }

    const startOfMonth = new Date(year, month, 1)
    const endOfMonth = new Date(year, month + 1, 0)

    const workouts = useQuery(Workouts).sorted('dateCreated').filtered('dateCreated >= $0 AND dateCreated < $1', startOfMonth, endOfMonth);

    let numDaysInMonth;
    let firstDayOfWeek;
    
    if(props.selectedMonth != -1)
    {
      // Get the number of days in the current month
      numDaysInMonth = new Date(currentDate.getFullYear(), month + 1, 0).getDate();

      // Get the day of the week for the first day of the month
      firstDayOfWeek = new Date(currentDate.getFullYear(), month, 0).getDay();
    }
    else
    {
      // Get the number of days in the current month
      numDaysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

      // Get the day of the week for the first day of the month
      firstDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDay();
    }
    

    // Initialize an array to hold the calendar days
    const calendarDays = [];

    // Generate the calendar days
    for (let i = 0; i < firstDayOfWeek; i++) {
        calendarDays.push('');
    }
    for (let i = 1; i <= numDaysInMonth; i++) {
        calendarDays.push(i);
    }

    if(calendarDays.length <= 35)
    {
      for(let i = calendarDays.length; i < 35; i++)
      {
        calendarDays.push('');
      }
    }
    else 
    {
      for(let i = calendarDays.length; i < 42; i++)
      {
        calendarDays.push('');
      }
    }

    

    //console.log(numDaysInMonth)


    const extractDayAndWorkoutType = (data: any): any[] => {
        return data.map((item: any) => {
          const dayNumber = new Date(item.dateCreated).getDate(); // Extract day number from the date
          return { dayNumber, workoutType: item.workoutType };
        });
    };

    const result = extractDayAndWorkoutType(workouts)

    const dayNumbers = result.map(item => item.dayNumber);
    const workoutTypes = result.map(item => item.workoutType);

    const mergedData:any = {};

    for (let i = 0; i < dayNumbers.length; i++) {
        const dayNumber = dayNumbers[i];
        const workoutType = workoutTypes[i];
      
        if (!mergedData[dayNumber]) {
          mergedData[dayNumber] = new Set([workoutType]); // Use a Set to store unique workout types
        } else {
          mergedData[dayNumber].add(workoutType); // Add workout type to the Set
        }
      }

    // Convert Sets to arrays
    for (const dayNumber in mergedData) {
        mergedData[dayNumber] = Array.from(mergedData[dayNumber]);
    }

    //console.log(mergedData)
      
    //----------------------------------------------------------
    const [selectedDay, setSelectedDay] = useState<string>('none')

    const selectDay = (day:string) => {
        if(day == selectedDay)
        {
            setSelectedDay('none')
        }
        else{
            setSelectedDay(day)
        }
    }
//Hi
    useEffect(() => {
        realm.subscriptions.update(mutableSubs => {
          mutableSubs.add(realm.objects(CardioWorkout));
          mutableSubs.add(realm.objects(ResistanceWorkout));
          mutableSubs.add(realm.objects(Workouts));
        });
      }, [realm, user]);

    return (
        <View>
          {
            props.selectedMonth == -1 &&
            <View>
              <Text style={styles.title}>{monthWord} {year}</Text>
              <View style={styles.smallBorder}></View>
            </View>
            
          }
            
            <View style={styles.weekdays}>
              <View style={styles.weekday}><Text style={{color: colors.blue}}>M</Text></View>
              <View style={styles.weekday}><Text style={{color: colors.blue}}>T</Text></View>
              <View style={styles.weekday}><Text style={{color: colors.blue}}>W</Text></View>
              <View style={styles.weekday}><Text style={{color: colors.blue}}>T</Text></View>
              <View style={styles.weekday}><Text style={{color: colors.blue}}>F</Text></View>
              <View style={styles.weekday}><Text style={{color: colors.blue}}>S</Text></View>
              <View style={styles.weekday}><Text style={{color: colors.blue}}>S</Text></View>
            </View>
        <View style={styles.container}>
            
            {calendarDays.map((day, index) => (
            <TouchableOpacity key={index} style={[styles.day, (selectedDay == day.toString() && styles.selectedDay)]} onPress={() => {props.onPress(day.toString()), selectDay(day.toString())}}>
            <Text style={[styles.dayText, (currentDay == day && styles.currentDay)]}>{day || ' '}</Text>
            {
                mergedData[day] &&
                <View style={styles.dots}>
                    {
                        mergedData[day].includes("Cardio") &&
                        <View style={[styles.dot, {backgroundColor: colors.red}]}></View>
                    }
                    {
                        mergedData[day].includes("Resistance") &&
                        <View style={[styles.dot, {backgroundColor: colors.black}]}></View>
                    }
                </View>
            }
            
          </TouchableOpacity>
        ))}
      </View>
        </View>
        
    )

}

const styles = StyleSheet.create({
    
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        marginBottom: 10,
      },
      weekdays: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },

      weekday: {
        width: '14.28%', // 1/7th of the width for each day of the week
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'

      },

      smallBorder: {
        width: 100,
        height: 2,
        backgroundColor: 'gray',
        marginRight: 'auto',
        marginLeft: 'auto',
        marginBottom: 10,
      },

      day: {
        width: '14.28%', // 1/7th of the width for each day of the week
        height: 1,
        aspectRatio: 1/1, // Ensure each day is square
        display: 'flex',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
      },
      dayText: {
        fontSize: 16,
        marginTop: 10,
      },

      currentDay: {
        color: 'blue'
      },

      selectedDay: {
        backgroundColor: 'yellow',
      },

      title: {
        textAlign: 'center',
        fontSize: 20,
        marginTop: 10,
      },

      dots: {
        position: 'absolute',
        bottom: 5,
        width: '90%',
        marginRight: 'auto',
        marginLeft: 'auto',

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',

      },

      dot: {
        width: 5,
        height: 5,
        backgroundColor: 'black',
        borderRadius: 5,
      }
    });
    