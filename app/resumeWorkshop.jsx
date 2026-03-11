
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from 'expo-router' 
import { COLORS } from '../constants/themes'

import React from 'react'
import banner from '../assets/images/CFCD.png'

const resumeWorkshop = () => {

  const router = useRouter()
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

           
          <Image source={banner} style={styles.headerImage} />

          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={32} color="#4ADE80" />
          </TouchableOpacity>
            

          <Text style={styles.title}>Professional Resume Review</Text>

          <View style={styles.infoBlock}>
            
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={18} color="white" />
              <Text style={styles.infoText}>April 10 • 11:00 A.M - 12:00 PM</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="location-sharp" size={18} color="white" />
              <Text style={styles.infoText}>Brunner 108</Text>
            </View>

          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionHeader}>About this event</Text>
            <Text style={styles.descriptionText}>
              Get your resume reviewed by career development professionals at Tennessee Tech. This workshop provides personalized feedback to help you strengthen your resume for internships, co-ops, and job applications. Learn what employers look for, how to showcase your experiences, and tips for making your application stand out. Bring a copy of your current resume. All majors welcome.
            </Text>
          </View>


          <View style={styles.buttonContainer}>

            <TouchableOpacity style={styles.registerButton}>
              <Text style={styles.registerText}>Register For Event</Text>
            </TouchableOpacity>

          </View>

        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default resumeWorkshop

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222'
  },

  headerImage: {
    width: '100%',
    height: 250,
    marginBottom: 20,
    
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginHorizontal: 20,
    marginBottom: 15,
  },

  infoBlock: {
    marginHorizontal: 20,
    marginBottom: 25,
    gap: 10,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  infoText: {
    color: 'white',
    fontSize: 16,
  },

  descriptionContainer: {
    marginHorizontal: 20,
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
  },

  descriptionHeader: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },

  descriptionText: {
    color: '#ddd',
    fontSize: 15,
    lineHeight: 20,
  },

  buttonContainer: {
    marginHorizontal: 30,
    marginTop: 30
  },

  registerButton: {
    flexDirection: 'row',
    borderRadius: 30,
    paddingVertical: 20, 
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
          
  },

  registerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 600
  },

  


  backButton: {
    position: 'absolute',   
    top: 55,               
    left: 15,              
    zIndex: 10,            
  },
  
})
