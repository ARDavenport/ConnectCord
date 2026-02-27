import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, TextInput, Image, TouchableOpacity} from 'react-native'
import { Link, useRouter} from 'expo-router'
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { COLORS } from '../../constants/themes'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { API_BASE_URL } from '../../constants/api';


export default function signupPage() {

  const router = useRouter();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [cPassword, setCPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);




  const checkEmailExists = async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      return data.exists;
    } catch (err) {
      console.error('Error checking email:', err);
      return false;
    }
  };

  const handleContinue = async () => {
    setError('');
    setLoading(true);

    // Validate form fields
    if (!email || !password || !cPassword) {
      setError('Please fill in every field');
      setLoading(false);
      return;
    }

    if (password !== cPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Check if email already exists
    try {
      const emailExists = await checkEmailExists(email);
      
      if (emailExists) {
        setError('User already exists with this email. Please sign in or use another email.');
        setLoading(false);
        return;
      }

      router.push({
        pathname: '/createProfile',
        params: {
          email: email,
          password: password
        }
      });
      
    } catch (err) {
      console.error('Registration error:', err);
      setError('Network error. Check your server.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaProvider>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>

          <Image source={require('../../assets/images/app_logo.png')} style={styles.Img}></Image>

          <View style={styles.headerContainer}>
            <Text style={styles.title}>Welcome!</Text>
            <Text style={styles.subTitle}>Create Your Account</Text>
          </View>

          

          <View style={styles.formContainer}>

            <View style={styles.inputContainer}>
              <Ionicons name = 'mail' size={18} color='#666'/>  
              <TextInput
                style={styles.textInput} 
                placeholder='Email'
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

            <View style={styles.inputContainer}>
              <Ionicons name = 'lock-open' size={18} color='#666'/>  
              <TextInput
                style={styles.textInput} 
                placeholder='Password'
                placeholderTextColor={'#666'}
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError('');
                }}
              ></TextInput>
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color='#666'/>
              </TouchableOpacity>                
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name = 'lock-closed' size={18} color='#666'/>  
              <TextInput
                style={styles.textInput} 
                placeholder='Confirm Password'
                placeholderTextColor={'#666'}
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={!showPassword}
                value={cPassword}
                onChangeText={(text) => {
                  setCPassword(text);
                  setError('');
                }}
              ></TextInput>
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color='#666'/>
              </TouchableOpacity>            
            </View>

          </View>
                
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
          <View>

            <TouchableOpacity style={styles.signInButton} onPress={handleContinue}>
              <Text style={styles.signInText} >SIGN UP</Text>
            </TouchableOpacity>
        
          </View>

          <View style={styles.footer}>
            <Text style={{ color: '#FFF' }}>Already have an account? {''} 
              <Link href={'/signinPage'}>
                <Text style={{ textDecorationLine: 'underline', color: COLORS.secondary}}>Sign in</Text>
              </Link>
            </Text>
          </View>

         


        </SafeAreaView>
      </TouchableWithoutFeedback>
    </SafeAreaProvider>
  )
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#121212'
  },

  headerContainer: {
    width: '100%',
    alignItems: 'center',
   
  },

  title: {
    fontSize: 40,
    fontWeight: 700,
    color: '#FFF',
    textAlign: 'center',
    
  },

  subTitle: {
    fontSize: 16,
    color: '#AAA',
    marginTop: 6,
    marginBottom: 50
  },

  Img: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 30
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
    marginBottom: 25
    
  },

  textInput: {
    flex: 1,
    color: 'black',
    fontSize: 16,
    paddingHorizontal: 4,
  },  

  signInButton: {
    width: 300,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginTop: 30,
    borderWidth: 2,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },


  signInText: {
    textAlign: 'center',
    fontWeight: 700,
    fontSize: 22,
    color: COLORS.white
  },

  footer: {
    position: 'absolute',
    bottom: 80
  },

  errorText: {
    color: 'red',
    width: 300,
    marginBottom: 10,
    fontSize: 14,
  },

})