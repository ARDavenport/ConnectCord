import { StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, ScrollView } from 'react-native'
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { COLORS } from '../../constants/themes'
import { useRouter } from 'expo-router'
import { Dropdown } from 'react-native-element-dropdown'
import React, { useState, useEffect } from 'react'


const BASE_URL = "http://192.168.1.241:8000/api/location"; 

const createProfile = () => {  

  const router = useRouter();
  
  const[firstName, setFirstName] = React.useState('');
  const[middleName, setMiddleName] = React.useState('');
  const[lastName, setLastName] = React.useState('');
  const[phoneNum, setPhoneNum] = React.useState('');


  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [stateValue, setStateValue] = useState(null);
  const [city, setCity] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const fetchStates = async () => {
      setLoadingStates(true);
      setError(null);
      try {
        const response = await fetch(`${BASE_URL}/states`);
        const data = await response.json();
        const formattedStates = data.map((state) => ({
          label: state.name,
          value: state.iso2,
        }));
        setStatesList(formattedStates);
      } catch (err) {
        console.error("Error fetching states:", err);
        setError("Failed to load states");
      } finally {
        setLoadingStates(false);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    if (!stateValue) return;
    setLoadingCities(true);
    const fetchCities = async () => {
      try {
        const response = await fetch(`${BASE_URL}/states/${stateValue}/cities`);
        const data = await response.json();
        const formattedCities = data.map((city) => ({
          label: city.name,
          value: city.name,
        }));
        setCitiesList(formattedCities);
      } catch (err) {
        console.error("Error fetching cities:", err);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, [stateValue]);


    

  const handleCreateProfile = () => {
    router.replace('../(tabs)/homePage')
  }





  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>  
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1, alignItems: 'center', width: '100%' }}>
              
                <Text style={styles.title}>Lets Create Your Profile!</Text>

                <View style={styles.formContainer}>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.textInput}
                      placeholder='First Name'
                      placeholderTextColor={'#666'}
                      autoCapitalize='none'
                      autoCorrect={false}
                      value={firstName}
                      onChangeText={(text) =>
                        setFirstName(text)
                      }
                    
                    ></TextInput>
                  </View>
                </View>

                <View style={styles.formContainer}>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.textInput}
                      placeholder='Middle Name (Optional)'
                      placeholderTextColor={'#666'}
                      autoCapitalize='none'
                      autoCorrect={false}
                      value={middleName}
                      onChangeText={(text) =>
                        setMiddleName(text)
                      }
                    
                    ></TextInput>
                  </View>
                </View>

                <View style={styles.formContainer}>
                  <View style={styles.inputContainer}>                    
                    <TextInput
                      style={styles.textInput}
                      placeholder='Last Name'
                      placeholderTextColor={'#666'}
                      autoCapitalize='none'
                      autoCorrect={false}
                      value={lastName}
                      onChangeText={(text) =>
                        setLastName(text)
                      }
                    ></TextInput>
                  </View>
                </View>

                <View style={styles.formContainer}>
                  <View style={styles.inputContainer}>                    
                    <TextInput
                      style={styles.textInput}
                      placeholder='Phone Number'
                      placeholderTextColor={'#666'}
                      autoCapitalize='none'
                      autoCorrect={false}
                      value={phoneNum}
                      onChangeText={(text) =>
                        setPhoneNum(text)
                      }
                    ></TextInput>
                  </View>
                </View>

                <Dropdown
                  style={styles.dropdown}
                  data={statesList}
                  search
                  labelField="label"
                  valueField="value"
                  placeholder="Select State"
                  value={stateValue}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={item => {
                    setStateValue(item.value);
                    setCity(null);
                    setIsFocus(false);
                  }}
                />

                
                <Dropdown
                  style={styles.dropdown}
                  data={citiesList}
                  search
                  labelField="label"
                  valueField="value"
                  placeholder="Select City"
                  value={city}
                  disabled={!stateValue}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={item => {
                    setCity(item.value);
                    setIsFocus(false);
                  }}
                />

                <TouchableOpacity style={styles.button} onPress={(handleCreateProfile)}>
                    <Text style={styles.buttonText}>Create</Text>
                </TouchableOpacity>

              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default createProfile

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#121212'
  },

  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 150, 
  },

  title: {
    paddingTop: 40,
    paddingHorizontal: 20,
    marginBottom: 60,
    textAlign: 'center',
    fontSize: 34,
    fontWeight: 700,
    color: 'white',
  },

  formContainer: {
    width: '100%',
    alignItems: 'center',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 300,
    height: 45,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    marginBottom: 55
  },

   textInput: {
    flex: 1,
    color: 'black',
    fontSize: 16,
    paddingHorizontal: 4,
  },  
  
  dropdown: {
    width: 300,
    height: 45,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    marginBottom: 55
  },
 
  button: {
    width: 300,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginTop: 80,
    borderWidth: 2,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  buttonText: {
    textAlign: 'center',
    fontWeight: 700,
    fontSize: 22,
    color: COLORS.white
  },
  
})