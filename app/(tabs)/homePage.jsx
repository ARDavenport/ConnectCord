import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, ImageBackground } from 'react-native'
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React, { useState } from 'react'

import careerFair from '../../assets/images/Career_Fair.png'
import CFCD from '../../assets/images/CFCD.png'
import MicroSoft from '../../assets/images/placeholder_image.avif'

const eventRoutes = {
  '1': '../careerFair',  
  '2': '../resumeWorkshop', 
  '3': '../eventInfo', 
}

const homePage = () => {
  const router = useRouter();

  const dummyData = [
    { id: '1', 
      eventName: 'TN Tech Fall 2026 Career Fair', 
      creatorName: 'Tennessee Tech', 
      image: careerFair
    },
    { 
      id: '2', 
      eventName: 'Resume Workshop', 
      creatorName: 'Tennessee Tech Career Development',
      image: CFCD
    },
    { id: '3', 
      eventName: 'Copilot Training', 
      creatorName: 'Microsoft', 
      image: MicroSoft
    },
  ];

  const [text, setText] = useState('');
  const [yourEvents, setYourEvents] = useState([]); 
  
  const goToEvent = (event) => {
    router.push({
      pathname: eventRoutes[event.id],
      params: {
        eventData: event,
        saveEventCallback: (eventToSave) => {
          setYourEvents(prev => {
            if (prev.find(e => e.id === eventToSave.id)) return prev;
            return [...prev, eventToSave];
          });
        }
      }
    });
  };

  const renderEventItem = ({ item }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => goToEvent(item)}
    >
      <ImageBackground
        source={item.image}
        style={styles.eventImage}
        imageStyle={{ borderRadius: 14 }}
      >
        <View style={styles.overlay} />
        <View style={styles.textContainer}>
          <Text numberOfLines={2} style={styles.eventTitle}>
            {item.eventName}
          </Text>
          <Text numberOfLines={1} style={styles.eventCreator}>
            {item.creatorName}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Connect Cord</Text>
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
      <View style={styles.eventRowHeader}>
        <Text style={styles.sectionTitle}>Events Coming Up Soon</Text>
      </View>
    </>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={dummyData}
          keyExtractor={(item) => item.id}
          renderItem={renderEventItem}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={true}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default homePage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222',
  },

  scrollContainer: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },

  titleContainer: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: 'white',
  },

  searchWrapper: {
    width: '100%',
    paddingHorizontal: 4,
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
    marginBottom: 12,
  },

  eventRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  eventCard: {
    width: '100%',
    height: 220,
    marginBottom: 40,
    borderRadius: 14,
    overflow: 'hidden',
  },

  eventImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  textContainer: {
    padding: 10,
  },

  eventTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },

  eventCreator: {
    fontSize: 12,
    color: '#ddd',
  },
});