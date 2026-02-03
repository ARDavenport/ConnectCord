import { View, Text, TextInput } from 'react-native'
import React, {useState} from 'react';

const search = () => {
  const [text, setText] = useState('');
  return (
    <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px'
        }}>
      <Text>Search for events, users, and companies! 🎉</Text>
      <TextInput
        placeholder="  Search 🔍 "
        onChangeText={newText => setText(newText)}
        defaultValue={text}
        style={{
          height: 40,
          padding: 5,
          marginHorizontal: 8,
          borderWidth: 1,
        }}
      />
    </View>
  )
}

export default search