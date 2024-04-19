import { useCallback, useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { colors } from "../Colors";
import { useQuery, useRealm, useUser } from "@realm/react";
import { Groups } from "../schemas/GroupsSchema";
import { BSON } from "realm";
import PagerView from "react-native-pager-view";
import { HistoryScreen } from "./Group/HistoryScreen";
import { MilestonesScreen } from "./Group/MilestonesScreen";
import { LeaderboardScreen } from "./Group/LeaderboardScreen";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Modal from 'react-native-modal';
import { JoinGroupRequests } from "../schemas/JoinGroupRequestsSchema";
import { Users } from "../schemas/UsersSchema";

type GroupScreenProps = {
    onPress:any;
    group:string;
}

export const GroupScreen = (props:GroupScreenProps) => {

    const realm = useRealm()
    const user = useUser()

    const selectedGroup = useQuery(Groups).filtered("name == $0", props.group)
    const groupJoinRequests = useQuery(JoinGroupRequests).filtered('groupName == $0', props.group)

    console.log(groupJoinRequests)

    const navigation = useNavigation();
    useEffect(() => {
    // Define navigation options dynamically when the component mounts
    navigation.setOptions({
        headerLeft: () => (
        <TouchableOpacity onPress={() => props.onPress("view")} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={40}/>
        </TouchableOpacity>
        ),
        headerRight: () => (
            <View>
                {
                    user.id == selectedGroup[0].owner &&
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                        <TouchableOpacity style={{marginRight: 10,}} onPress={() => setModalPendingRequestsVisible(true)}>
                            <MaterialCommunityIcons name="bell" size={40} style={[groupJoinRequests.length > 0 && {color: colors.orange}, groupJoinRequests.length == 0 && {color: 'lightgray'}]}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={{marginRight: 10,}}>
                            <MaterialCommunityIcons name="cog" size={40}/>
                        </TouchableOpacity>
                    </View>
                    
                }
            </View>
        ),
    });
    }, []);

    const History = () => (
        <HistoryScreen group={props.group}/>
    )

    const Leaderboard = () => (
        <LeaderboardScreen group={props.group}/>
    )

    const [modalPendingRequestsVisible, setModalPendingRequestsVisible] = useState<boolean>(false)

    const closePendingRequestsModal = () => {
        setModalPendingRequestsVisible(false)
    }

    const getUserName = (userId:string) => {
        const user = realm.objects<Users>(Users).filtered('userId == $0', userId)[0]

        return user.username;
    }

    const acceptUser = (userId:string) => {
        if(selectedGroup != null)
        {
            realm.write(() => {
                selectedGroup[0].members.push(userId),
                selectedGroup[0].memberRoles.push("player")
            })
        }

        const groupJoinRequest = realm.objects<JoinGroupRequests>(JoinGroupRequests).filtered('userId == $0', userId)

        if(groupJoinRequest != null)
        {
            realm.write(() => {
                realm.delete(groupJoinRequest);
            });
        }
    }

    const rejectUser = (userId:string) => {
        const groupJoinRequest = realm.objects<JoinGroupRequests>(JoinGroupRequests).filtered('userId == $0', userId)

        if(groupJoinRequest != null)
        {
            realm.write(() => {
                realm.delete(groupJoinRequest);
            });
        }
    }
      

    const [selectedPage, setSelectedPage] = useState(0)

    useEffect(() => {
        realm.subscriptions.update(mutableSubs => {
            mutableSubs.add(
                realm.objects(Groups)
            )
            mutableSubs.add(
                realm.objects(JoinGroupRequests)
            )
            mutableSubs.add(
                realm.objects(Users)
            )
        });
        }, [realm, user]);
    
    return (
        <View style={styles.container}>
        <View style={styles.pageVisualiser}>
          <View style={[styles.bar, selectedPage == 0 && {backgroundColor: colors.blue}]}><Text style={selectedPage == 0 && {color: 'white'}}>History</Text></View>
          <View style={[styles.bar, selectedPage == 1 && {backgroundColor: colors.blue}]}><Text style={selectedPage == 1 && {color: 'white'}}>Leaderboard</Text></View>
        </View>
        <PagerView style={styles.pagerView} initialPage={0} onPageSelected={(event) => setSelectedPage(event.nativeEvent.position)}>
          <History key="1"/>
          <Leaderboard key="2"/>
        </PagerView>


        <Modal
                isVisible={modalPendingRequestsVisible}
                swipeDirection={['down']}
                onSwipeComplete={closePendingRequestsModal}
                onBackdropPress={closePendingRequestsModal}
                style={styles.modalView}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.title}>{groupJoinRequests.length} pending request(s)</Text>
                    <View style={[styles.smallBorder, {width: 250, marginBottom: 20}]}></View>
                    {
                        groupJoinRequests.map((group:any, index:any) => {
                            return (
                                <View key={(new BSON.ObjectID()).toString()} style={{display: 'flex', flexDirection: 'row'}}>
                                    <View key={index} style={styles.group}>
                                    <Text style={{fontSize: 20, color: 'white', fontWeight: '800',}}>{getUserName(group.userId)}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => acceptUser(group.userId)}>
                                        <MaterialCommunityIcons key={(new BSON.ObjectID()).toString()} name="check" size={40} style={{color: colors.green, marginLeft: 10, marginRight: 10}}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => rejectUser(group.userId)}>
                                        <MaterialCommunityIcons key={(new BSON.ObjectID()).toString()} name="close" size={40} style={{color: colors.red, marginLeft: 10, marginRight: 10}}/>
                                    </TouchableOpacity>
                                    
                                </View>
                                
                            )
                        })
                    }
                </View>
            </Modal>
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

    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 40,
        marginLeft: 10,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },


    closeButtonText: {
        fontSize: 25,
        fontWeight: '800',
        color: 'white',
    },

    pagerView: {
        flex: 1,
        width: '100%', // Adjust width as needed
      },
    
    pageVisualiser: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    },

    bar: {
    width: '50%',
    backgroundColor: 'white',
    height: 40,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    },

    modalView: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        margin: 0,
    },

    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },

    title: {
        fontSize: 25,
        fontWeight: '800',
    },

    text: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 30,
    },

    smallBorder: {
        width: 100,
        height: 2,
        backgroundColor: 'lightgray',
        marginBottom: 10,
    },

    group: {
        width: 170,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.purple,
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10,
    },

})