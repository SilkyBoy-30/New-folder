import React, {useCallback, useState, useEffect} from 'react';
import {Alert, Button, FlatList, Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { useWindowDimensions } from 'react-native';
import { useRealm, useQuery, useUser } from '@realm/react';
import { App } from 'realm';
import PagerView from 'react-native-pager-view';
import { colors } from '../Colors';
import { createStackNavigator } from '@react-navigation/stack';
import { CreateGroupScreen } from './CreateGroupScreen';
import { Groups } from '../schemas/GroupsSchema';
import { JoinGroupScreen } from './JoinGroupScreen';
import { GroupScreen } from './GroupScreen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { shadow } from '../Shadow';


export function SocialScreen() {

  const realm = useRealm()
  const user = useUser()

  const groups = useQuery(Groups).filtered('ANY members == $0', user.id);
  //console.log(groups)

  const createGroup = () => {
    setCreatingGroup(true)
  }

  const joinGroup = () => {
    setJoiningGroup(true)
  }

  const navigation = useNavigation();
  const closeScreen = (name:string) => {
    if(name == "join")
    {
      setJoiningGroup(false)
    }
    else if(name == "create")
    {
      setCreatingGroup(false)
    }
    else if(name == "view")
    {
      setViewingGroup(false)
    }

    navigation.setOptions({
      headerLeft: () => (<View style={{width: 30, marginLeft: 20}}></View>),
      headerRight: () => (<View style={{width: 30, marginRight: 20}}></View>)
    });
  }

  const [creatingGroup, setCreatingGroup] = useState<boolean>(false)
  const [joiningGroup, setJoiningGroup] = useState<boolean>(false)
  const [viewingGroup, setViewingGroup] = useState<boolean>(false)

  const [group, setGroup] = useState<string>('')
  

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
        mutableSubs.add(
        realm.objects(Groups)
        )
    });
    }, [realm, user]);
  
  return (
    <View style={styles.container}> 
    {
      (!creatingGroup && !joiningGroup && !viewingGroup) && 
      <View style={styles.container}>
            <FlatList
            data={groups}
            renderItem={({ item }) => (
              <TouchableOpacity style={[styles.groupButton, shadow.shadow, {marginTop: 20}]} onPress={() => {setGroup(item.name); setViewingGroup(true)}}>
                <Text style={styles.buttonText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

        <View>
          <TouchableOpacity onPress={createGroup} style={[styles.button, shadow.shadow]}>
            <Text style={{color: 'white', fontWeight: '800'}}>Create a Group</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={joinGroup} style={[styles.button, shadow.shadow]}>
            <Text style={{color: 'white', fontWeight: '800'}}>Join a Group</Text>
          </TouchableOpacity>
        </View>
      </View>

      
    }

    {
      creatingGroup &&
      
        <CreateGroupScreen onPress={closeScreen}/>
    }

    {
      joiningGroup &&
      <ScrollView>
        <JoinGroupScreen onPress={closeScreen}/>
      </ScrollView>
    }

    {
      viewingGroup &&
      <GroupScreen onPress={closeScreen} group={group} />
    }
    
    </View>
    );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  button: {
    width: 150,
    height: 40,
    backgroundColor: colors.blue,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 10,
    borderRadius: 10,
  },

  groupButton: {
    width: 200,
    height: 50,
    backgroundColor: colors.purple,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 20,
    borderRadius: 10,
  },

  buttonText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 25,
  }
   
    
  });