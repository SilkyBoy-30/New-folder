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

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December'];
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
    const lastDayOfPrevMonth = new Date(year, month, 0).getDate();

    // Get the number of days from the previous month to include
    const numDaysFromPrevMonth = firstDayOfWeek;

    // Get the number of days from the next month to include
    const numDaysFromNextMonth = 35 - numDaysInMonth - numDaysFromPrevMonth;

    // Generate the calendar days
    // Days from the previous month
    for (let i = lastDayOfPrevMonth - numDaysFromPrevMonth + 1; i <= lastDayOfPrevMonth; i++) {
      calendarDays.push({ day: i, isCurrentMonth: false });
    }

    // Days from the current month
    for (let i = 1; i <= numDaysInMonth; i++) {
      calendarDays.push({ day: i, isCurrentMonth: true });
    }

    // Days from the next month
    for (let i = 1; i <= numDaysFromNextMonth; i++) {
      calendarDays.push({ day: i, isCurrentMonth: false });
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

    const selectDay = (day: string) => {
      if (selectedDay === day) {
          setSelectedDay('');
      } else {
          setSelectedDay(day);
      }
  };
  
  

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
              <Text style={[styles.title, {fontWeight: '500'}, {marginBottom: 3.5}]}>{monthWord}</Text>
            </View>
            
          }
            
            <View style={styles.weekdays}>
              <View style={[styles.blueCircle, styles.weekday]}><Text style={{color: colors.blue, fontSize: 15}}>M</Text></View>
              <View style={[styles.blueCircle, styles.weekday]}><Text style={{color: colors.blue, fontSize: 15}}>T</Text></View>
              <View style={[styles.blueCircle, styles.weekday]}><Text style={{color: colors.blue, fontSize: 15}}>W</Text></View>
              <View style={[styles.blueCircle, styles.weekday]}><Text style={{color: colors.blue, fontSize: 15}}>T</Text></View>
              <View style={[styles.blueCircle, styles.weekday]}><Text style={{color: colors.blue, fontSize: 15}}>F</Text></View>
              <View style={[styles.blueCircle, styles.weekday]}><Text style={{color: colors.blue, fontSize: 15}}>S</Text></View>
              <View style={[styles.blueCircle, styles.weekday]}><Text style={{color: colors.blue, fontSize: 15}}>S</Text></View>
            </View>
        <View style={styles.container}>
            
        {calendarDays.map(({day, isCurrentMonth}, index) => (
    <TouchableOpacity
    key={index}
    style={[
        styles.day,
        !isCurrentMonth && styles.nonCurrentMonthDay, // Apply nonCurrentMonthDay style to days from previous and next months
        (selectedDay === day.toString() && isCurrentMonth && styles.selectedDay)
    ]}
    onPress={() => {
        if (isCurrentMonth) {
            if (selectedDay === day.toString()) {
                selectDay(''); // Deselect the current day if already selected
            } else {
                props.onPress(day.toString());
                selectDay(day.toString());
            }
        } else {
            // Don't allow selection of days from the previous or next month
            return;
        }
    }}
>
    <Text style={[styles.dayText, (parseInt(currentDay) === day && isCurrentMonth && styles.currentDay)]}>
        {day || ' '}
    </Text>
    {mergedData[day] &&
        <View style={styles.dots}>
            {mergedData[day].includes("Cardio") &&
                <View style={[styles.dot, { backgroundColor: 'red' }]}></View>
            }
            {mergedData[day].includes("Resistance") &&
                <View style={[styles.dot, { backgroundColor: 'black' }]}></View>
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
        paddingTop: 12,
        paddingBottom: 7,
      },

      weekdays: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },

      weekday: {
        //width: '14.28%', // 1/7th of the width for each day of the week
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 16.95,
      },

      blueCircle: {
        borderColor: colors.blue, 
        borderWidth: 1, 
        borderRadius: 50, 
        width: 25, 
        height: 25,
      },

      day: {
        width: '14.28%', // 1/7th of the width for each day of the week
        height: 1,
        aspectRatio: 1/1, // Ensure each day is square
        display: 'flex',
        alignItems: 'center',
        //borderColor: '#696B5C',
        //borderWidth: 1.2,
      },
      
      dayText: {
        fontSize: 21,
        //marginTop: 3,
      },

      currentDay: {
        color: '#2D46E8',
      },

      selectedDay: {
        backgroundColor: '#ECD5AD',
        //borderColor: '#000000',
        marginHorizontal: 11.9,
        //borderWidth: 1, 
        borderRadius: 50, 
        width: 35, 
        height: 35,
      },

      nonCurrentMonthDay: {
        backgroundColor: '#C7C9C0', // Gray out non-current month days
        borderColor: '#C7C9C0',
        marginHorizontal: 11.9,
        borderWidth: 1, 
        borderRadius: 35/2, 
        width: 35, 
        height: 35,
      },

      title: {
        textAlign: 'center',
        fontSize: 24,
        marginTop: 5,
      },

      dots: {
        position: 'relative',
        bottom: -7,
        width: 35,
        //marginRight: 'auto',
        //marginLeft: 'auto',

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
      },

      dot: {
        width: 10,
        height: 10,
        backgroundColor: 'black',
        borderRadius: 8,
      }
    });

