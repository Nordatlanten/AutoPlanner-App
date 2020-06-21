import 'react-native-gesture-handler'
import * as React from 'react'
import { StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import HomeScreen from './src/Home.js'
import ProfileScreen from './src/Profile.js'
import DepartureBoard from './src/DepartureBoard.js'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

function Setup() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Plan a trip" component={HomeScreen} />

    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        tabBarOptions={{
          activeTintColor: '#e91e63'
        }}
      >
        <Tab.Screen
          name="Home"
          component={Setup}
          options={{
            tabBarLabel: 'Hem',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            )
          }}
        />

        <Tab.Screen
          name="Avgångstavla"
          component={DepartureBoard}
          options={{
            tabBarLabel: 'Avgångstavla',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="table" color={color} size={size} />
            )
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profil',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account"
                color={color}
                size={size}
              />
            )
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#71c7ec',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
