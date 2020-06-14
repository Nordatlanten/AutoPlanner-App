import * as React from 'react'
import { Button, StyleSheet, TextInput, Text, View } from 'react-native'
import LoginForm from './forms/LoginForm.js'

export default function LoginScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <LoginForm />
    </View>
  )
}
