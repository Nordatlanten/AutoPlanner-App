/* global fetch */

import React, { useEffect, useState } from "react"
import {
  Alert,
  Button,
  Picker,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import * as Permissions from "expo-permissions"
import * as Location from "expo-location"

export default function CalendarScreen({ navigation }) {
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [stops, setStops] = useState(null)
  const [selectedStop, setSelectedStop] = useState({})
  const [currentStopLines, setCurrentStopLines] = useState(undefined)
  const [selectedValue, setSelectedValue] = useState('')
  const [listReady, setListReady] = useState(false)

  useEffect(() => {
    ; (async () => {
      let { status } = await Location.requestPermissionsAsync()
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied")
      }

      let location = await Location.getCurrentPositionAsync({})
      setLocation(location)
    })()
  })

  useEffect(() => {
    fetch("http://10.0.2.2:3000/vasttrafik/getNearbyStops", {
      body: JSON.stringify({ lat: "57.7066", lng: "11.9672" }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
      .then((result) => result.json())
      .then((data) => {
        console.log(data)
        setStops(data)
        setSelectedStop(data[0])
        setListReady(true)
        console.log(selectedStop.name)
      })
      .catch(function (err) {
        console.log(err)
      })
  }, [])

  let text = "Waiting.."
  if (errorMsg) {
    text = errorMsg
  } else if (location) {
    text = JSON.stringify(location)
  }


  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View>
        <Text>Avgångstavla</Text>

        {listReady && (
          <Picker
            selectedValue={selectedStop.id}
            style={{ height: 50, width: 150 }}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedValue(itemValue)
            }}
          >
            {stops.map((stop, i) => {
              <Picker.Item key={i} label={stop.name} value={stop.id} />
            })}
          </Picker>
        )}


      </View>
      <Text>{text}</Text>
    </View>
  )
}

