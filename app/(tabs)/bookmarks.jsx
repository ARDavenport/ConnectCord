import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState } from 'react'

const bookmarks = () => {

  const dummyData = [
    {id: '1', name: 'Event 1'},
    {id: '2', name: 'Event 2'},
    {id: '3', name: 'Event 3'},
    {id: '4', name: 'Event 4'},
    {id: '5', name: 'Event 5'},
    {id: '6', name: 'Event 6'},
  ];

  const [showEvent, changeShowEvent] = useState(false);

  const btnEvent = () => {
    changeShowEvent(!showEvent);
  };
  

  return (
    <View style={{ flex: 1 }}>
        
      {!showEvent && (
        <View 
        style={{
          flex: 1,
          alignItems: 'center',
        }}>
          <Text> Your bookmarks will appear here! 🎉</Text>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
            {dummyData.map((item) => (
              <TouchableOpacity style={styles.eventButton} onPress={btnEvent}>
                <Text key={item.id}>{item.name}</Text>
              </TouchableOpacity>
            ) )}
          </ScrollView>
        </View>
      )}
    
    {showEvent && (
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <View style={styles.card}><Text>Event Name</Text></View>
        <View style={styles.card}><Text>Location</Text></View>
        <View style={styles.card}><Text>Time</Text></View>
        <View style={styles.card}><Text>Date</Text></View>
        <View style={styles.card}><Text>Event Name</Text></View>
        <TouchableOpacity style={styles.cancelButton} onPress={btnEvent}>
          <Text style={styles.buttonText}>Exit</Text>
        </TouchableOpacity>
      </ScrollView>
    )}

    </View>
  )
}

export default bookmarks

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10
  },
 
  eventButton: {
    backgroundColor: '#80ac92',
    borderWidth: 2,
    borderColor: '#516d5d',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 10,
    width: 150, 
    height: 150,
  },
  cancelButton: {
    backgroundColor: 'maroon',
    color: 'white',
    borderRadius: 10,
    margin: 5,
    padding: 10,
    alignItems: 'center'
  },
})