import { styles } from '../../styles/auth.styles'
import { Text, View, Image, TouchableOpacity, TextInput} from 'react-native'

import Logo from '../../assets/images/app_logo.png'
import loginImg from '../../assets/images/login_image.png'
import { Link } from 'expo-router'
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';



const login = () => { 
  
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

        <Link href="/signinPage" asChild>
          <TouchableOpacity>
            <Text style={styles.btn} >LOGIN</Text>
          </TouchableOpacity>
        </Link>


        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? {''}
          <Link href="/signupPage" asChild>
            <Text style={styles.footerLink}>Sign Up</Text>
          </Link>
          </Text>
          
       </View>
    
      </SafeAreaView>
    </SafeAreaProvider>   
  )
}

export default login

