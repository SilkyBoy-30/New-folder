import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Pressable, PanResponder, Animated } from "react-native"
import { colors } from "../Colors";
import { useQuery, useRealm, useUser } from "@realm/react";
import { Groups } from "../schemas/GroupsSchema";
import { BSON } from "realm";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import { JoinGroupRequests } from "../schemas/JoinGroupRequestsSchema";


type JoinGroupScreenProps = {
    onPress:any;
}

export const JoinGroupScreen = (props:JoinGroupScreenProps) => {

    const realm = useRealm()
    const user = useUser()

    const [groupName, setGroupName] = useState('');
    const groups = useQuery(Groups).filtered('name CONTAINS[c] $0', groupName);
    const groupsApartOfList = useQuery(Groups).filtered('ANY members == $0', user.id);
    const groupJoinRequests = useQuery(JoinGroupRequests).filtered('userId == $0', user.id.toString())
    const reqeustedGroups = groupJoinRequests.map(item => item.groupName)
    const groupsApartOf = groupsApartOfList.map(item => item.name)

    const [modalGroupInfoVisible, setModalGroupInfoVisible] = useState<boolean>(false)
    const [modalPendingRequestsVisible, setModalPendingRequestsVisible] = useState<boolean>(false)

    const [modalGroupName, setModalGroupName] = useState<string>('')
    const [modalGroupNumMembers, setModalGroupNumMembers] = useState<number>(0)

    const closeModal = () => {
        setModalGroupInfoVisible(false)
    }

    const closePendingRequestsModal = () => {
        setModalPendingRequestsVisible(false)
    }

    const joinGroup = (groupName:string) => {
        requestJoin(groupName)
        closeModal()
    }

    const requestJoin = useCallback(
        (groupName:string) => {
            console.log(groupName)
          // if the realm exists, create an Item
    
          realm.write(() => {
      
            return new JoinGroupRequests(realm, {
              _id: new BSON.ObjectID,
              groupName: groupName,
              userId: user.id.toString()
            });
          });
        },
        [realm, user],
      );


    const navigation = useNavigation();
    useEffect(() => {
    // Define navigation options dynamically when the component mounts
    navigation.setOptions({
        headerLeft: () => (
        <TouchableOpacity onPress={() => props.onPress("join")} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={40}/>
        </TouchableOpacity>
        ),
    });
    }, []);

    useEffect(() => {
        realm.subscriptions.update(mutableSubs => {
            mutableSubs.add(
            realm.objects(Groups)
            )

            mutableSubs.add(
                realm.objects(JoinGroupRequests)
            )
        });
        }, [realm, user]);

   
    
    return (
        <>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <View style={styles.input}>
                    <MaterialCommunityIcons name="search-web" color={'gray'} size={40} />
                    <TextInput
                        value={groupName}
                        onChangeText={text => setGroupName(text)}
                        placeholder="Enter group name"
                    />
                    
                </View>
                <TouchableOpacity onPress={() => setModalPendingRequestsVisible(true)}>
                    <MaterialCommunityIcons name='bell' size={35} />
                </TouchableOpacity>
            </View>
            

            <View>
                {
                    groups.map((group:any, index:any) => {
                        return (
                            <TouchableOpacity key={index} style={styles.group} onPress={() => {setModalGroupName(group.name); setModalGroupNumMembers(group.members.length); setModalGroupInfoVisible(true)}}>
                                <Text style={{fontSize: 20, color: 'white', fontWeight: '800',}}>{group.name}</Text>
                                {
                                    reqeustedGroups.includes(group.name) &&
                                    <MaterialCommunityIcons key={index + 5} name="clock-alert-outline" size={35} style={styles.icon}/>
                                }
                            </TouchableOpacity>
                        )
                    })
                }

            </View>

             
            <Modal
                isVisible={modalGroupInfoVisible}
                swipeDirection={['down']}
                onSwipeComplete={closeModal}
                onBackdropPress={closeModal}
                style={styles.modalView}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.title}>{modalGroupName}</Text>
                    <View style={styles.smallBorder}></View>
                    <Text style={styles.text}>Members: {modalGroupNumMembers}</Text>
                    {
                        reqeustedGroups.includes(modalGroupName) &&
                        <View style={styles.notice}>
                            <Text style={{color: 'white', fontWeight: '800'}}>Join request already sent</Text>
                        </View>
                    }
                    {
                        (!reqeustedGroups.includes(modalGroupName) && !groupsApartOf.includes(modalGroupName)) &&
                        <TouchableOpacity style={styles.button} onPress={() => joinGroup(modalGroupName)}>
                            <Text style={{color: 'white', fontWeight: '800'}}>Request to join group</Text>
                        </TouchableOpacity>
                    }
                    {
                        groupsApartOf.includes(modalGroupName) && 
                        <View style={[styles.notice, {backgroundColor: colors.green}]}>
                            <Text style={{color: 'white', fontWeight: '800'}}>Already part of group</Text>
                        </View>
                    }
                    
                </View>
            </Modal>
            

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
                                <View key={index} style={styles.group}>
                                    <Text style={{fontSize: 20, color: 'white', fontWeight: '800',}}>{group.groupName}</Text>
                                </View>
                            )
                        })
                    }
                </View>
            </Modal>
            
        </>
    )
}

const styles = StyleSheet.create({

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

    input: {
        borderWidth: 2,
        borderColor: 'lightgray',
        borderRadius: 30,
        paddingLeft: 10,
        marginBottom: 10,
        width: 200,
        marginTop: 20,

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },

    group: {
        width: 230,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.purple,
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10,
    },

    icon: {
        color: 'white'
    },

    modalView: {

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

    button: {
        backgroundColor: colors.blue,
        width: 170,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },

    notice: {
        backgroundColor: colors.red,
        width: 170,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    }

})