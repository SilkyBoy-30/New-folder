import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View, TouchableOpacity, ScrollView, Image} from 'react-native';
import {colors} from './Colors';
import { LogWorkoutCardio } from './components/LogWorkoutCardio'; 
import { LogWorkoutResistance } from './components/LogWorkoutResistance';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useQuery, useRealm, useUser } from '@realm/react';
import { UserStatistics } from './schemas/UserStatisticsSchema';


type SubmitCompletionProps = {
    onPress:any,
    levelUp:boolean,
    gainedXp:number,
}



export const SubmitCompletion = (props:SubmitCompletionProps) => {

    const realm = useRealm();
    const user = useUser();
  
    const userStats = useQuery(UserStatistics).filtered("userId == $0", user.id);

    const [unleveled, setUnleveled] = useState<number>(200);
    const [leveled, setLeveled] = useState<number>(0);
    
    useEffect(() => {
        let xp = userStats[0].xp;

        setLeveled(Number(((xp/userStats[0].xpTarget) * 200).toFixed(0)));
        setUnleveled(200 - leveled);

    }, [userStats])

    useEffect(() => {
      realm.subscriptions.update(mutableSubs => {
          mutableSubs.add(
          realm.objects(UserStatistics)
          )
      });
      }, [realm, user]);

    return (
        <View style={styles.container}>
            <View style={styles.bigCircle}>
                <Text style={styles.bigCircleText}>{userStats[0].lvl}</Text>
            </View>
            {   props.levelUp &&
                <Text style={styles.congratsText}>LEVEL UP</Text>
            }
            {
                !props.levelUp &&
                <Text style={styles.congratsText}>WELL DONE</Text>
            }
            <View style={styles.progressBarContainer}>
                <View style={styles.smallCircle}>
                    <Text style={styles.smallCircleText}>XP</Text>
                </View>
                <View style={{display: 'flex', flexDirection: 'column'}}>
                    <View style={styles.progressBar}>
                        <View style={[styles.bar, {width: leveled, backgroundColor: colors.blue}]}></View>
                        <View style={[styles.bar, {width: unleveled, backgroundColor: 'lightgray'}]}></View>
                    </View>
                    <View style={{display: 'flex', flexDirection: 'row', justifyContent:'space-between'}}>
                        {
                            props.gainedXp >= 0 &&
                            <Text>+{props.gainedXp}</Text>
                        }
                        {
                            props.gainedXp < 0 &&
                            <Text>+0</Text>
                        }
                        
                        <Text>{userStats[0].xp} / {userStats[0].xpTarget}</Text>
                    </View>
                    
                </View>
                
                <View style={styles.smallCircle}>
                    <Text style={styles.smallCircleText}>{userStats[0].lvl + 1}</Text>
                </View>
            </View>
            <TouchableOpacity onPress={props.onPress} style={styles.continueButton}>
                <Text style={styles.text}>Continue</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    bigCircle: {
        width: 100,
        aspectRatio: 1/1,
        backgroundColor: colors.blue,
        borderRadius: 100,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        marginBottom: 20,
    },

    bigCircleText: {
        fontSize: 40,
        fontWeight: '800',
        color: 'white',
    },

    congratsText: {
        fontSize: 36,
        fontWeight: '900',
        marginBottom: 20,
    },

    smallCircle: {
        width: 40,
        aspectRatio: 1/1,
        backgroundColor: colors.blue,
        borderRadius: 30,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginLeft: 10,
    },

    smallCircleText: {
        fontSize: 18,
        fontWeight: '800',
        color: 'white',
    },

    progressBarContainer: {
        width: '80%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

        marginBottom: 50,
    },

    progressBar: {
        width: 200,
        height: 6,
        display: 'flex',
        flexDirection: 'row',
    },

    bar: {
        height: 6,
    },

    continueButton: {
        width: 200,
        height: 50,
        backgroundColor: colors.blue,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },

    text: {
        fontSize: 20,
        color: 'white',
        fontWeight: '600',
    },
})