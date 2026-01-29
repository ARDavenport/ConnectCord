import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

const homePage = () => {
  return (
    <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px'
        }}>
      <Image source={require('../../assets/images/app_logo.png')} 
        style={{width: 200, height: 200}}
      />
      <Text>Events will appear here! 🎉</Text>
    </View>
  )
}

export default homePage

const styles = StyleSheet.create({})