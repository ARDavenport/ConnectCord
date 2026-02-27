import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native'
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";


import React, { useState } from 'react'



const dummy = () => {


  const dummyData = [
    { id: '1', eventName: 'Event 1', creatorName: 'John Smith' },
    { id: '2', eventName: 'Event 2', creatorName: 'John Doe' },
    { id: '3', eventName: 'Event 3', creatorName: 'Jane Doe' },
    { id: '4', eventName: 'Event 4', creatorName: 'Luke Skywalker' },
    { id: '5', eventName: 'Event 5', creatorName: 'Han Solo' },
    { id: '6', eventName: 'Event 6', creatorName: 'Mon Mothma' },
  ];

  const [showEvent, changeShowEvent] = useState(false);
  const [expandEvents, changeExpandEvents] = useState(false);
  const [text, setText] = useState('');

  const btnEvent = () => changeShowEvent(!showEvent);
  const btnExpandEvents = () => changeExpandEvents(!expandEvents);
  const btnExpandEventsEvent = () => {
    changeShowEvent(!showEvent);
    changeExpandEvents(!expandEvents);
  };

  const EventRow = ({ title, data, onPress }) => (
    <View style={styles.eventRowContainer}>
      <View style={styles.eventRowHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Ionicons name="chevron-forward-outline" size={18} color="#516d5d" />
      </View>

      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.eventCard} onPress={onPress}>
            <View style={styles.eventImage} />
            <Text numberOfLines={1} style={styles.eventTitle}>{item.eventName}</Text>
            <Text numberOfLines={1} style={styles.eventCreator}>{item.creatorName}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );





  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={[styles.scrollContainer, {paddingBottom: 10}]}
          keyboardShouldPersistTaps="handled"
          bounces={true}
                  
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}> Connect Cord </Text>
          </View>
          <View style={styles.searchWrapper}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={20} color="#E1D9D1" />
              <TextInput
                autoCorrect={false}
                placeholder="Search For Events"
                placeholderTextColor="#E1D9D1"
                value={text}
                onChangeText={setText}
                style={styles.searchInput}

              />
            </View>
          </View>

          <EventRow title="Your Events" data={dummyData} onPress={btnEvent} />
          <EventRow title="Events Coming Up Soon" data={dummyData} onPress={btnEvent} />
          <EventRow title="Events For Your Interests" data={dummyData} onPress={btnEvent} />

          
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default dummy

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#222222',
  },

  scrollContainer: {
    alignItems: 'center',
  },

  titleContainer: {
    marginTop: 10,
    marginBottom: 10
  },

  title: {
    fontSize: 30,
    fontWeight: 700,
    color: 'white',
  },

  searchWrapper: {
    width: '100%',          
    paddingHorizontal: 16,
    paddingTop: 10,
    marginBottom: 30,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#555',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#555',
    paddingHorizontal: 10,
    height: 44,
  },

  searchInput: {
    flex: 1,              
    color: 'white',
    marginLeft: 8,  
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginRight: 6,
  },

  eventRowContainer: {
    marginBottom: 40, 
    width: '100%',
  },

  eventRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 6,
  },

  eventCard: {
    width: 130,
    height: 140,
    marginRight: 12,
    borderRadius: 14,
    backgroundColor: '#333',
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  eventImage: {
    width: '100%',
    height: 80,
    borderRadius: 10,
    backgroundColor: '#80ac92',
    marginBottom: 6,
  },

  eventTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
  },

  eventCreator: {
    fontSize: 11,
    color: '#ccc',
  },
  

})