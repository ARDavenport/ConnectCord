import { StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, ScrollView } from 'react-native'
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { COLORS } from '../../constants/themes'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Dropdown } from 'react-native-element-dropdown'
import React, { useState, useEffect } from 'react'
import uuid from 'react-native-uuid';
import { API_BASE_URL } from '../../constants/api';






const createProfile = () => {  

  const router = useRouter();
  const params = useLocalSearchParams();  
  
  const { email, password } = params;  

  
  const[firstName, setFirstName] = React.useState('');
  const[middleName, setMiddleName] = React.useState('');
  const[lastName, setLastName] = React.useState('');
  const[phoneNum, setPhoneNum] = React.useState('');


  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [stateValue, setStateValue] = useState(null);
  const [city, setCity] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isCityFocus, setIsCityFocus] = useState(false);

  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchStates = async () => {
      setLoadingStates(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/location/states`);
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
    if (!stateValue){
      setCitiesList([]); // Clear cities when no state is selected
      setCity(null); // Reset city when state is cleared
      return;
    }
    setLoadingCities(true);
    const fetchCities = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/location/states/${stateValue}/cities`);
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

  const validateForm = () => {
    if (!firstName.trim()) return 'First name is required';
    if (!lastName.trim()) return 'Last name is required';
    if (!phoneNum.trim()) return 'Phone number is required';
    if (phoneNum.length < 10) return 'Please enter a valid phone number';
    if (!stateValue) return 'Please select a state';
    if (!city) return 'Please select a city';
    return null;
  };

  const handleCreateAccount = async () => {
    // Validate form first
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Check if email and password exist
    if (!email || !password) {
      setError('Session expired. Please go back and sign up again.');
      return;
    }

    setLoading(true);
    setError('');

    // Get current MySQL formatted time
    const now = new Date();
    const mysqlTime = now.toISOString().slice(0, 19).replace('T', ' ');
    const userID = uuid.v4();

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userID,
          firstName,
          middleName: middleName || null,
          lastName,
          email,
          passwords: password,
          phoneNumber: phoneNum,
          city,
          state: stateValue,
          createdAt: mysqlTime
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      console.log('Registration successful:', data);
      
      // Navigate to home page on success
      router.replace('../(tabs)/homePage');
      
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error. Check your server.');
    } finally {
      setLoading(false);
    }
  };

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
                  disable={!stateValue}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsCityFocus(false)}
                  onChange={item => {  
                    setCity(item.value);
                    setIsFocus(false);
                  }}
                />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity style={styles.button} onPress={(handleCreateAccount)}>
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

  errorText: {
    color: 'red',
    width: 300,
    marginBottom: 10,
    fontSize: 14,
  },
  
})