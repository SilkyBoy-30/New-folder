import React, {useCallback, useState, useEffect} from 'react';
import {Alert, FlatList, SafeAreaView, ScrollView, StyleSheet, Switch, Text, View} from 'react-native';
import {useUser, useRealm, useQuery} from '@realm/react';
import {CardioWorkout} from '../../../schemas/CardioWorkoutSchema';

import { colors } from '../../../Colors'
import { ResistanceWorkout } from '../../../schemas/ResistanceWorkoutSchema';

export const WeekCalendar = () => {

        const realm = useRealm();
        const user = useUser();

        useEffect(() => {
            realm.subscriptions.update(mutableSubs => {
              mutableSubs.add(
                realm.objects(CardioWorkout),
              );

              mutableSubs.add(
                realm.objects(ResistanceWorkout)
              );
            });
        }, [realm, user]);
    
        const today = new Date();
        const currentDayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
        const firstDayOfWeek = new Date(today); // Copy today's date
        const lastDayOfWeek = new Date(today); // Copy today's date
      
        // Calculate the first day of the week (Monday)
        firstDayOfWeek.setDate(today.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1));
      
        // Calculate the last day of the week (Sunday)
        lastDayOfWeek.setDate(today.getDate() - currentDayOfWeek + 7);
      
        // Generate an array to hold the dates
        const week:string[] = [];
        
        // Loop from Monday to Sunday and add each date to the array
        for (let i = 0; i < 7; i++) {
          const date = new Date(firstDayOfWeek);
          date.setDate(date.getDate() + i);
          week.push(date.toISOString().split('T')[0]);
        }

        // Get the day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
        const dayOfWeek = today.getDay();

        // Calculate the difference in days to Monday
        const daysUntilMonday = (dayOfWeek === 0) ? 6 : dayOfWeek - 1;

        // Calculate the start of the week (Monday)
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - daysUntilMonday);
        startOfWeek.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to beginning of the day

        // Calculate the end of the week (Sunday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999); // Set hours, minutes, seconds, and milliseconds to end of the day

        const cardioObjectsWithinCurrentWeek = realm.objects('CardioWorkout').sorted('dateCreated').filtered('dateCreated >= $0 AND dateCreated < $1', startOfWeek, endOfWeek);
        let cardioJSONString = JSON.stringify(cardioObjectsWithinCurrentWeek)
        let dataCardio = JSON.parse(cardioJSONString)

        const resistanceObjectsWithinCurrentWeek = realm.objects('ResistanceWorkout').sorted('dateCreated').filtered('dateCreated >= $0 AND dateCreated < $1', startOfWeek, endOfWeek);
        let resistanceJSONString = JSON.stringify(resistanceObjectsWithinCurrentWeek)
        let dataResistance = JSON.parse(resistanceJSONString)

        let cardioObjectDates = []
        let resistanceObjectDates:any = []
        for(let i = 0; i < dataCardio.length; i++)
        {
          if(dataCardio[i] != null) 
          {
            cardioObjectDates.push((dataCardio[i].dateCreated).split("T")[0])
          }
        }

        for(let i = 0; i < dataResistance.length; i++)
        {
          if(dataResistance[i] != null)
          {
            resistanceObjectDates.push((dataResistance[i].dateCreated).split("T")[0])
          }
        }

        const weekContent  = [
          {
            cardio: false,
            resistance: false,
          },
          {
            cardio: false,
            resistance: false,
          },
          {
            cardio: false,
            resistance: false,
          },
          {
            cardio: false,
            resistance: false,
          },
          {
            cardio: false,
            resistance: false,
          },
          {
            cardio: false,
            resistance: false,
          },
          {
            cardio: false,
            resistance: false,
          },
        ]

        for(let i = 0; i < cardioObjectDates.length; i++)
        {
          if(week.includes(cardioObjectDates[i]))
          {
            weekContent[week.indexOf(cardioObjectDates[i])].cardio = true;
          }
          
        }

        for(let i = 0; i < resistanceObjectDates.length; i++)
        {
          if(week.includes(resistanceObjectDates[i]))
          {
            weekContent[week.indexOf(resistanceObjectDates[i])].resistance = true;
          }
        }
       
        return (
            <View style={styles.weeklyCalendar}>
            <View style={styles.row}>
              <View style={styles.day}>
                  <Text style={styles.text}>Mon</Text>
                  <Text style={styles.text}>{week[0].split('-')[2]}</Text>
              </View>
              <View style={styles.day}>
                  <Text style={styles.text}>Tue</Text>
                  <Text style={styles.text}>{week[1].split('-')[2]}</Text>
              </View>
              <View style={styles.day}>
                  <Text style={styles.text}>Wed</Text>
                  <Text style={styles.text}>{week[2].split('-')[2]}</Text>
              </View>
              <View style={styles.day}>
                  <Text style={styles.text}>Thu</Text>
                  <Text style={styles.text}>{week[3].split('-')[2]}</Text>
              </View>
              <View style={styles.day}>
                  <Text style={styles.text}>Fri</Text>
                  <Text style={styles.text}>{week[4].split('-')[2]}</Text>
              </View>
              <View style={styles.day}>
                  <Text style={styles.text}>Sat</Text>
                  <Text style={styles.text}>{week[5].split('-')[2]}</Text>
              </View>
              <View style={styles.day}>
                  <Text style={styles.text}>Sun</Text>
                  <Text style={styles.text}>{week[6].split('-')[2]}</Text>
              </View>
            </View> 
            
            <View>
              { cardioObjectDates.length > 0 &&
                <View style={styles.workoutRow}>
                  <View style={[styles.segment, weekContent[0].cardio && {backgroundColor: colors.red}, styles.startDay, !weekContent[1].cardio && styles.endDay]}></View>
                  <View style={[styles.segment, weekContent[1].cardio && {backgroundColor: colors.red}, !weekContent[0].cardio && styles.startDay, !weekContent[2].cardio && styles.endDay]}></View>
                  <View style={[styles.segment, weekContent[2].cardio && {backgroundColor: colors.red}, !weekContent[1].cardio && styles.startDay, !weekContent[3].cardio && styles.endDay]}></View>
                  <View style={[styles.segment, weekContent[3].cardio && {backgroundColor: colors.red}, !weekContent[2].cardio && styles.startDay, !weekContent[4].cardio && styles.endDay]}></View>
                  <View style={[styles.segment, weekContent[4].cardio && {backgroundColor: colors.red}, !weekContent[3].cardio && styles.startDay, !weekContent[5].cardio && styles.endDay]}></View>
                  <View style={[styles.segment, weekContent[5].cardio && {backgroundColor: colors.red}, !weekContent[4].cardio && styles.startDay, !weekContent[6].cardio && styles.endDay]}></View>
                  <View style={[styles.segment, weekContent[6].cardio && {backgroundColor: colors.red}, !weekContent[5].cardio && styles.startDay, styles.endDay]}></View>
                </View>
              }
             
             { resistanceObjectDates.length > 0 &&
              <View style={styles.workoutRow}>
            <View style={[styles.segment, weekContent[0].resistance && {backgroundColor: colors.black}, styles.startDay, !weekContent[1].resistance && styles.endDay]}></View>
            <View style={[styles.segment, weekContent[1].resistance && {backgroundColor: colors.black}, !weekContent[0].resistance && styles.startDay, !weekContent[2].resistance && styles.endDay]}></View>
            <View style={[styles.segment, weekContent[2].resistance && {backgroundColor: colors.black}, !weekContent[1].resistance && styles.startDay, !weekContent[3].resistance && styles.endDay]}></View>
            <View style={[styles.segment, weekContent[3].resistance && {backgroundColor: colors.black}, !weekContent[2].resistance && styles.startDay, !weekContent[4].resistance && styles.endDay]}></View>
            <View style={[styles.segment, weekContent[4].resistance && {backgroundColor: colors.black}, !weekContent[3].resistance && styles.startDay, !weekContent[5].resistance && styles.endDay]}></View>
            <View style={[styles.segment, weekContent[5].resistance && {backgroundColor: colors.black}, !weekContent[4].resistance && styles.startDay, !weekContent[6].resistance && styles.endDay]}></View>
            <View style={[styles.segment, weekContent[6].resistance && {backgroundColor: colors.black}, !weekContent[5].resistance && styles.startDay, styles.endDay]}></View>
              </View>
              }
              
            </View>
            <View style={styles.border}></View>
          </View>
          
        )

        
}






