import React, {useCallback, useState, useEffect} from 'react';
import {Alert, FlatList, Pressable, SafeAreaView, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import {colors} from './Colors';
import { TabView, SceneMap } from 'react-native-tab-view';
import { useWindowDimensions } from 'react-native';
import { WeekSummary } from './summaryScreens/stats/weekly/WeekSummary'
import { MonthSummary } from './summaryScreens/stats/monthly/MonthSummary';
import { useRealm, useQuery, useUser } from '@realm/react';
import { App } from 'realm';
import { Users } from './schemas/UsersSchema';
import { YearSummary } from './summaryScreens/stats/yearly/YearSummary';
import PagerView from 'react-native-pager-view';

export function HomeScreen() {

  const realm = useRealm()

  const Week = () => (
    <SafeAreaView>
      <WeekSummary />
    </SafeAreaView>
    
  )

  const Month = () => (
    <SafeAreaView>
      <MonthSummary selectedMonth={-1}/>
    </SafeAreaView>
  )

  const Year = () => (
  <SafeAreaView>
    <YearSummary/>
  </SafeAreaView>
  )

  const [subscriptions, setSubcriptions] = useState<App.Sync.SubscriptionSet | undefined>();

  const users = useQuery(Users);

  useEffect(() => {
    const createSubscription = async () => {
      // Create subscription for filtered results.
      await realm.subscriptions.update(mutableSubs => {
        mutableSubs.add(users, {name: 'users data'});
      });
    };
    createSubscription().catch(console.error);
    // Set to state variable.
    setSubcriptions(realm.subscriptions);
  }, []);

  const [selectedPage, setSelectedPage] = useState(0)
  
    return (
      <View style={styles.container}>
        <View style={styles.pageVisualiser}>
          <View style={[styles.bar, selectedPage == 0 && {backgroundColor: colors.blue}]}><Text style={selectedPage == 0 && {color: 'white'}}>Week</Text></View>
          <View style={[styles.bar, selectedPage == 1 && {backgroundColor: colors.blue}]}><Text style={selectedPage == 1 && {color: 'white'}}>Month</Text></View>
          <View style={[styles.bar, selectedPage == 2 && {backgroundColor: colors.blue}]}><Text style={selectedPage == 2 && {color: 'white'}}>Year</Text></View>
        </View>
        <PagerView style={styles.pagerView} initialPage={0} onPageSelected={(event) => setSelectedPage(event.nativeEvent.position)}>
          <Week key="1"/>
          <Month key="2"/>
          <Year key="3"/>
        </PagerView>
      </View>
      
        
      );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: '33.33%',
    backgroundColor: 'white',
    height: 40,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

  },

    viewWrapper: {
      flex: 1,
    },

    button: {
        width: '97.5%',
        height: 50,
        backgroundColor: colors.blue,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 5,
    
        display: 'flex',
        justifyContent: 'center',
      },
    
    buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    },

   

    text: {
      fontSize: 20,
      textAlign: 'center',
    },

   
    
  });