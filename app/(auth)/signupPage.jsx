import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, TextInput, Image, TouchableOpacity} from 'react-native'
import { Link, useRouter} from 'expo-router'
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { COLORS } from '../../constants/themes'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'


export default function signupPage() {

  const router = useRouter();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [cPassword, confirmPassword] = React.useState('');

  const authAccount = () => {

   router.replace('/createProfile')
  }

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
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                }}
              ></TextInput>              
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name = 'lock-closed' size={18} color='#666'/>  
              <TextInput
                style={styles.textInput} 
                placeholder='Confirm Password'
                placeholderTextColor={'#666'}
                autoCapitalize='none'
                autoCorrect={false}
                value={cPassword}
                onChangeText={(text) => {
                  confirmPassword(text);
                }}
              ></TextInput>              
            </View>

          </View>


          <View>
                    
            <TouchableOpacity style={styles.signInButton} onPress={authAccount}>
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
  }

})