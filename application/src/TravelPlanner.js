/* global fetch */

import React, { Component, useState, useEffect } from "react"
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  View,
} from "react-native"
import { Formik } from "formik"
import { Col, Row, Grid } from "react-native-easy-grid"

export default function TravelPlanner(props) {
  const [modalVisible, setModalVisible] = useState(false)
  const [destinations, setDestinations] = useState([])
  const [departures, setDepartures] = useState([])
  const [tripResult, setTripResult] = useState([])
  const [resultsReady, setResultsReady] = useState(false)
  const [showTripDetails, setShowTripDetails] = useState(false)
  const [clickedTrip, setClickedTrip] = useState([])

  const [token, setToken] = useState("")

  useEffect(() => {
    fetch("http://10.0.2.2:3000/vasttrafik/getToken", {
      method: "POST",
    })
      .then((response) => response.text())
      .then((result) => {
        console.log(result)
        setToken(result)
      })

      .catch(function (err) {
        console.log(err)
      })
  }, [])

  function getTravelTime(origin, dest) {
    let originTime = new Date(origin.date + "T" + origin.time + ":00")
    let destTime = new Date(dest.date + "T" + dest.time + ":00")
    var travelTime = (destTime.getTime() - originTime.getTime()) / 1000
    travelTime /= 60
    return Math.abs(Math.round(travelTime))
  }

  //{item, fieldSetter}
  // props : props.item, props.fieldsetter
  function Item({ item, fieldSetter }) {
    return (
      <Text
        onPress={() => {
          console.log(item)
          fieldSetter()
          setDepartures([])
          setDestinations([])
        }}
        style={{ backgroundColor: "#eee", marginVertical: 1 }}
      >
        {item.name}
      </Text>
    )
  }

  //api.vasttrafik.se/bin/rest.exe/v2/trip?originId=Kungsbacka+station%2C+Kungsbacka&destId=Swedenborgsplatsen%2C+G%C3%B6teborg&numTrips=10&format=json

  return (
    <View style={styles.container}>


      <View >
        <Modal
          animationType="slide"
          transparent={true}
          visible={(modalVisible, resultsReady)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text
                style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}
              >
                Möjliga resalternativ
            </Text>

              <Grid style={styles.tableBorder}>
                <Row
                  style={{
                    backgroundColor: "#4c86aa",
                    padding: 10,
                    maxHeight: "20%",
                  }}
                >
                  <Col>
                    <Text style={{ color: "#fff" }}>Antal byten:</Text>
                  </Col>

                  <Col>
                    <Text style={{ color: "#fff" }}>Restid:</Text>
                  </Col>
                  <Col>
                    <Text style={{ color: "#fff" }}>Avgång:</Text>
                  </Col>
                  <Col>
                    <Text style={{ color: "#fff" }}>Ankomst:</Text>
                  </Col>
                </Row>

                {tripResult.map((trip, i) => {
                  return (
                    <Col
                      key={i}
                      style={styles.tableContainer}
                      onPress={() => {
                        setClickedTrip(trip.Leg)
                        if (showTripDetails === false) {
                          setShowTripDetails(true)
                        }
                      }}
                    >
                      <Row style={styles.tableItems}>
                        <Text>{trip.Leg.length} </Text>
                        <Text>
                          {getTravelTime(
                            trip.Leg[0].Origin,
                            trip.Leg[trip.Leg.length - 1].Destination
                          ) + "min"}
                        </Text>
                        <Text>{trip.Leg[0].Origin.time}</Text>
                        <Text>
                          {trip.Leg[trip.Leg.length - 1].Destination.time}
                        </Text>
                      </Row>
                    </Col>
                  )
                })}
              </Grid>

              {showTripDetails && (
                <Grid style={styles.tableBorder}>
                  <Row
                    style={{
                      backgroundColor: "#4c86aa",
                      padding: 10,
                      maxHeight: "18%",
                    }}
                  >
                    <Col>
                      <Text style={{ color: "#fff" }}>Resdel: </Text>
                    </Col>

                    <Col>
                      <Text style={{ color: "#fff" }}>Färdsätt: </Text>
                    </Col>
                    <Col>
                      <Text style={{ color: "#fff" }}>Avgång:</Text>
                    </Col>
                    <Col>
                      <Text style={{ color: "#fff" }}>Ankomst:</Text>
                    </Col>
                  </Row>

                  {clickedTrip &&
                    clickedTrip.map((trip, i) => {
                      return (
                        <Col key={i} style={styles.tableContainer}>
                          <Row style={styles.tableItems}>
                            <Text>{i + 1} </Text>
                            <Text>{trip.name}</Text>
                            <Text>{trip.Origin.time}</Text>
                            <Text>{trip.Destination.time}</Text>
                          </Row>
                        </Col>
                      )
                    })}
                </Grid>
              )}

              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={() => {
                  setModalVisible(!modalVisible)
                  setResultsReady(!resultsReady)
                }}
              >
                <Text style={styles.textStyle}>Stäng</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        <Formik
          initialValues={{ departure: "", destination: "" }}
          onSubmit={(values) => {
            console.log(values)
            setClickedTrip([])
            setShowTripDetails(false)

            let trip = {
              departure: encodeURIComponent(
                encodeURIComponent(values.departure)
                  .replace("(", "%28")
                  .replace(")", "%29")
              ),
              destination: encodeURIComponent(
                encodeURIComponent(values.destination)
                  .replace("(", "%28")
                  .replace(")", "%29")
              ),
            }

            console.log(
              "https://api.vasttrafik.se/bin/rest.exe/v2/trip?originId=" +
              trip.departure +
              "&destId=" +
              trip.destination +
              "&numTrips=10&format=json"
            )

            if (values.departure != "" && values.destination != "") {
              fetch(
                "https://api.vasttrafik.se/bin/rest.exe/v2/trip?originId=" +
                trip.departure +
                "&destId=" +
                trip.destination +
                "&numTrips=10&format=json",

                {
                  method: "GET",

                  headers: {
                    Authorization: "Bearer " + token,
                  },
                }
              )
                .then((response) => response.json())
                .then((res) => {
                  let tripList = res.TripList.Trip.map((trip) => {
                    // console.log(trip)
                    let fixedTrip = trip
                    if (!Array.isArray(trip.Leg)) {
                      fixedTrip.Leg = [trip.Leg]
                      return fixedTrip
                    } else {
                      return fixedTrip
                    }
                  })
                  console.log(tripList.length)
                  setTripResult(tripList)
                  console.log(tripResult)

                  setResultsReady(true)
                  setModalVisible(true)
                })
            }
          }}
        >
          {({ handleChange, handleSubmit, setFieldValue, values }) => (
            <View style={styles.border}>
              <View>
                <View>
                  <TextInput
                    style={styles.inputField}
                    onChangeText={(e) => {
                      setDepartures([])
                      fetch(
                        "https://api.vasttrafik.se/bin/rest.exe/v2/location.name?input=" +
                        values.departure +
                        "&format=json",
                        {
                          method: "GET",
                          headers: {
                            Authorization: "Bearer " + token,
                          },
                        }
                      )
                        .then((response) => response.json())
                        .then((res) => {
                          setDepartures(res.LocationList.StopLocation)
                          for (let i = 0; i < res.length; i++) {
                            console.log(res[i])
                          }
                        })
                        .catch((err) => console.error("error:", err))

                      handleChange("departure")(e)
                    }}
                    value={values.departure}
                    placeholder="Från:"
                  />
                </View>
              </View>

              <FlatList
                style={{ maxHeight: "30%" }}
                data={departures}
                renderItem={({ item }) => (
                  <Item
                    fieldSetter={() => {
                      setFieldValue("departure", item.name)
                    }}
                    item={item}
                  />
                )}
                keyExtractor={(item) => item.id}
              />

              <View style={styles.border}>
                <TextInput
                  style={styles.inputField}
                  onChangeText={(e) => {
                    setDestinations([])

                    fetch(
                      "https://api.vasttrafik.se/bin/rest.exe/v2/location.name?input=" +
                      values.destination +
                      "&format=json",
                      {
                        method: "GET",
                        headers: {
                          Authorization: "Bearer " + token,
                        },
                      }
                    )
                      .then((response) => response.json())
                      .then((res) => {
                        setDestinations(res.LocationList.StopLocation)
                        for (let i = 0; i < res.length; i++) {
                          console.log(res[i])
                        }
                      })
                      .catch((err) => console.error("error:", err))

                    handleChange("destination")(e)
                  }}
                  value={values.destination}
                  placeholder="Till:"
                />
              </View>

              <FlatList
                style={{ maxHeight: "30%" }}
                data={destinations}
                renderItem={({ item }) => (
                  <Item
                    fieldSetter={() => {
                      setFieldValue("destination", item.name)
                    }}
                    item={item}
                  />
                )}
                keyExtractor={(item) => item.id}
              />

              <View style={styles.submitButton}>
                <TouchableOpacity onPress={handleSubmit}>
                  <Text style={{ color: "#FFF", fontSize: 15 }}>Sök resa</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingVertical: 50,
    paddingHorizontal: 30,
    borderRadius: 20,
    width: 325,
  },
  inputField: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
  },

  submitButton: {
    backgroundColor: "#2991bb",
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: "center",
  },
  item: {
    backgroundColor: "#f9c2ff",
  },
  title: {
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#71c7ec",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    textAlign: "center",
  },

  tableContainer: {
    display: "flex",
    backgroundColor: "#fff",
  },
  tableItems: {
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 25

  },
  tableBorder: {
    borderRadius: 20,
    width: 275,
    marginBottom: 20,
  },
})
