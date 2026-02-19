import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState } from 'react'

const bookmarks = () => {

  const dummyData = [
    {id: '1', eventName: 'Event 1', creatorName: 'John Smith'},
    {id: '2', eventName: 'Event 2', creatorName: 'John Doe'},
    {id: '3', eventName: 'Event 3', creatorName: 'Jane Doe'},
    {id: '4', eventName: 'Event 4', creatorName: 'Luke Skywalker'},
    {id: '5', eventName: 'Event 5', creatorName: 'Han Solo'},
    {id: '6', eventName: 'Event 6', creatorName: 'Mon Mothma'},
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
              <TouchableOpacity style={[styles.eventButton, {}]} onPress={btnEvent}>
                <Text style={styles.eventName} key={item.id}>{item.eventName}</Text>
                <View style={styles.eventCenter}></View>
                <Text style={styles.creatorName} key={item.id}>{item.creatorName}</Text>
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
    margin: 10,
    borderRadius: 0,
    borderBottomWidth: 2,
  },
  eventButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#80ac92',
    borderColor: '#516d5d',
    margin: 10,
    borderRadius: 2,
    width: 150, 
    height: 150,
  },
  cancelButton: {
    backgroundColor: 'grey',
    color: 'white',
    borderRadius: 10,
    margin: 5,
    padding: 10,
    alignItems: 'center',
    width: '25%', 
  },
  eventName: {
    margin: 2,
  },
  creatorName: {
    margin: 2,
  },
  eventCenter: {
    backgroundColor: '#516d5d',
    width: '100%', 
    height: 75,
  },
  eventInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
  }
})