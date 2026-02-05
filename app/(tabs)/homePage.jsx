import { ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { COLORS } from '../../constants/themes'

const homePage = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.containeer}>

      <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            margin: 40,
            padding: 30,
          }}>
        <Image source={require('../../assets/images/app_logo.png')} 
          style={{width: 200, height: 200}}
        />
        <Text style={styles.container}>Events will appear here! 🎉</Text>
      </View>
      
      <Text style={styles.container}>Your Events</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
        <View style={styles.card}>
          <Text>Event Name</Text>
        </View>
        <View style={styles.card}><Text>Event Name</Text></View>
        <View style={styles.card}><Text>Event Name</Text></View>
        <View style={styles.card}><Text>Event Name</Text></View>
        <View style={styles.card}><Text>Event Name</Text></View>
        <View style={styles.card}><Text>Event Name</Text></View>
      </ScrollView>
      <Text style={styles.container}>Events Near You</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
        <View style={styles.card}>
          <Text>Event Name</Text>
        </View>
        <View style={styles.card}><Text>Event Name</Text></View>
        <View style={styles.card}><Text>Event Name</Text></View>
        <View style={styles.card}><Text>Event Name</Text></View>
        <View style={styles.card}><Text>Event Name</Text></View>
        <View style={styles.card}><Text>Event Name</Text></View>
      </ScrollView>
      <Text style={styles.container}>Events Coming Up Soon</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
        <View style={styles.card}>
          <Text>Event Name</Text>
        </View>
        <View style={styles.card}><Text>Event Name</Text></View>
        <View style={styles.card}><Text>Event Name</Text></View>
        <View style={styles.card}><Text>Event Name</Text></View>
        <View style={styles.card}><Text>Event Name</Text></View>
        <View style={styles.card}><Text>Event Name</Text></View>
      </ScrollView>
      <Text style={styles.container}>Events for Your Interests</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
        <View style={styles.card}>
          <Text>Event Name</Text>
        </View>
        <View style={styles.card}><Text>Event Name</Text></View>
        <View style={styles.card}><Text>Event Name</Text></View>
        <View style={styles.card}><Text>Event Name</Text></View>
        <View style={styles.card}><Text>Event Name</Text></View>
        <View style={styles.card}><Text>Event Name</Text></View>
      </ScrollView>
      <Text style={styles.container}>Events by Organizations/People You Follow</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
        <View style={styles.card}>
          <Text>Event Name</Text>
        </View>
        <View style={styles.card}><Text>Event Name</Text></View>
        <View style={styles.card}><Text>Event Name</Text></View>
        <View style={styles.card}><Text>Event Name</Text></View>
        <View style={styles.card}><Text>Event Name</Text></View>
        <View style={styles.card}><Text>Event Name</Text></View>
      </ScrollView>
    </ScrollView>
  )
}

export default homePage

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    
  },
  card: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 10,
    width: 150, 
    height: 150,
    backgroundColor: COLORS.secondary
  },
})