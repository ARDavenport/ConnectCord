
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, TextInput, Alert, Button } from 'react-native'
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect } from 'react';
import  userDefault from '../../assets/images/defaultImg.png'
import { COLORS } from '../../constants/themes';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker'
import { WebView } from 'react-native-webview'


const profile = () => {

  const router = useRouter();
  const DEFAULT_ABOUT = "Write something about yourself";

  const [profileImage, setProfileImage] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [aboutMe, setAboutMe] = useState(DEFAULT_ABOUT);
  const [isEditing, setIsEditing] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [events, setEvents] = useState([
    'Workshop',
    'Career Fair',
  ]);
  const [file, setFile] = useState(null);
  
  
  const pickImage = async (setImage) => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required to access photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], 
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };


  const addTag = () => {
    const trimmed = tagInput.trim();

    if (!trimmed) {
      setIsAddingTag(false);
      return;
    }

    if (trimmed.length > 20) {
      Alert.alert('Tag too long', 'Tags can be at most 10 characters.');
      return;
    }

    if (tags.length >= 4) {
      Alert.alert('You can only add three tags');
      return;
    }

    if (!tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }

    setTagInput('');
    setIsAddingTag(false); 
  }; 

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };


  const toggleEdit = () => {
    if (isEditing) {
      setIsEditing(false);
      if (aboutMe.trim() === "") {
        setAboutMe(DEFAULT_ABOUT);
      }
    } else {
      setIsEditing(true);
      if (aboutMe === DEFAULT_ABOUT) setAboutMe("");
    }
  };


  const logout = () => {
    Alert.alert(
      'Logging Out',
      'Are you sure you want to logout?',
      [
        {
          text: 'Yes',
          onPress: () => router.replace('../(auth)/signinPage')
        },
        {
          text: 'No'
        }
      ]
    );
  };

  const pickResume = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });
    if (result)

    if (!result.canceled){
      setFile(result.assets[0]);
    }
  }

  
  return (


    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['left','right','bottom']}>
       <ScrollView
          contentContainerStyle={[styles.scrollContainer, {paddingBottom: 40}]}
          keyboardShouldPersistTaps="handled"
          bounces={true}
          
        >
          <TouchableOpacity
            style={styles.settingButton}  
            onPress={logout}
          >
            <Ionicons name="exit" size={32} color="white" />
          </TouchableOpacity>

          <View style={styles.headerColorBar} />

          <View style={styles.imageWrapper}>
            <View style={styles.imageClip}>
              <Image
                source={profileImage ? { uri: profileImage } : userDefault}
                style={[
                  styles.userImage,
                  !profileImage && { width: '75%', height: '75%', alignSelf: 'center' }
                ]}
              />
            </View>

            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => pickImage(setProfileImage)}
            >
              <Ionicons name="camera" size={22} color="white" />
            </TouchableOpacity>
          </View>

                <Text style={styles.fullName}>Test One</Text>


          <Text style={styles.location}>Cookeville, TN</Text>
      
          
                      
          <View style={styles.tagSection}>
            <View style={styles.tagInputRow}>
              {tags.map((tag, index) => (
                <View key={index} style={styles.tagBubble}>
                  <Text style={styles.tagText}>{tag}</Text>
                  <TouchableOpacity onPress={() => removeTag(index)}>
                    <Ionicons name="close" size={12} color="white" />
                  </TouchableOpacity>
                </View>
              ))}

              {tags.length < 4 && (
                isAddingTag ? (
                  <>
                    <TextInput
                      style={styles.tagInput}
                      placeholder="Add Personal Tag That Describes You"
                      placeholderTextColor="#888"
                      value={tagInput}
                      onChangeText={setTagInput}
                      onSubmitEditing={addTag}
                      autoFocus
                      returnKeyType="done"
                    />

                    <TouchableOpacity
                      style={styles.addTagButton}
                      onPress={addTag}
                    >
                      <Ionicons name="checkmark" size={12} color="white" />
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    style={styles.addTagButton}
                    onPress={() => setIsAddingTag(true)}
                  >
                    <Ionicons name="add" size={12} color="white" />
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>


          <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>About Me</Text>
              <TouchableOpacity onPress={toggleEdit}>
                <Ionicons name="brush" size={18} color="white" />
              </TouchableOpacity>
            </View>

            {isEditing ? (
              <TextInput
                style={styles.cardTextInput}
                multiline
                autoCorrect={false}
                value={aboutMe}
                onChangeText={setAboutMe}
                placeholder={DEFAULT_ABOUT}
                placeholderTextColor="#888"     
                autoFocus
              />
            ) : (
              <Text style={styles.aboutText}>{aboutMe}</Text>
            )}
          </View>
           
          <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Contact Information</Text>
            </View>

                
            <View>
              <Text style={styles.infoText}>
                <Ionicons name='mail' size={16} color="white" />
                : {contactEmail || '(000) 000-0000'}
              </Text>
              <Text style={styles.infoText}>
                <Ionicons name='call' size={16} color="white" />
                : {contactPhone || 'testone@gmail.com'}
              </Text>
            </View>
                
          </View>


          <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Events Attended</Text>
            </View>

            {events.length === 0 ? (
              <Text style={styles.eventText}>No events attended yet.</Text>
            ) : (
              events.map((event, index) => (
                <View key={index} style={styles.eventItem}>
                  <Text style={styles.eventText}>{event}</Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.cardContainer}>
            {!file ? (
              <Button title="Upload Resume" onPress={pickResume} />
            ) : (
              <View style={{ width: '100%' }}>
                <Text
                  style={{
                    marginBottom: 10,
                    color: 'white',
                    fontSize: 12,
                    textAlign: 'center',
                  }}
                >
                  Uploaded: {file.name}
                </Text>

          
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around', 
                    marginBottom: 30,
                  }}
                >
                  <Button title="Replace Resume" onPress={pickResume} />
                  <Button
                    title="Delete Resume"
                    onPress={() => setFile(null)}
                    color="red"
                  />
                </View>

                <WebView
                  originWhitelist={['*']}
                  allowFileAccess
                  allowingReadAccessToURL={file.uri}
                  source={{ uri: file.uri }}
                  style={{ width: '100%', height: 500 }}
                />
              </View>
            )}
         </View>

          
      
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>

  )
}

export default profile

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#222222',
  },

  scrollContainer: {
    alignItems: 'center',
    flexGrow: 1, 
  },

  imageWrapper: {
    width: 175,
    height: 175,
    borderRadius:100,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: -90,
  },

  imageClip: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },

  userImage: {
    width: '100%',
    height: '100%',
  },

  settingButton: {
    position: 'absolute',
    top: 40,
    right: 5,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  cameraButton: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 24,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  fullName: {
    fontSize: 32,
    fontWeight: 700,
    color: 'white'
  },

  location: {
    fontSize: 20,
    color: '#AAA'
  },

  tagSection: {
    width: '95%',
    marginTop: 15,
  },

  tagInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap', 
    justifyContent: 'center',
    gap: 5, 
  },

  tagInput: {
    flex: 1,
    minWidth: 150,
    backgroundColor: '#444',
    color: 'white',
    padding: 10,
    borderRadius: 8,
  },

  addTagButton: {
    backgroundColor: '#666',
    padding: 10,
    borderRadius: 8,
    marginLeft: 'auto'
  },

  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 3,
  },

  tagBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#555',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 6,
  },

  tagText: {
    color: 'white',
    marginRight: 6,
    fontSize: 14,
  },

  cardContainer: {
    width: 350,
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 15,
    marginVertical: 15,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  cardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  aboutText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
  },

  infoText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 30,
  },

  eventText: {
    color: 'white',
    fontSize: 14,
  },  

  cardTextInput: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
    backgroundColor: '#444',
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top', 
    marginBottom: 15
  },

  eventItem: {
    backgroundColor: '#5555',
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
  },

  headerColorBar: {
    width: '100%',
    height: 175,
    backgroundColor: COLORS.primary,
  },

})