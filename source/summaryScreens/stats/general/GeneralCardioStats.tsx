import {StyleSheet, Text, View} from 'react-native';


import { colors } from '../../../Colors'

type GeneralCardioStatsProps = {
    cardioObjects:any,
}

export const GeneralCardioStats = (props: GeneralCardioStatsProps) => {

    let totalTime = 0;
    let totalDistance = 0;
    for(let i = 0; i < props.cardioObjects.length; i++)
    {
        totalTime += props.cardioObjects[i].totalTime;
        totalDistance += props.cardioObjects[i].totalDistance;
    }

    return (
        <View style={styles.container}>
            {
                <View style={[styles.containerStats, {backgroundColor: colors.red}]}>
                    <Text style={[styles.title, {color: 'white'}]}>Cardio</Text>
                    <Text style={[styles.text, {color: 'white'}]}>{props.cardioObjects.length} workouts</Text>
                    <Text style={[styles.text, {color: 'white'}]}>{totalTime} min spent</Text>
                    <Text style={[styles.text, {color: 'white', paddingBottom: 10,}]}>{totalDistance} KM travelled</Text>

                    
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