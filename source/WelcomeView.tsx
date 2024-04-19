import React, {useCallback, useState} from 'react';
import Realm, { BSON } from 'realm';
import {useApp} from '@realm/react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet, Text, View, Alert} from 'react-native';
import {Input, Button} from '@rneui/base';
import {colors} from './Colors';
import {useUser, useRealm, useQuery} from '@realm/react';
import { Users } from './schemas/UsersSchema';

export function WelcomeView(): React.ReactElement {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');


  // state values for toggable visibility of features in the UI
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [isInSignUpMode, setIsInSignUpMode] = useState(true);

  const app = useApp();
  //const user = useUser();

  // signIn() uses the emailPassword authentication provider to log in
  const signIn = useCallback(async () => {
    const creds = Realm.Credentials.emailPassword(email, password);
    await app.logIn(creds)
  }, [app, email, password]);

  // onPressSignIn() uses the emailPassword authentication provider to log in
  const onPressSignIn = useCallback(async () => {
    try {
      await signIn();
    } catch (error: any) {
      Alert.alert(`Failed to sign in: ${error?.message}`);
    }
  }, [signIn]);

  // onPressSignUp() registers the user and then calls signIn to log the user in
  const onPressSignUp = useCallback(async () => {
    try {
      await app.emailPasswordAuth.registerUser({email, password});
      await signIn();
      await updateUserData(app.currentUser);
    } catch (error: any) {
      Alert.alert(`Failed to sign up: ${error?.message}`);
      console.log("Failed to sign up: " + error?.message)
    }
  }, [signIn, app, email, password]);


  const updateUserData = async (user:any) => {
    try {
      const result = await user.functions.updateUserInformation(firstName, surname, username)
      const userStatisticsResult = await user.functions.addUserStatistics(new BSON.ObjectID(), user.id)
      //console.log("Result", result)
      //console.log("User Stats", userStatisticsResult)
    }

    catch (e) {
      console.log(e)
    }
  } 

  return (
    <SafeAreaProvider>
      <View style={styles.viewWrapper}>
        <Text style={styles.title}>Ulti Tracker</Text>
        <Input
          placeholder="email"
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        { isInSignUpMode &&
        <>
          <Input
            placeholder="first name"
            onChangeText={setFirstName}
            autoCapitalize="none"
          />
          <Input
            placeholder="surname"
            onChangeText={setSurname}
            autoCapitalize="none"
          />
          <Input
            placeholder="username"
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </>
        }
        
        
        <Input
          placeholder="password"
          onChangeText={setPassword}
          secureTextEntry={passwordHidden}
          rightIcon={
            <Button
              title={passwordHidden ? 'Show' : 'Hide'}
              onPress={() => {
                setPasswordHidden(!passwordHidden);
              }}
            />
          }
        />
        {isInSignUpMode ? (
          <>
            <Button
              title="Create Account"
              buttonStyle={styles.mainButton}
              onPress={onPressSignUp}
            />
            <Button
              title="Already have an account? Log In"
              type="clear"
              titleStyle={styles.secondaryButton}
              onPress={() => setIsInSignUpMode(!isInSignUpMode)}
            />
          </>
        ) : (
          <>
            <Button
              title="Log In"
              buttonStyle={styles.mainButton}
              onPress={onPressSignIn}
            />
            <Button
              title="Don't have an account? Create Account"
              type="clear"
              titleStyle={styles.secondaryButton}
              onPress={() => setIsInSignUpMode(!isInSignUpMode)}
            />
          </>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 14,
    padding: 10,
    color: 'gray',
    textAlign: 'center',
  },
  mainButton: {
    width: 350,
    backgroundColor: colors.blue,
  },
  secondaryButton: {
    color: colors.blue,
  },
});
