
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from 'expo-router' 
import { COLORS } from '../constants/themes'

import React, { useState} from 'react'
import banner from '../assets/images/Career_Fair.png'

const careerFair = () => {

  const router = useRouter()
  
  const [registered, setRegistered] = useState(false)

  const handleRegisterPress = () => {
    if (!registered) {
      setRegistered(true)
    } else {
      Alert.alert(
        "Unregister",
        "Are you sure you want to unregister from this event?",
        [
          {
            text: "Yes",
            onPress: () => setRegistered(false)
            
          },
          {
            text: "Cancel",
            style: "cancel"
          }
        ]
      )
    }
  }
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

           
          <Image source={banner} style={styles.headerImage} />

          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={32} color="#4ADE80" />
          </TouchableOpacity>
            

          <Text style={styles.title}>Career Fair</Text>

          <View style={styles.infoBlock}>
            
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={18} color="white" />
              <Text style={styles.infoText}>September 20 • 9:00 A.M - 2:00 PM</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="location-sharp" size={18} color="white" />
              <Text style={styles.infoText}> Hooper Eblen Center</Text>
            </View>

          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionHeader}>About this event</Text>
            <Text style={styles.descriptionText}>
              Join Tennessee Tech University for the 2026 Spring Career Fair, the premier networking event connecting students and alumni with top employers from across the region. This is your opportunity to explore internships, co-ops, and full-time positions while building professional relationships that can launch your career.

              </Text>
            
            <Text style={styles.descriptionText}>
              What to expect:
            </Text>
            
            <View style={styles.bulletContainer}>
              <Text style={styles.bulletPoint}>• Meet with recruiters from 50+ companies seeking Tech talent</Text>
              <Text style={styles.bulletPoint}>• Explore opportunities across engineering, business, computer science, and more</Text>
              <Text style={styles.bulletPoint}>• Get your resume reviewed by industry professionals</Text>
              <Text style={styles.bulletPoint}>• Network with potential employers in a professional setting</Text>
              <Text style={styles.bulletPoint}>• Learn about internship and full-time openings</Text>
            </View>

            
          </View>


          <View style={styles.buttonContainer}>         
            <TouchableOpacity
              style={[
                styles.registerButton,
                registered && { backgroundColor: "#16A34A", borderColor: "#16A34A" } 
              ]}
              onPress={handleRegisterPress} 
            >
              <Text style={styles.registerText}>
                {registered ? "✓ Registered" : "Register For Event"} 
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default careerFair

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
  
  bulletPoint: {
    color: '#ddd',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 4,
  },

  buttonContainer: {
    marginHorizontal: 30,
    marginTop: 10
  },

})
