import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const bookmarks = () => {

  const dummyData = [
    {id: '1', name: 'Event 1', creator:'John Smith'},
    {id: '2', name: 'Event 2', creator:'John Doe'},
    {id: '3', name: 'Event 3', creator:'Sarah Doe'},
    {id: '4', name: 'Event 4', creator:'John Doe'},
    {id: '5', name: 'Event 5', creator:'John Doe'},
    {id: '6', name: 'Event 6', creator:'John Doe'},
  ];

  const [showEvent, changeShowEvent] = useState(false);

  const btnEvent = () => {
    changeShowEvent(!showEvent);
  };
  

  return (
    <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
      <Text>Your bookmarks will appear here! 🎉</Text>
    </View>
  )
}

export default bookmarks

const styles = StyleSheet.create({})