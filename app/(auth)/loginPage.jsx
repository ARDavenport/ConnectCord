import { styles } from '../../styles/auth.styles'
import { Text, View, Image, TouchableOpacity} from 'react-native'

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

        <Link href="/signupPage" asChild>
          <TouchableOpacity>
            <Text style={styles.btn} >GET STARTED</Text>
          </TouchableOpacity>
        </Link>


        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? {''}
          <Link href="/signinPage" asChild>
            <Text style={styles.footerLink}>Sign In</Text>
          </Link>
          </Text>
          
       </View>
    
      </SafeAreaView>
    </SafeAreaProvider>   
  )
}

export default login

