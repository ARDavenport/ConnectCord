import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const bookmarks = () => {
  return (
    <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
      <Text>Your bookmarks will appear here! 🎉</Text>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <View style={styles.card}><Text>Event</Text></View>
        <View style={styles.card}><Text>Event</Text></View>
        <View style={styles.card}><Text>Event</Text></View>
        <View style={styles.card}><Text>Event</Text></View>
        <View style={styles.card}><Text>Event</Text></View>
        <View style={styles.card}><Text>Event</Text></View>
      </ScrollView>
    </View>
  )
}

export default bookmarks

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10
  },
  card: {
    width: '100%',
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 10,
    width: 150, 
    height: 150,
  },
})