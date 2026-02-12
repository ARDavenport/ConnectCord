import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard } from 'react-native'
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router'
import { COLORS } from '../../constants/themes'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function signinPage() {

  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState(''); 
  const [showPassword, setShowPassword] = React.useState(false);


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


  return (
    <SafeAreaProvider>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
      
        <Image source={require('../../assets/images/signIn_image.png')} 
          style={styles.image}
        ></Image>
        
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Welcome Back! </Text>
          <Text style={styles.subTitle}>Log in to your account</Text>
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
            <Ionicons name = 'lock-closed' size={18} color='#666'/>       
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

        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View>
            
          <TouchableOpacity style={styles.signInButton} onPress={authSignIn}>
            <Text style={styles.signInText} >SIGN IN</Text>
          </TouchableOpacity>
      
        </View>
        

        <View style={styles.footer}>
            <Text style={{ color: '#FFF'}}>
              Don't have an account? {''}
              <Link href={'/signupPage'}>
                <Text style={{ textDecorationLine: 'underline', color: COLORS.secondary}}>Sign Up </Text>
              </Link>
            </Text>
        </View>
        

      </SafeAreaView>
      </TouchableWithoutFeedback>
    </SafeAreaProvider>
  )
}


const styles = StyleSheet.create({
  
  image: {
    width: '200',
    height: '200',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#121212'
  },

  headerContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 10,
    marginBottom: 40,
  },

  title: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFF',
  },

  subTitle: {
    fontSize: 16,
    color: '#AAA',
    marginTop: 6,
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
    bottom: 80, 
  },

  
  errorText: {
    color: 'red',
    width: 300,
    marginBottom: 10,
    fontSize: 14,
  },

})