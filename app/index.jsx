import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, TextInput } from 'react-native'
import React from 'react'
import Logo from '../assets/images/app_logo.png'
import bckgrd from '../assets/images/bckgrdImg.png'
import { Link } from 'expo-router'
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';



const Home = () => {
  return (
    <SafeAreaProvider>
      <ImageBackground source={bckgrd} resizeMode='cover' style={{flex:1}}>
          <SafeAreaView style={styles.container} edges={[]}>

            <View style={styles.header}>
              <Image source={Logo} style={styles.headerImg}/>
              <Text style={styles.title}>Sign in to Connect Cord</Text>
              <Text style={styles.subTitle}> Built for connections that matter</Text>
            </View>

            <View>

            </View>
             
            
            <Link href="/homeScreen" asChild>
              <TouchableOpacity>
                <Text style={styles.btn} >LOGIN</Text>
              </TouchableOpacity>
            </Link>


            <View>
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
    marginTop: 80,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerImg: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 36
  },
  title: {
    fontWeight: '700',
    fontSize: 32,
    marginBottom: 8,
    fontFamily: 'Marker Felt',
  },
  subTitle: {
    fontWeight: '500',
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'Marker Felt',
  },

  infoBody: {
    
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
    color: '#FFF'
  },
  
  sgnUp: {
    textAlign: 'center',
    marginTop: 30
  },
  signUpLink: {
    textDecorationLine: 'underline', 
    textDecorationColor: 'blue',
    color: 'blue'
  }
  
})