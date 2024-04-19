import React, {useCallback, useState, useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Alert, FlatList, Pressable, SafeAreaView, StyleSheet, Switch, Text, View} from 'react-native';
import { CardioStats } from '../specific/CardioStats';
import moment from 'moment';

import { colors } from '../../../Colors'

type GeneralDailyStatsProps = {
    selectedDay: string,
    cardioObjects:any,
    resistanceObjects:any,
}

export const GeneralDailyStats = (props: GeneralDailyStatsProps) => {

    let cardioObjectsOfSelectedDay:any[] = []
    for(let i = 0; i < props.cardioObjects.length; i++)
    {

        let cardioObjectDate = (props.cardioObjects[i].dateCreated).toISOString().split("T")[0]
        if(props.selectedDay == cardioObjectDate)
        {
            cardioObjectsOfSelectedDay.push(props.cardioObjects[i])
        }
    }  

    let totalTime = 0;
    let totalDistance = 0;
    for(let i = 0; i < cardioObjectsOfSelectedDay.length; i++)
    {
        totalTime += cardioObjectsOfSelectedDay[i].totalTime;
        totalDistance += cardioObjectsOfSelectedDay[i].totalDistance;
    }

    const [showCardioStats, setShowCardioStats] = useState<boolean>(false);

    const calcShowStats = () => {
        if(showCardioStats)
        {
            setShowCardioStats(false)
        }
       
    }

    const calculateDate = (date:string) => {

        const dateObject = new Date(date)

        const formattedDate = moment(dateObject).format('D MMM')
        return formattedDate;
    }

    

    return (
            <SafeAreaView style={styles.container}>
            {
                (cardioObjectsOfSelectedDay.length > 0 && !showCardioStats)&&
                <Pressable onPress={() => setShowCardioStats(true)} style={styles.containerCardio}>
                    <Text style={[styles.title, {color: 'white'}]}>Cardio</Text>
                    <Text style={[styles.text, {color: 'white'}]}>Number of Cardio Workouts: {cardioObjectsOfSelectedDay.length}</Text>
                    <Text style={[styles.text, {color: 'white'}]}>Total Time Spent: {totalTime} min</Text>
                    <Text style={[styles.text, {color: 'white', paddingBottom: 10,}]}>Total Distance Travelled: {totalDistance} KM</Text>
                </Pressable>
            }

            {
                showCardioStats &&
                <CardioStats data={cardioObjectsOfSelectedDay} timeline="day" onPress={calcShowStats}/>
                
            }
            
        </SafeAreaView>
        
        
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
    },

    containerCardio: {
        width: '95%',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: colors.red,
        borderRadius: 5,
    },

    title: {
        fontSize: 30,
        textDecorationLine: 'underline',
    },

    text: {
        fontSize: 20,
    }
})