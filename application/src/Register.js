import * as React from 'react'
import { Button, StyleSheet, TextInput, Text, View } from 'react-native'
import MyForm from './forms/RegisterForm.js'

export default function RegisterScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <MyForm />

      {/* <Button
        title="Go to login... again"
        onPress={() => navigation.push('Login')}
      />
      <Button title="Go back" onPress={() => navigation.goBack()} /> */}
      {/* <Button
        title="Go back to first screen in stack"
        onPress={() => navigation.popToTop()}
      /> */}
    </View>
  )
}
