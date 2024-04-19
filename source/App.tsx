import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet, Linking, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

import {dataExplorerLink} from '../atlasConfig.json';
import {LogoutButton} from './LogoutButton';
import {LogWorkoutScreen} from './LogWorkoutScreen';
import {HomeScreen} from './HomeScreen';
import {OfflineModeButton} from './OfflineModeButton';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ProfileScreen } from './profile/ProfileScreen';
import { Header } from './components/Header';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SocialScreen } from './social/SocialScreen';

// If you're getting this app code by cloning the repository at
// https://github.com/mongodb/ template-app-react-native-todo,
// it does not contain the data explorer link. Download the
// app template from the Atlas UI to view a link to your data
const dataExplorerMessage = `View your data in MongoDB Atlas: ${dataExplorerLink}.`;

console.log(dataExplorerMessage);

const headerRight = () => {
  return <OfflineModeButton />;
};

const headerLeft = () => {
  return <LogoutButton />;
};

const Tab = createBottomTabNavigator();

export const App = () => {

  return (
    <>
      {/* All screens nested in RealmProvider have access
            to the configured realm's hooks. */}
      <SafeAreaProvider>
        <NavigationContainer>
          <Tab.Navigator
            >
            <Tab.Screen 
              name='Statistics' 
              component={HomeScreen}
              options={{
                headerTitle: () => <Header title="Statistics"/>,
                headerStyle: {
                  backgroundColor: '#E3E3E2',
                },
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="chart-box" color={color} size={40} />
                ),
              }} 
              />
            <Tab.Screen 
              name="Log Workout" 
              component={LogWorkoutScreen} 
              options={{
                headerTitle: () => <Header title="Log Workout"/>,
                headerStyle: {
                  backgroundColor: '#E3E3E2',
                },
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="dumbbell" color={color} size={40} />
                ),
              }} 
              />

              <Tab.Screen 
              name='Social' 
              component={SocialScreen}
              options={{
                headerTitle: () => <Header title="Social"/>,
                headerStyle: {
                  backgroundColor: '#E3E3E2',
                },
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="account-group" color={color} size={40} />
                ),
              }} 
              />
              
            <Tab.Screen 
              name="Profile"
              component={ProfileScreen}
              options={{
                headerStyle: {
                  height: 0,
                  backgroundColor: '#E3E3E2',
                },
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="account" color={color} size={40} />
                ),
              }} 
              
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </>
  );
};

const styles = StyleSheet.create({
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 4,
  },
  hyperlink: {
    color: 'blue',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },

  header: {

  }
});