const styles = StyleSheet.create({
    viewWrapper: {
      flex: 1,
    },

    button: {
        width: '97.5%',
        height: 50,
        backgroundColor: colors.blue,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 5,
    
        display: 'flex',
        justifyContent: 'center',
      },
    
    buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    },

    weeklyCalendar: {
      display: 'flex',
      flexDirection: 'column',
      width: '95%',

      marginLeft: 'auto',
      marginRight: 'auto',


    },

    row: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-evenly',
      marginTop: 15,
      marginBottom: 15,
    },

    day: {
      display: 'flex',
      flexDirection: 'column',
      width: '14.285%',
      height: 60,
      justifyContent: 'space-between',
      alignContent: 'space-between',

      borderRightColor: 'gray',
      borderRightWidth: 1,
    },

    lastDay: {
      borderRightWidth: 0,
    },

    activeDay: {
      backgroundColor: 'yellow',
    },

    text: {
      fontSize: 20,
      textAlign: 'center',
    },

    border: {
      height: 2,
      backgroundColor: 'gray',
      width: '100%',
      marginBottom: 5,
    },

    workoutRow: {
      width: '100%',
      height: 4,

      display: 'flex',
      flexDirection: 'row',

      marginRight: 'auto',
      marginLeft: 'auto',

      marginBottom: 3,
      
    },

    segment: {
      width: '14.285%',
      height: 4,
    },

    startDay: {
      borderBottomLeftRadius: 5,
      borderTopLeftRadius: 5,
    },

    endDay: {
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5,
    },
    
  });