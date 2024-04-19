import React, { useEffect, useState } from 'react';
import {Alert, FlatList, ScrollView, Pressable, StyleSheet, Button, Switch, Text, View, TouchableOpacity, TextInput, Dimensions} from 'react-native';
import { useQuery, useRealm, useUser } from '@realm/react';
import { UserStatistics } from '../schemas/UserStatisticsSchema';
import { WaitForSync } from 'realm';
import { Users } from '../schemas/UsersSchema';
import { Image } from '@rneui/base';
import { colors } from '../Colors';

type HeaderProps = {
    title:string;
}
export function Header(props: HeaderProps) {

    const realm = useRealm();
    const user = useUser();
  
    const userStats = useQuery(UserStatistics).filtered("userId == $0", user.id);
    userStats.subscribe()

    const userData = useQuery(Users).filtered("userId == $0", user.id);
    userData.subscribe()

    const [imageSource, setImageSource] = useState(require('../profile/assets/1.png'))

    useEffect(() => {
        if(userData[0].profilePicture?.includes('1'))
        {
          setImageSource(require('../profile/assets/1.png'))
        }
        else if(userData[0].profilePicture?.includes('2'))
        {
          setImageSource(require('../profile/assets/2.png'))
        }
        else if(userData[0].profilePicture?.includes('3'))
        {
          setImageSource(require('../profile/assets/3.png'))
        }
        else if(userData[0].profilePicture?.includes('4'))
        {
          setImageSource(require('../profile/assets/4.png'))
        }
      }, [userData])

    useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
        mutableSubs.add(
        realm.objects(Users),
        );

        mutableSubs.add(
        realm.objects(UserStatistics)
        )
    });
    }, [realm, user]);
    
    const [unleveled, setUnleveled] = useState<number>(100);
    const [leveled, setLeveled] = useState<number>(0);
    
    
    useEffect(() => {
        let xp = userStats[0].xp;

        //console.log(userStats[0])

        setLeveled(Number(((xp/userStats[0].xpTarget) * 100).toFixed(0)));
        setUnleveled(100 - leveled);

    }, [userStats])

    return (
        /*
        <View style={styles.container}>
            <View style={styles.profileInfo}>
                <View style={styles.progressContainer}>
                    <Text style={{textAlign: 'center', color: colors.blue}}>LVL {userStats[0].lvl}</Text>
                    <View style={styles.levelProgressContainer}>
                        <View style={[styles.bar, {width: leveled, backgroundColor: colors.blue}]}></View>
                        <View style={[styles.bar, {width: unleveled, backgroundColor: '#c0bfbf'}]}></View>
                    </View>
                    <Text style={{textAlign: 'center', color: colors.blue}}>{userStats[0].xp}xp / {userStats[0].xpTarget}xp</Text>
                </View>
                
                <Image style={styles.image} source={imageSource} />
                
            </View>
        </View>
        */
       <></>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
       
    },

    text: {
        fontWeight: '800',
        fontSize: 25,
    },

    profileInfo: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
    },

    image: {
        height: 50,
        width: 50,
        marginLeft: 10,
        borderRadius: 100,
    },

    progressContainer: {
        display: 'flex',
        flexDirection: 'column',

    },

    levelProgressContainer: {
        height: 2,
        width: 100,
        display: 'flex',
        flexDirection: 'row',
    },

    bar: {
        height: 2,
        
    },
});