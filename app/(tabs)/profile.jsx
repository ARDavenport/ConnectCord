import { ScrollView, View, Text, Button, Alert, StyleSheet, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard  } from 'react-native'
import React, { useState } from 'react'
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

export default function profile() {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState(''); 
  const [error, setError] = React.useState('');

  const [showEventForm, changeShowEventForm] = useState(false);
  const [showSettings, changeShowSettings] = useState(false);
  const [showLogout, changeShowLogout] = useState(false);



  const btnEventForm = () => {
    changeShowEventForm(!showEventForm);
  };

  const btnSettings = () => {
    changeShowSettings(!showSettings);
  };

  const btnLogout = () => {
    changeShowLogout(!showLogout);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'   
      }}>
      {!showEventForm && !showSettings && !showLogout && (
        <View>
          <Text style={styles.container}>Your profile will appear here! 🎉</Text>
         
          <TouchableOpacity style={styles.button} onPress={btnEventForm}>
            <Text style={styles.buttonText}>Create Event</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={btnSettings}>
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={btnLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
          
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
          
                    
          
                  <View style={styles.container}>
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
          
                 
                  <TouchableOpacity style={styles.cancelButton} onPress={btnEventForm}>
                   <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>

                  </ScrollView>
          
                </SafeAreaView>
                </TouchableWithoutFeedback>
              </SafeAreaProvider>
          
        </ScrollView>
      )}
      {showSettings && (
        <ScrollView style={styles.content}>
          <Text style={styles.container}>Settings</Text>
          <SafeAreaProvider>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <SafeAreaView style={styles.container}>
                
                  
                    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                    <View style={styles.headerContainer}>
                      <Text style={styles.title}>Change your settings!</Text>
                      
                    </View>
            

                    <View>
                      <Text style={styles.subTitle}>Change username</Text>
                      <Text style={styles.subTitle}>Change profile picture</Text>
                      <Text style={styles.subTitle}>Change email</Text>
                      <Text style={styles.subTitle}>Change password</Text>
                    </View>
               
          
                  {error && <Text style={styles.errorText}>{error}</Text>}
          
                 
                  <TouchableOpacity style={styles.cancelButton} onPress={btnSettings}>
                   <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  </ScrollView>
          
                </SafeAreaView>
                </TouchableWithoutFeedback>
              </SafeAreaProvider>
          
        </ScrollView>
      )}

      {showLogout && (
        <ScrollView style={styles.content}>
          <Text style={styles.container}>Logout</Text>
          <SafeAreaProvider>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <SafeAreaView style={styles.container}>
                
                  
                  <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                  <View style={styles.headerContainer}>
                    <Text style={styles.title}>Are you sure you want to log out?</Text>
                    
                  </View>
                        
          
                  {error && <Text style={styles.errorText}>{error}</Text>}
          
                 
                  <TouchableOpacity style={styles.cancelButton} onPress={btnLogout}>
                   <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
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
    backgroundColor: '#80ac92',
    outlineColor: '#657e6f',
    borderRadius: 10,
    margin: 5,
    padding: 10,
    borderWidth: 2,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: 'maroon',
    color: 'white',
    borderRadius: 10,
    margin: 5,
    padding: 10,
    alignItems: 'center'
  },
  title: {
    //fontSize: 100
  },
  subTitle: {
    
  },
})