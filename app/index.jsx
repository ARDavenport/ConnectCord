import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, {useState} from 'react'
import Logo from '../assets/images/app_logo.png'
import bckgrd from '../assets/images/bckgrdImg.png'
import { Link } from 'expo-router'
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';



const Home = () => {
  
  return (
    <SafeAreaProvider>
      <ImageBackground source={bckgrd} resizeMode='cover' style={{ flex:1 }}>
          <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          


            <View style={styles.header}>
              <Image source={Logo} style={styles.headerImg}/>
              <Text style={styles.title}>Sign in to Connect Cord</Text>
            </View>
              

            <View style={styles.inputContainer}>
              <Text style={{fontSize: 15, fontWeight: '500'}}>Username:</Text>
              <TextInput style={styles.userInput}></TextInput>
              <Text style={{fontSize: 15, fontWeight: '500'}}>Password:</Text>
              <TextInput style={styles.userInput}></TextInput>

            </View>

            <Link href="/homeScreen" asChild>
              <TouchableOpacity>
                <Text style={styles.btn} >LOGIN</Text>
              </TouchableOpacity>
            </Link>


            <View style={{ flex: 1 }}>
              <Text style={styles.sgnUp}>
                Don't have an account?<Link href={'signUp'} style={styles.signUpLink}>Sign up</Link>
              </Text>
            </View>
          
          </SafeAreaView>
      </ImageBackground>
    </SafeAreaProvider>   

  )
}

export default Home

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 18
  },
  header: {
    marginTop: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5
  },
  headerImg: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 30
  },
  title: {
    fontWeight: '700',
    fontSize: 30,
    marginBottom: 55,
    fontFamily: 'Marker Felt',
  },
  

  inputContainer: {
    marginTop: 20,
    paddingHorizontal:15,
    marginBottom: 25
  },

  userInput: {
    borderWidth: 1,
    backgroundColor: '#FFFF',
    borderColor: '#D3D3D3',
    borderRadius: 10,
    padding: 8,
    marginTop: 10,
    marginBottom: 30

  },

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    backgroundColor: "#86b499",
    borderColor: "#86b499",
    textAlign: 'center',
    fontWeight: 700,
    fontSize: 20,
    color: '#FFF'
  },
  
  sgnUp: {
    textAlign: 'center',
    fontSize: 15
  },
  signUpLink: {
    textDecorationLine: 'underline', 
    textDecorationColor: 'blue',
    color: 'blue'
  }
  
})