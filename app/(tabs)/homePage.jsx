import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, TextInput, FlatList } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { Ionicons } from "@expo/vector-icons";


const homePage = () => {

    const dummyData = [
      {id: '1', eventName: 'Event 1', creatorName: 'John Smith'},
      {id: '2', eventName: 'Event 2', creatorName: 'John Doe'},
      {id: '3', eventName: 'Event 3', creatorName: 'Jane Doe'},
      {id: '4', eventName: 'Event 4', creatorName: 'Luke Skywalker'},
      {id: '5', eventName: 'Event 5', creatorName: 'Han Solo'},
      {id: '6', eventName: 'Event 6', creatorName: 'Mon Mothma'},
    ];

    const [showEvent, changeShowEvent] = useState(false);
    const [expandEvents, changeExpandEvents] = useState(false);

    const btnEvent = () => {
      changeShowEvent(!showEvent);
    };

    const btnExpandEvents = () => {
      changeExpandEvents(!expandEvents);
    };

    const btnExpandEventsEvent = () => {
      changeShowEvent(!showEvent);
      changeExpandEvents(!expandEvents);
    };

    const [text, setText] = useState('');

  return (
    <View style={[styles.container, {flex: 1}]}>
      {!showEvent && !expandEvents && (
        <ScrollView showsVerticalScrollIndicator={true} style={[styles.container, {flex: 1}]}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-end',
              gap: '16px',
              margin: 10,
            }}>
          <TextInput
            placeholder="  Search 🔍 "
            onChangeText={newText => setText(newText)}
            defaultValue={text}
            style={{
              height: 40,
              padding: 5,
              marginHorizontal: 8,
              borderWidth: 3,
              borderColor: '#516d5d',
              color: '#516d5d',
              borderRadius: 10
            }}
          />
        </View>
          <View style={[styles.container, {alignItems:'center', borderBottomWidth: 0}]}>
            <Image source={require('../../assets/images/app_logo.png')} 
              style={{width: 200, height: 200}}
            />
            
          </View>
          <View style={[styles.container, {flexDirection: 'row', width: '100%'}]}>
            <Text>Your Events   </Text>
            <TouchableOpacity style={styles.expandButton} onPress={btnExpandEvents}>
              <Ionicons name="expand-outline"/>
            </TouchableOpacity>
            
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
            {dummyData.map((item) => (
              <TouchableOpacity style={styles.eventButton} onPress={btnEvent}>
                <Text style={styles.eventName} key={item.id}>{item.eventName}</Text>
                <View style={styles.eventCenter}></View>
                <Text style={styles.creatorName} key={item.id}>{item.creatorName}</Text>
              </TouchableOpacity>
            ) )}

          </ScrollView>
          
          
          <Text style={styles.container}>Events Near You</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
            {dummyData.map((item) => (
              <TouchableOpacity style={styles.eventButton} onPress={btnEvent}>
                <Text style={styles.eventName} key={item.id}>{item.eventName}</Text>
                <View style={styles.eventCenter}></View>
                <Text style={styles.creatorName} key={item.id}>{item.creatorName}</Text>
              </TouchableOpacity>
            ) )}

          </ScrollView>

          <Text style={styles.container}>Events Coming Up Soon</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
            {dummyData.map((item) => (
              <TouchableOpacity style={styles.eventButton} onPress={btnEvent}>
                <Text style={styles.eventName} key={item.id}>{item.eventName}</Text>
                <View style={styles.eventCenter}></View>
                <Text style={styles.creatorName} key={item.id}>{item.creatorName}</Text>
              </TouchableOpacity>
            ) )}

          </ScrollView>

          <Text style={styles.container}>Events for Your Interests</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
            {dummyData.map((item) => (
              <TouchableOpacity style={styles.eventButton} onPress={btnEvent}>
                <Text style={styles.eventName} key={item.id}>{item.eventName}</Text>
                <View style={styles.eventCenter}></View>
                <Text style={styles.creatorName} key={item.id}>{item.creatorName}</Text>
              </TouchableOpacity>
            ) )}

          </ScrollView>

          <Text style={styles.container}>Events by Organizations/People You Follow</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
            {dummyData.map((item) => (
              <TouchableOpacity style={styles.eventButton} onPress={btnEvent}>
                <Text style={styles.eventName} key={item.id}>{item.eventName}</Text>
                <View style={styles.eventCenter}></View>
                <Text style={styles.creatorName} key={item.id}>{item.creatorName}</Text>
              </TouchableOpacity>
            ) )}

          </ScrollView>
        </ScrollView>
      )}
      {showEvent && !expandEvents && (
          <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.card}><Text>Event Name</Text></View>
              <View style={styles.card}><Text>Location</Text></View>
              <View style={styles.card}><Text>Time</Text></View>
              <View style={styles.card}><Text>Date</Text></View>
              <View style={styles.card}><Text>Event Name</Text></View>
            <View style={styles.eventInfo}>
              <TouchableOpacity style={styles.cancelButton} onPress={btnEvent}>
                <Text style={styles.buttonText}>Exit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
      )}
      {expandEvents && !showEvent && (
        <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
          <View style={{flexDirection: 'row'}}>
            <FlatList
              data={dummyData}
              renderItem={ ({item}) =>
                <TouchableOpacity style={[styles.eventButton, {}]} onPress={btnExpandEventsEvent}>
                  <Text style={styles.eventName} key={item.id}>{item.eventName}</Text>
                  <View style={styles.eventCenter}></View>
                  <Text style={styles.creatorName} key={item.id}>{item.creatorName}</Text>
                </TouchableOpacity>
              }
              numColumns={2} 
              keyExtractor={(item) => item.id}
            />
          </View>
          <View style={styles.eventInfo}>
              <TouchableOpacity style={styles.cancelButton} onPress={btnExpandEvents}>
                <Text style={styles.buttonText}>Exit</Text>
              </TouchableOpacity>
            </View>
        </ScrollView>
      )}
    </View>
  )
}

export default homePage

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
