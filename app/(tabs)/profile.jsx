import { ScrollView, View, Text, Button, Alert, StyleSheet, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard  } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from '../../constants/themes'
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'


export default function profile() {

  const router = useRouter();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState(''); 
    const [error, setError] = React.useState('');

  const authSignIn = () => {
    setError('');
    if (!email || !password){
      setError('please enter username and password');
      return;
    }

    if (email != '123' || password != '123'){
      setError('wrong email or password')
      return;
    } else {
      router.replace('../(tabs)/homePage')
    }

  }

  const [showEventForm, changeShowContent] = useState(false);
  const btnShowEventForm = () => {
    changeShowContent(!showEventForm);
  };

  const btnHideEventForm = () => {
    changeShowContent(!showEventForm);
  };

  const btnLogout = () => {
    
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'   
      }}>
      {!showEventForm && (
        <View>
          <Text style={styles.container}>Your profile will appear here! 🎉</Text>
          <Button
            title="Create event"
            onPress={btnShowEventForm}
            accessibilityLabel="Create event"
          />
          <Button
            title="Logout"
            onPress={btnLogout}
            accessibilityLabel="Logout"
          />
         </View>
      )}
      {showEventForm && (
        <ScrollView style={styles.content}>
          <Text style={styles.container}>Event Form</Text>
          <SafeAreaProvider>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <SafeAreaView style={styles.container}>
                
                  
                  <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                  <View style={styles.headerContainer}>
                    <Text style={styles.title}>Create an Event!</Text>
                    <Text style={styles.subTitle}>Enter event information</Text>
                  </View>
          
                    
          
                  <View style={styles.formContainer}>
                    <Text style={styles.subTitle}>Event Name</Text>
                    <View style={styles.inputContainer}> 
                         
                      <TextInput
                        style={styles.textInput} 
                        placeholder='Event Name'
                        placeholderTextColor={'#666'}
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={email}
                        onChangeText={(text) => {
                          setEmail(text);
                          setError('');
          
                        }}
                      ></TextInput>
                    </View>
                    
                    <Text style={styles.subTitle}>Location</Text>
                    <View style={styles.inputContainer}>  
                       
                      <TextInput 
                        style={styles.textInput} 
                        placeholder='Location'
                        placeholderTextColor={'#666'}
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={password}
                        onChangeText={(text) => {
                          setPassword(text);
                          setError(''); 
                        }}
                      ></TextInput>
                    </View>
                    
                    <Text style={styles.subTitle}>Date</Text>
                    <View style={styles.inputContainer}>  
                       
                      <TextInput 
                        style={styles.textInput} 
                        placeholder='Date'
                        placeholderTextColor={'#666'}
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={password}
                        onChangeText={(text) => {
                          setPassword(text);
                          setError(''); 
                        }}
                      ></TextInput>
                    </View>
                    
                    <Text style={styles.subTitle}>Time</Text>
                    <View style={styles.inputContainer}>  
                       
                      <TextInput 
                        style={styles.textInput} 
                        placeholder='Time'
                        placeholderTextColor={'#666'}
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={password}
                        onChangeText={(text) => {
                          setPassword(text);
                          setError(''); 
                        }}
                      ></TextInput>
                    </View>
          
                  </View>
          
                        
          
                  {error && <Text style={styles.errorText}>{error}</Text>}
          
                 
                  <Button style={styles.button}
                    title="Cancel"
                    onPress={btnHideEventForm}
                    accessibilityLabel="Cancel"
                  />
                  </ScrollView>
          
                </SafeAreaView>
                </TouchableWithoutFeedback>
              </SafeAreaProvider>
          
        </ScrollView>
      )}
    </View>
    
  )
}

const styles = StyleSheet.create({
  container: {
    
    padding: 10,
    margin: 10
  },
  card: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 10,
    width: 150, 
    height: 150,
  },
  button: {
    backgroundColor: COLORS.secondary,
    padding: 10,
    margin: 10,
  }
})