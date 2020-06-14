import * as React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'

import TravelPlanner from './TravelPlanner'

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <TravelPlanner />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          width: '65%'
        }}
      >
        <Button title="Login" onPress={() => navigation.navigate('Login')} />
        <Button
          title="Register"
          onPress={() => navigation.navigate('Register')}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#71c7ec',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
