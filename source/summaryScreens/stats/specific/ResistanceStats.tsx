import React, {useCallback, useState, useEffect, Component} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Alert, FlatList, Pressable, ScrollView, StyleSheet, Switch, Text, View, Dimensions} from 'react-native';

import { colors } from '../../../Colors'
import moment from 'moment'

type ResistanceStatsProps = {
    data:any,
    timeline:string,
    onPress:any,
}

export const ResistanceStats = (props: ResistanceStatsProps) => {

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


        const [remainingHeight, setRemainingHeight] = useState(0);

        useEffect(() => {
            // Get the screen height
            const screenHeight = Dimensions.get('window').height;

            // Calculate the heights of the header and footer
            const headerHeight = 120; // Example: replace with the actual height of your header
            const footerHeight = 50; // Example: replace with the actual height of your footer
            const calendarHeight = 160;

            // Calculate the remaining height
            const calculatedRemainingHeight = screenHeight - headerHeight - footerHeight - calendarHeight;

            // Update the state with the remaining height
            setRemainingHeight(calculatedRemainingHeight);
        }, []);

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {
                    props.timeline == "week" &&
                    <Text style={styles.title}>Cardio Stats for the Week</Text>
                }
                {
                    props.timeline.includes("day") &&
                    <Text style={styles.title}>Cardio Stats for the {props.timeline.split(" ")[1]}{calculateDateEnding(props.timeline.split(" ")[1])}</Text>
                }

                <Pressable style={styles.closeButton} onPress={props.onPress}>
                    <Text style={{color: 'white', fontSize: 16}}>X</Text>    
                </Pressable>
            </View>
            
                    {
                        props.data.map((item:any) => {
                            return ( 
                                <StatsLayout key={item._id} dateCreated={item.dateCreated} exercises={item.exercises} reps={item.reps} weights={item.weights} timeline={props.timeline} id={item._id.toString()}/>
                            )
                            
                            
                        })
                    }
        </View>
    )
}

type StatsLayoutProps = {
    dateCreated:Date,
    exercises:string,
    reps:string,
    weights:string,
    timeline:string,
    id:string,
}

const StatsLayout = (props: StatsLayoutProps) => {
    let dataArray:any = []


    for(let i = 0; i < props.exercises.length; i++)
    {
        let weightAndReps = []
        for(let j = 0; j < JSON.parse(props.weights[i]).length; j++)
        {
            weightAndReps.push(JSON.parse(props.weights[i])[j].value)
            weightAndReps.push(JSON.parse(props.reps[i])[j].value)
        }
        dataArray.push(JSON.parse(props.exercises[i]).value)
        dataArray.push(weightAndReps)
    }


    const calculateDate = (date:Date) => {

        const formattedDate = moment(date).format('D MMM')
        return formattedDate;
    }

    const makeJSONNice = (data:string) => {
        
        let output = '';

        if(typeof(JSON.parse(data)) == typeof("string"))
        {
            output = data.slice(1, -1);
            return (
                <View style={styles.containerData}>
                    <Text style={styles.subTitle}>Exercise</Text>
                    <View style={styles.tinyBorder}></View>
                    <Text style={[styles.text, {textAlign: 'center'}]}>{output}</Text>
                </View>
                
            )
        }
            
        else
        {   
            
            let subcomponentContainer:any = []
            
            for(let i = 0; i < JSON.parse(data).length; i+=2)
            {   
                let subcomponent = []
                let value = JSON.parse(data)[i]

                subcomponent.push(
                    <Text key={generateRandomId()} style={styles.text}>{value} reps</Text>   
                )

                
                value = JSON.parse(data)[i + 1]

                
                subcomponent.push(
                    <Text key={generateRandomId()} style={styles.text}>{value}kg</Text>
                )


                subcomponentContainer.push(
                    <View key={generateRandomId()} style={styles.weightAndReps}>
                        {subcomponent}
                    </View>
                )
                

            }

            let component = [];

            component.push(
                <View key={generateRandomId()} style={styles.containerData}>
                    <Text style={styles.subTitle}>Sets</Text>
                    <View style={styles.tinyBorder}></View>
                    <View key={generateRandomId()}>
                        {subcomponentContainer}
                    </View>
                    
                </View>
                
            )

            return component;
            
        }
        
    }

    const generateRandomId = () => {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    return (

        <View key={generateRandomId()}>
            {
                props.timeline == "week" &&
                <View>
                    <Text style={[styles.subTitle, {textAlign: 'center', fontSize: 18, color:'white' }]}>{calculateDate(props.dateCreated)}</Text>
                    <View style={styles.smallBorder}></View>
                </View>
                
            }
           
            {
                dataArray.map((item:any) => {
                    return (
                        <View key={generateRandomId()}>
                           {makeJSONNice(JSON.stringify(item))}
                        </View>
                        
                    )
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '95%',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: colors.black,
        borderRadius: 5,
        padding: 10,
    },

    row: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    title: {
        fontSize: 25,
        textDecorationLine: 'underline',
        color: 'white',
        marginBottom: 10,
        marginRight: 10,
    },

    subTitle: {
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
        marginBottom: 0,
    },

    text: {
        fontSize: 16,
        color: 'black',
    },

    stats: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    border: {
        width: '98%',
        backgroundColor: 'black',
        height: 2,
        marginBottom: 10,
        marginTop: 5,
    },

    tinyBorder: {
        width: 75,
        backgroundColor: 'white',
        height: 1,
        marginBottom: 10,
        marginTop: 2,
        marginRight: 'auto',
        marginLeft: 'auto',
    },

    smallBorder: {
        width: '80%',
        backgroundColor: 'white',
        height: 1,
        marginBottom: 10,
        marginTop: 5,
        marginRight: 'auto',
        marginLeft: 'auto',
    },

    closeButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 20,
        height: 20,
        backgroundColor: 'black',
    },

    containerCenter: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    flatlist: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
    },

    containerData: {
        backgroundColor: 'lightgray',
        width: '100%',
        borderRadius: 5,
        padding: 10,
        marginRight: 'auto',
        marginLeft: 'auto',
        marginBottom: 10,
    },

    weightAndReps: {
        width: '80%',
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 5,
        justifyContent: 'space-evenly',
        marginRight: 'auto',
        marginLeft: 'auto',
    }
})