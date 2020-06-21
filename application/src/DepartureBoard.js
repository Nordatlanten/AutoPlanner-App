/* global fetch */

import React, { useEffect, useState } from "react"
import { Picker, StyleSheet, ScrollView, Text, View } from "react-native"
import * as Permissions from "expo-permissions"
import * as Location from "expo-location"
import _ from "lodash"
import Object from "lodash/fp/object"

export default function CalendarScreen({ navigation }) {
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [stops, setStops] = useState(null)

  const [selectedValue, setSelectedValue] = useState({})

  const [currentStopLines, setCurrentStopLines] = useState(undefined)

  useEffect(() => {
    ;(async () => {
      let { status } = await Location.requestPermissionsAsync()
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied")
      }
      let locationCoords = await Location.getCurrentPositionAsync({})
      setLocation(locationCoords)
      let stopsResponse
      try {
        stopsResponse = await fetch(
          "http://10.0.2.2:3000/vasttrafik/getNearbyStops",
          {
            body: JSON.stringify({
              lat: locationCoords.coords.latitude,
              lng: locationCoords.coords.longitude,
            }),
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          }
        )
      } catch (error) {
        console.log(error)
      }
      let stopsResult = await stopsResponse.json()
      setStops(stopsResult)
      setSelectedValue(stopsResult[0].id)
      let depResponse
      try {
        depResponse = await fetch(
          "http://10.0.2.2:3000/vasttrafik/getDepartures",
          {
            body: JSON.stringify({ id: selectedValue.id }),
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
            method: "POST",
          }
        )
        let depResult = await depResponse.json()
        let stops = depResult
        stops = stops.map((stop) => {
          stop.uniqueName = stop.name + " " + stop.direction + " " + stop.track
          return stop
        })
        stops = _.groupBy(stops, function (stop) {
          return stop.uniqueName
        })
        stops = Object.keys(stops).map((stop) => {
          let temp = {}
          temp.departures = stops[stop]
          temp.sname = stops[stop][0].sname
          temp.bgColor = stops[stop][0].bgColor
          temp.fgColor = stops[stop][0].fgColor
          temp.track = stops[stop][0].track
          temp.type = stops[stop][0].type
          temp.direction = stops[stop][0].direction
          temp.unique = stops[stop][0].uniqueName
          return temp
        })
        setCurrentStopLines(stops)
        console.log(currentStopLines)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  function getDepartures(value) {
    fetch("http://10.0.2.2:3000/vasttrafik/getDepartures", {
      body: JSON.stringify({ id: value }),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      method: "POST",
    })
      .then((result) => result.json())
      .then((data) => {
        let stops = data
        stops = stops.map((stop) => {
          stop.uniqueName = stop.name + " " + stop.direction + " " + stop.track
          return stop
        })
        stops = _.groupBy(stops, function (stop) {
          return stop.uniqueName
        })

        stops = Object.keys(stops).map((stop) => {
          let temp = {}
          temp.departures = stops[stop]
          temp.sname = stops[stop][0].sname
          temp.bgColor = stops[stop][0].bgColor
          temp.fgColor = stops[stop][0].fgColor
          temp.track = stops[stop][0].track
          temp.type = stops[stop][0].type
          temp.direction = stops[stop][0].direction
          temp.unique = stops[stop][0].uniqueName

          return temp
        })
        setCurrentStopLines(stops)
      })
      .catch(function (err) {
        console.log(err)
      })
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#333",
      }}
    >
      <View>
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontSize: 24,
            marginBottom: 10,
          }}
        >
          Avgångstavla
        </Text>

        {currentStopLines && (
          <Picker
            selectedValue={selectedValue}
            style={{
              height: 50,
              width: 375,
              color: "white",
              backgroundColor: "#666",
            }}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedValue(itemValue)

              console.log(itemValue)
              getDepartures(itemValue)
            }}
          >
            {stops.map((stop, i) => {
              return <Picker.Item key={i} label={stop.name} value={stop.id} />
            })}
          </Picker>
        )}

        {currentStopLines && (
          <ScrollView style={{ maxHeight: "80%", alignContent: "center" }}>
            {currentStopLines.map((line, i) => {
              return (
                <View
                  key={i}
                  style={{
                    backgroundColor: i % 2 === 0 ? "#555" : "#444",
                    paddingVertical: 6,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        backgroundColor: line.fgColor,
                        color: line.bgColor,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                      }}
                    >
                      {line.sname}
                    </Text>
                    <Text style={{ color: "white", marginLeft: 7 }}>
                      mot {line.direction}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      marginVertical: 4,
                    }}
                  >
                    {line.departures.map((dep, i) => {
                      return (
                        <Text
                          style={{ color: "#ccc", marginLeft: i > 0 ? 7 : 0 }}
                          key={i}
                        >
                          {dep.time}
                        </Text>
                      )
                    })}
                  </View>
                </View>
              )
            })}
          </ScrollView>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  lineInfo: {
    backgroundColor: "#ccc",
    overflow: "visible",
  },
  line: {
    textAlign: "left",
    margin: "10px",
  },
  bussName: {
    paddingHorizontal: "2px",
    paddingVertical: "5px",
    borderRadius: 3,
    marginRight: "6px",
  },
})
