import React, {useCallback, useState, useEffect} from 'react';
import {Alert, FlatList, Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import { colors } from '../../../Colors'
import { Calendar } from './Calendar';
import { Workouts } from '../../../schemas/WorkoutSchema';
import { useQuery, useRealm, useUser } from '@realm/react';
import { CardioWorkout } from '../../../schemas/CardioWorkoutSchema';
import { ResistanceWorkout } from '../../../schemas/ResistanceWorkoutSchema';
import { GeneralResistanceStats } from '../general/GeneralResistanceStats';
import { GeneralCardioStats } from '../general/GeneralCardioStats';
import { CardioStats } from '../specific/CardioStats';
import { ResistanceStats } from '../specific/ResistanceStats';


type MonthSummaryProps = {
    selectedMonth: number,
}


export const MonthSummary = (props: MonthSummaryProps) => {

    const realm = useRealm();
    const user = useUser();

    const currentDate = new Date()
    const year = currentDate.getFullYear()
    let month = currentDate.getMonth()

    if(props.selectedMonth != -1)
    {
        month = props.selectedMonth;
    }

    const startOfMonth = new Date(year, month, 1)
    const endOfMonth = new Date(year, month + 1, 0)

    const cardioObjectsWithinCurrentMonth = realm.objects('CardioWorkout').sorted('dateCreated').filtered('dateCreated >= $0 AND dateCreated < $1', startOfMonth, endOfMonth);

    const resistanceObjectsWithinCurrentMonth = realm.objects('ResistanceWorkout').sorted('dateCreated').filtered('dateCreated >= $0 AND dateCreated < $1', startOfMonth, endOfMonth);



    const [showGeneralMonthlyStats, setShowGeneralMonthlyStats] = useState<boolean>(true)
    const [statsType, setStatsType] = useState<string>('')
    const [showingStats, setShowingStats] = useState<boolean>(false)

    const [workoutData, setWorkoutData] = useState<any>()
    const [selectedDay, setSelectedDay] = useState<string>('')

    const [cardioData, setCardioData] = useState<any>();
    const [resistanceData, setResistance] = useState<any>();

    let cardioObjectsOfSelectedDay:any = [];
    let resistanceObjectsOfSelectedDay:any = [];

    const setShowGeneralMonthlyStatsToTrue = () => {
        setStatsType('')
        setShowingStats(false)
    }

    
    const selectDay = (day:string) => {
        if(day == selectedDay)
        {
            setSelectedDay('')
            if(!showGeneralMonthlyStats)
            {
                setShowGeneralMonthlyStats(true)
            }
            return;
        }
        else
        {
            setStatsType('')
            setShowingStats(false)
            setSelectedDay(day)
        }

        const newDate = new Date(year, month, Number(day))

        const startOfDay = new Date(newDate)
        startOfDay.setHours(0,0,0,0);

        const endOfDay = new Date(newDate)
        endOfDay.setHours(23, 59, 59, 999)

        cardioObjectsOfSelectedDay = realm.objects('CardioWorkout').sorted('dateCreated').filtered('dateCreated >= $0 AND dateCreated < $1', startOfDay, endOfDay);
        resistanceObjectsOfSelectedDay = realm.objects('ResistanceWorkout').sorted('dateCreated').filtered('dateCreated >= $0 AND dateCreated < $1', startOfDay, endOfDay);
        setCardioData(cardioObjectsOfSelectedDay)
        setResistance(resistanceObjectsOfSelectedDay)

        if(showGeneralMonthlyStats)
        {
            setShowGeneralMonthlyStats(false)
        }


    }

    const calculateDateEnding = (day:any) => {

        let lastChar = day.charAt(day.length - 1);
        
        if(lastChar == '1')
        {
            return 'st'
        }
        else if(lastChar == '2')
        {
            return 'nd'
        }
        else if(lastChar == '3')
        {
            return 'rd'
        }
        else if(lastChar == '4' || lastChar == '5' || lastChar == '6' || lastChar == '7' || lastChar == '8' || lastChar == '9' || lastChar == '0')
        {
            return 'th'
        }
    }

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
        <ScrollView>
            <Calendar onPress={selectDay} selectedMonth={props.selectedMonth}/>

            { showGeneralMonthlyStats &&
                <View>
                { 
                    (cardioObjectsWithinCurrentMonth.length == 0 && resistanceObjectsWithinCurrentMonth.length == 0) &&
                    <Text style={styles.text}>No workout data for selected month!</Text>
                    
                }
                {
                    cardioObjectsWithinCurrentMonth.length > 0 &&
                    <GeneralCardioStats cardioObjects={cardioObjectsWithinCurrentMonth}/>
                }
                {
                    resistanceObjectsWithinCurrentMonth.length > 0 &&
                    <GeneralResistanceStats resistanceObjects={resistanceObjectsWithinCurrentMonth}/>
                }
                </View>
            }
            { !showGeneralMonthlyStats &&
                <View>
                    <Text style={styles.subtitle}>{selectedDay}{calculateDateEnding(selectedDay)}</Text>
                    <View style={styles.smallBorder}></View>
                    {
                        (cardioData.length == 0 && resistanceData.length == 0) &&
                        <Text style={styles.text}>No workout data for selected day!</Text>
                        
                    }
                   
                    {
                        (cardioData.length && !showingStats) > 0 &&
                        <TouchableOpacity onPress={() => {setStatsType("Cardio"); setShowingStats(true)}}>
                        <GeneralCardioStats cardioObjects={cardioData}/>
                        <View style={styles.expandButton}><Text style={{color: 'black', fontSize:28}}>+</Text></View>
                        </TouchableOpacity> 
                    }
                    {
                        (resistanceData.length && !showingStats) > 0 &&
                        <TouchableOpacity onPress={() => {setStatsType("Resistance"); setShowingStats(true)}}>
                        <GeneralResistanceStats resistanceObjects={resistanceData}/>
                        <View style={styles.expandButton}><Text style={{color: 'black', fontSize:28}}>+</Text></View>
                        </TouchableOpacity>
                    }
                </View>
            }

            {
            (!showGeneralMonthlyStats && statsType != '') &&
            <View style={styles.container}>
                {
                    statsType == "Cardio" &&
                    <CardioStats data={cardioData} timeline={'day ' + selectedDay} onPress={setShowGeneralMonthlyStatsToTrue}/>
                }
                {
                    statsType == "Resistance" &&
                    <ResistanceStats data={resistanceData} timeline={'day ' + selectedDay} onPress={setShowGeneralMonthlyStatsToTrue} />
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
        marginBottom: 10,
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
  });