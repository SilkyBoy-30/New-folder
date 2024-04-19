import React, {useCallback, useState, useEffect} from 'react';
import {Alert, FlatList, Pressable, SafeAreaView, StyleSheet, Switch, Text, View} from 'react-native';
import { CardioStats } from '../specific/CardioStats';

import { colors } from '../../../Colors'
import { ResistanceStats } from '../specific/ResistanceStats';

type GeneralResistanceStatsProps = {
    resistanceObjects:any,
}

export const GeneralResistanceStats = (props: GeneralResistanceStatsProps) => {

    let totalVolume = 0;
    let totalReps = 0;
    for(let i = 0; i < props.resistanceObjects.length; i++)
    {
        totalVolume += props.resistanceObjects[i].totalVolume;
        totalReps += props.resistanceObjects[i].totalReps;
    }

    return (
        <View style={styles.container}>
            {
                <View style={[styles.containerStats, {backgroundColor: colors.black}]}>
                    <Text style={[styles.title, {color: 'white'}]}>Resistance</Text>
                    <Text style={[styles.text, {color: 'white'}]}>{props.resistanceObjects.length} workouts</Text>
                    <Text style={[styles.text, {color: 'white'}]}>{totalVolume} kgs lifted</Text>
                    <Text style={[styles.text, {color: 'white', paddingBottom: 10,}]}>{totalReps} reps</Text>
                </View>
            }
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
    },

    containerStats: {
        width: '95%',
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
    },

    expandButton: {
        position: 'absolute',
        top: 0,
        right: 10,
    }
})