import { Text, View, Image, TouchableOpacity, StyleSheet} from 'react-native'
import { COLORS } from '../../constants/themes'
import Logo from '../../assets/images/app_logo.png'
import loginImg from '../../assets/images/login_image.png'
import { Link } from 'expo-router'
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';


const loginPage = () => { 
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>

        <View style={styles.header}>
          <Image source={Logo} style={styles.headerImg}/>
          <Text style={styles.title}>Connect Cord</Text>
          <Text style={styles.subTitle}>built for connections that matter</Text>
        </View>
              
        <View>
          <Image source={loginImg} style={styles.loginImg}/>
        </View>

        <Link href="/signupPage" asChild>
          <TouchableOpacity>
            <Text style={styles.btn} >GET STARTED</Text>
          </TouchableOpacity>
        </Link>


        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?{''}
          <Link href="/signinPage" asChild>
            <Text style={styles.footerLink}>Sign In</Text>
          </Link>
          </Text>
          
       </View>
    
      </SafeAreaView>
    </SafeAreaProvider>   
  )
}

export default loginPage


const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 18,
      backgroundColor: COLORS.backgroundColor
    },
    header: {
      marginTop: 30,
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
      fontSize: 42,
      marginBottom: 10,
      color: COLORS.white
    },
  
    subTitle: {
      fontSize: 16,
      color: '#AAA',
      marginTop: 6,
      marginBottom: 50
    },
    
  
    loginImg: {
      height: 300,
      width: 300,
      alignSelf: 'center',
      paddingTop: 10
  
    },
  
    btn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 30,
      paddingVertical: 16,
      paddingHorizontal: 20,
      marginTop: 10,
      borderWidth: 2,
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
      textAlign: 'center',
      fontWeight: 700,
      fontSize: 22,
      color: COLORS.white
    },
    
    footer:{
      alignItems: 'center',
      marginTop: 50
    },
  
    footerLink: {
      textDecorationLine: 'underline', 
      textDecorationColor: COLORS.secondary,
      color: COLORS.secondary
    },
  
    footerText: {  
      color: COLORS.white,
      textAlign: 'center',
  
    },
    
})
