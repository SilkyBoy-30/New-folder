import React, {useCallback, useState, useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Alert, FlatList, Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import {useUser, useRealm, useQuery} from '@realm/react';
import {CardioWorkout} from '../../../schemas/CardioWorkoutSchema';

import { GeneralCardioStats } from '../general/GeneralCardioStats';
import { GeneralResistanceStats } from '../general/GeneralResistanceStats';
import { CardioStats } from '../specific/CardioStats';
import { ResistanceStats } from '../specific/ResistanceStats';

import { colors } from '../../../Colors'
import { ResistanceWorkout } from '../../../schemas/ResistanceWorkoutSchema';

import { WeekCalendar } from './WeekCalendar';

export const WeekSummary = () => {

  const realm = useRealm();
  const user = useUser();

  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday

  // Calculate the start of the week (Monday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  startOfWeek.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to beginning of the day

  // Calculate the end of the week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const cardioObjectsWithinCurrentWeek = realm.objects('CardioWorkout').sorted('dateCreated').filtered('dateCreated >= $0 AND dateCreated < $1', startOfWeek, endOfWeek);

  const resistanceObjectsWithinCurrentWeek = realm.objects('ResistanceWorkout').sorted('dateCreated').filtered('dateCreated >= $0 AND dateCreated < $1', startOfWeek, endOfWeek);


  const [showGeneralWeeklyStats, setShowGeneralWeeklyStats] = useState<boolean>(true)
  const [statsType, setStatsType] = useState<string>('')

  const setShowGeneralWeeklyStatsToTrue = () => {
    setShowGeneralWeeklyStats(true)
  }


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


  return (
    <ScrollView >
    
    <WeekCalendar />
    
    { showGeneralWeeklyStats &&
    <View>
      {
        (cardioObjectsWithinCurrentWeek.length == 0 && resistanceObjectsWithinCurrentWeek.length == 0) &&
        <Text>Log a workout to see some statistics!!</Text>
      }
      {
        (cardioObjectsWithinCurrentWeek.length > 0 && showGeneralWeeklyStats) &&
        <TouchableOpacity onPress={() => {setShowGeneralWeeklyStats(false); setStatsType("Cardio")}}>
          <GeneralCardioStats cardioObjects={cardioObjectsWithinCurrentWeek}/>
          <View style={styles.expandButton}><Text style={{color: 'black', fontSize:28}}>+</Text></View>
        </TouchableOpacity> 
      }
      {
        (resistanceObjectsWithinCurrentWeek.length > 0 && showGeneralWeeklyStats) &&
        <TouchableOpacity onPress={() => {setShowGeneralWeeklyStats(false); setStatsType("Resistance")}}>
          <GeneralResistanceStats resistanceObjects={resistanceObjectsWithinCurrentWeek}/>
          <View style={styles.expandButton}><Text style={{color: 'black', fontSize:28}}>+</Text></View>
        </TouchableOpacity>
      }
    </View>
    }

    {
      !showGeneralWeeklyStats &&
      <View style={styles.container}>
        {
          statsType == "Cardio" &&
          <CardioStats data={cardioObjectsWithinCurrentWeek} timeline='week' onPress={setShowGeneralWeeklyStatsToTrue}/>
        }
        {
          statsType == "Resistance" &&
          <ResistanceStats data={resistanceObjectsWithinCurrentWeek} timeline='week' onPress={setShowGeneralWeeklyStatsToTrue} />
        }
      </View>
    }
    
    
    </ScrollView>
    
  )

        
}






const styles = StyleSheet.create({
 
    container: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      marginBottom: 10,

    },

    expandButton: {
      position: 'absolute',
      top: 0,
      right: 20,
  }
  });