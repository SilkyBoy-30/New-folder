import { useQuery, useRealm, useUser } from "@realm/react";
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Groups } from "../../schemas/GroupsSchema";
import { useEffect, useState } from "react";
import { UserStatistics } from "../../schemas/UserStatisticsSchema";
import SelectDropdown from "react-native-select-dropdown";
import { colors } from "../../Colors";
import { Users } from "../../schemas/UsersSchema";


type LeaderboardScreenProps = {
    group:string;
}

export const LeaderboardScreen = (props:LeaderboardScreenProps) => {

    const realm = useRealm()
    const user = useUser()

    const group = useQuery(Groups).filtered('name == $0', props.group);
    const stringIds = group[0].members.map(member => member)
    let userStatistics = useQuery(UserStatistics).filtered("userId IN $0", stringIds).sorted("numWorkouts", true)
    const userData = useQuery(Users).filtered("userId IN $0", stringIds)

    const [userStats, setUserStats] = useState<Realm.Results<UserStatistics>>(userStatistics)

    useEffect(() => {
        realm.subscriptions.update(mutableSubs => {
            mutableSubs.add(
            realm.objects(Groups)
            )
        });
    }, [realm, user]);

    useEffect(() => {
        console.log(userStats)
    }, [userStats])

    const filters = ["Workouts", "Cardio Workouts", "Resistance Workouts"]
    const [selectedFilter, setSelectedFilter] = useState('Workouts')

    

    const chooseFilter = (filter:string) => {

        setSelectedFilter(filter)

        if(filter == "Workouts")
        {
            userStatistics = userStatistics.sorted('numWorkouts', true)
            setUserStats(userStatistics)
        }
        else if(filter == "Cardio Workouts")
        {
            userStatistics = userStatistics.sorted('numCardioWorkouts', true)
            setUserStats(userStatistics)
        }
        else if(filter == "Resistance Workouts")
        {
            userStatistics = userStatistics.sorted('numResistanceWorkouts', true)
            setUserStats(userStatistics)
        }
    }

    const getProfilePicture = (path:string) => {
        
        if(path.includes('1'))
        {
          return require('./assets/1.png')
        }
        else if(path.includes('2'))
        {
            return require('./assets/2.png')
        }
        else if(path.includes('3'))
        {
            return require('./assets/3.png')
        }
        else if(path.includes('4'))
        {
            return require('./assets/4.png')
        }
      }


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <SelectDropdown
                data={filters}
                onSelect={(selectedItem) => {
                chooseFilter(selectedItem)
                }}
                buttonStyle={styles.dropdownButton}
                buttonTextStyle={styles.buttonText}
                defaultButtonText='Select Filter'
                defaultValue={'Workouts'}
            />
            <View style={styles.containerLeaderBoard}>

            <View style={styles.containerColumn}>
            {userStats.slice(0, 3).map((statistic:any, index:any) => {

                

                const user = userData.find(data => data.userId === statistic.userId);

                const profilePicture: string | undefined = user?.profilePicture;

                let path;
                if(profilePicture)
                {
                    path = getProfilePicture(profilePicture)
                }

                if(user) {
                    return (
                        
                    <View key={index} style={styles.column}>
                        <Text style={[styles.rowText, {fontSize: 30, color: colors.green, fontWeight: '900'}]}>{index + 1}</Text>
                        {
                            profilePicture && 
                            <Image source={path} style={[styles.imageColumn, {height: (190 - (index * 30))}]}/>
                        }
                        <Text style={[styles.rowText, {color: colors.green}]}>{user.username}</Text>
                    </View>
                       
                    )
                }
            })

            }
            </View>
            <View style={{width: '90%', height: 3, backgroundColor: 'lightgray', marginBottom: 20,}}></View>
                
            {userStats.map((statistic, index) => {

                const user = userData.find(data => data.userId === statistic.userId)

                const profilePicture: string | undefined = user?.profilePicture;

                let path;
                if(profilePicture)
                {
                    path = getProfilePicture(profilePicture)
                }


                if(user) {
                    return (
                        <View key={statistic._id.toString()} style={styles.row}>
                            <Text style={[styles.rowText, {marginRight: 10}]}>{index + 1}</Text>
                            <Image source={path} style={styles.image}/>
                            
                            <View style={{width: 170}}>
                                <Text style={styles.rowText}>{user.username}</Text>
                            </View>
                            {
                                selectedFilter == "Workouts" &&
                                <Text style={styles.rowText}>{statistic.numWorkouts}</Text>
                            }
                            {
                                selectedFilter == "Cardio Workouts" &&
                                <Text style={styles.rowText}>{statistic.numCardioWorkouts}</Text>
        
                            }
                            {
                                selectedFilter == "Resistance Workouts" &&
                                <Text style={styles.rowText}>{statistic.numResistanceWorkouts}</Text>
        
                            }
                        </View>
                    )
                }
               
            }
            
            )}
            </View>
            
        </ScrollView>
    )
}

const styles = StyleSheet.create({

    container: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
    },

    dropdownButton: {
        width: 200,
        borderRadius: 5,
        marginBottom: 20,
        marginTop: 10,
        height: 40,
        backgroundColor: colors.blue,
      },

    buttonText: {
        color: 'white',
        fontWeight: '800',
    },

    options: {
        width: '90%',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
    },

    button: {
        width: 150,
        height: 40,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: colors.blue,
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },

    selected: {
        borderWidth: 0,
        backgroundColor: colors.blue,
    },

    containerLeaderBoard: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        marginBottom: 20,
    },

    row: {
        width: '90%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },

    rowText: {
        fontSize: 20,
        fontWeight: '800',
    },

    image: {
        width: 60,
        height: 60,
        borderRadius: 60,
        marginRight: 20,
    },

    containerColumn: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',

        marginBottom: 30,
    },

    column: {
        width: '30%',
        height: 200,

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    imageColumn: {
        width: 100,
        height: 100,
        borderRadius: 100,
    }
})