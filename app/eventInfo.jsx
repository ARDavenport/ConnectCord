import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
import { Ionicons } from "@expo/vector-icons"
import { useRouter, useLocalSearchParams } from 'expo-router' 
import { COLORS } from '../constants/themes'

import React, { useState } from 'react'
import banner from '../assets/images/placeholder_image.avif'

const eventInfo = () => {

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
            

          <Text style={styles.title}>Microsoft 365 Copilot Training for Marketing</Text>

          <View style={styles.infoBlock}>
            
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={18} color="white" />
              <Text style={styles.infoText}>March 20 • 6:00 PM - 8:00 PM</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="location-sharp" size={18} color="white" />
              <Text style={styles.infoText}>Online</Text>
            </View>

          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionHeader}>About this event</Text>
            <Text style={styles.descriptionText}>
              Join us at a free Microsoft 365 Copilot Training for Marketing to explore the fundamentals of using Copilot as your own AI assistant. Through expert-led demos, discover how Copilot helps you create, coordinate, and deliver marketing content faster.

              During this tutorial, you’ll discover how to create prompts that deliver results, build foundational AI skills, and get the most out of Copilot in the apps you use every day. Engage with Microsoft experts to ask questions and get answers on how to apply AI to your daily tasks.
            </Text>
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

export default eventInfo

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