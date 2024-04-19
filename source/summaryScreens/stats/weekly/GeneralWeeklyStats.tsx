import React, {useCallback, useState, useEffect} from 'react';
import {Alert, FlatList, Pressable, SafeAreaView, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import { CardioStats } from '../specific/CardioStats';

import { colors } from '../../../Colors'
import { ResistanceStats } from '../specific/ResistanceStats';

type GeneralWeeklyStatsProps = {
    cardioObjects:any,
    resistanceObjects:any,
}

export const GeneralWeeklyStats = (props: GeneralWeeklyStatsProps) => {

    let totalTime = 0;
    let totalDistance = 0;
    for(let i = 0; i < props.cardioObjects.length; i++)
    {
        totalTime += props.cardioObjects[i].totalTime;
        totalDistance += props.cardioObjects[i].totalDistance;
    }

    let totalVolume = 0;
    let totalReps = 0;
    for(let i = 0; i < props.resistanceObjects.length; i++)
    {
        totalVolume += props.resistanceObjects[i].totalVolume;
        totalReps += props.resistanceObjects[i].totalReps;
    }

    const [showingStats, setShowingStats] = useState<boolean>(false);
    const [showStatsType, setShowStatsType] = useState<string>('');

    const calcShowStats = (statsType:string) => {
        setShowStatsType(statsType)
    }

    const setShowingStatsToFalse = () => {
        setShowingStats(false)
    }

    return (
        <SafeAreaView style={styles.container}>
            {
                (props.cardioObjects.length > 0 && !showingStats) &&
                <TouchableOpacity onPress={() => {calcShowStats("Cardio"); setShowingStats(true)}} style={[styles.containerStats, {backgroundColor: colors.red}]}>
                    <Text style={[styles.title, {color: 'white'}]}>Cardio</Text>
                    <Text style={[styles.text, {color: 'white'}]}>{props.cardioObjects.length} workouts</Text>
                    <Text style={[styles.text, {color: 'white'}]}>{totalTime} min spent</Text>
                    <Text style={[styles.text, {color: 'white', paddingBottom: 10,}]}>{totalDistance} KM travelled</Text>
                </TouchableOpacity>
            }

            {
                (showStatsType == "Cardio" && showingStats) &&
                <CardioStats data={props.cardioObjects} timeline="week" onPress={setShowingStatsToFalse}/>
                
            }

            {
                (props.resistanceObjects.length > 0 && !showingStats) &&
                <TouchableOpacity onPress={() => {calcShowStats("Resistance"); setShowingStats(true)}} style={[styles.containerStats, {backgroundColor: colors.black}]}>
                    <Text style={[styles.title, {color: 'white'}]}>Resistance</Text>
                    <Text style={[styles.text, {color: 'white'}]}>{props.resistanceObjects.length} workouts</Text>
                    <Text style={[styles.text, {color: 'white'}]}>{totalVolume} kgs lifted</Text>
                    <Text style={[styles.text, {color: 'white', paddingBottom: 10,}]}>{totalReps} reps</Text>
                </TouchableOpacity>
            }

            {
                (showStatsType == "Resistance" && showingStats) &&
                <ResistanceStats data={props.resistanceObjects} timeline="week" onPress={setShowingStatsToFalse}/>
                
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

    containerStats: {
        width: 250,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: colors.red,
        borderRadius: 5,
        marginBottom: 10,
    },

    title: {
        fontSize: 30,
        textDecorationLine: 'underline',
    },

    text: {
        fontSize: 20,
    },

    closeButton: {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 20,
        height: 20,
        backgroundColor: 'black',
        top: 0,
        right: 0,
    }
})