import * as React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'

import TravelPlanner from './TravelPlanner'

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={{ color: '#333', textAlign: 'center', fontSize: 24, marginBottom: 10 }}>Reseplaneraren</Text>
      <TravelPlanner />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          width: '65%'
        }}
      >

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
