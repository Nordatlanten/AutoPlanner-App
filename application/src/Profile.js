/* global fetch */
import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'
// import tokens from '../tokens'

const loginValidation = Yup.object().shape({
  email: Yup.string()
    .label('Epost')
    .email('Fyll i en giltig epostadress')
    .required('Var vänlig fyll i din epostadress'),
  password: Yup.string()
    .label('Lösenord')
    .required('Var vänlig fyll i ditt lösenord')

})

const registerValidation = Yup.object().shape({
  email: Yup.string()
    .label('Epost')
    .email('Fyll i en giltig epostadress')
    .required('Var vänlig fyll i din epostadress'),
  password: Yup.string()
    .label('Lösenord')
    .required('Var vänlig fyll i ditt lösenord')
    .min(6, 'Lösenord måste vara minst 6 tecken'),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Upprepat lösenord måste vara samma som lösenord')
    .required('Var vänlig upprepa lösenordet')
})


export default function ProfileScreen({ navigation }) {

  const [page, setPage] = useState('Login')
  const [token, setToken] = useState(null)
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const [fetchedLocation, setFetchedLocations] = useState([])


  async function login(formData) {

    try {
      let response = await fetch('http://10.0.2.2:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      let result = await response.json()
      setToken(result.token)
      setPage('Profile')
      console.log(token)
    } catch (error) {
      console.log(error)
    }
  }

  async function register(formData) {
    try {
      let response = await fetch('http://10.0.2.2:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      let result = await response.json()
      console.log(result)
      setRegisterSuccess(true)
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#71c7ec' }}>


      <View>

        {page == 'Login' && (<View>

          <View style={styles.container}>
            <Text style={{ color: '#333', textAlign: 'center', fontSize: 24, marginBottom: 10 }}>Logga in</Text>
            <Formik
              initialValues={{ email: '', password: '' }}
              onSubmit={(values, { validate }) => {
                validate(values)
                console.log(values)
                login(values)
              }}
              validationSchema={loginValidation}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                <View style={styles.border}>
                  <View>
                    <TextInput
                      style={styles.inputField}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      placeholder="E-post"
                    />
                  </View>
                  <Text style={{ color: 'red' }}>{errors.email}</Text>

                  <View style={styles.border}>
                    <TextInput
                      style={styles.inputField}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                      placeholder="Lösenord"
                      secureTextEntry
                    />
                  </View>
                  <Text style={{ color: 'red' }}>{errors.password}</Text>

                  <View>
                    <Text style={{ color: '#888', textAlign: 'left', fontSize: 16, marginBottom: 10 }}>Glömt ditt lösenord?</Text>
                  </View>

                  <View style={styles.submitButton}>
                    <TouchableOpacity onPress={handleSubmit}>
                      <Text style={{ color: '#FFF', fontSize: 15 }}>Logga in</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                    <Text style={{ color: '#888', textAlign: 'left', fontSize: 15, marginTop: 10 }}>Har du inget konto?</Text>
                    <Text style={{ color: 'rgb(43, 113, 141)', textAlign: 'left', fontSize: 15, marginTop: 10 }} onPress={() => {
                      setPage('Register')
                    }}>Skapa konto</Text>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>)}

        {page == 'Register' && (<View>
          <View style={styles.container}>
            <Text style={{ color: '#333', textAlign: 'center', fontSize: 24, marginBottom: 10 }}>Skapa konto</Text>
            <Formik
              initialValues={{ email: '', password: '' }}
              onSubmit={(values, { validate }) => {
                validate(values)
                console.log(values)
                register(values)
              }}
              validationSchema={registerValidation}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                <View style={styles.border}>
                  <View>
                    <TextInput
                      style={styles.inputField}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      placeholder="E-post"
                    />
                  </View>
                  <Text style={{ color: 'red' }}>{errors.email}</Text>


                  <View style={styles.border}>
                    <TextInput
                      style={styles.inputField}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                      placeholder="Lösenord"
                      secureTextEntry
                    />
                  </View>
                  <Text style={{ color: 'red' }}>{errors.password}</Text>

                  <View style={styles.border}>
                    <TextInput
                      style={styles.inputField}
                      onChangeText={handleChange('repeatPassword')}
                      onBlur={handleBlur('repeatPassword')}
                      value={values.repeatPassword}
                      placeholder="Upprepa lösenord"
                      secureTextEntry
                    />
                  </View>
                  <Text style={{ color: 'red' }}>{errors.repeatPassword}</Text>

                  <View style={styles.submitButton}>
                    <TouchableOpacity onPress={handleSubmit}>
                      <Text style={{ color: '#FFF', fontSize: 15 }}>Registrera</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
            <View>

              <Text style={{ color: '#888', textAlign: 'center', fontSize: 15, marginTop: 15 }} onPress={() => {
                setPage('Login')
              }}>Jag har redan ett konto</Text>
            </View>

            {registerSuccess && (
              <View style={{ padding: 10, marginTop: 10, borderWidth: 1, borderColor: "rgba(43, 255, 0, 0.24)", backgroundColor: "rgba(177, 231, 161, 0.308)" }}>
                <Text style={{ color: "#488e40" }}>Registrering lyckades! Kolla din e-post för ett bekräftelsemail</Text>
              </View>
            )}

          </View>
        </View>)}



        {page == 'Profile' && (
          <View style={styles.container}>
            <Text style={{ color: '#333', textAlign: 'center', fontSize: 24, marginBottom: 10 }}>Hej user!</Text>
            <Formik
              initialValues={{ address: '' }}
              onSubmit={(values) => {
                console.log(values)

              }}
            >
              {({ handleChange, handleBlur, values }) => (
                <View style={styles.border}>
                  <View>
                    <TextInput
                      style={styles.inputField}
                      onChangeText={(e) => {

                        if (values.address == '') {
                          setFetchedLocations([])
                        }

                        let url =
                          `https://api.mapbox.com/geocoding/v5/mapbox.places/` +
                          `${values.address}.json` +
                          `?access_token=${tokens.mapboxToken}` +
                          `&autocomplete=true` +
                          `&country=se` +
                          `&types=address` +
                          `&limit=10`

                        fetch(url, {
                          method: 'GET'
                        }).then(res => setFetchedLocations(res.features)).catch(err => console.log(err))

                        handleChange('address')(e)
                      }}
                      onBlur={handleBlur('address')}
                      value={values.address}
                      placeholder="Sök adress"
                    />
                  </View>
                </View>
              )}
            </Formik>

            <View>
              <Text style={{ color: '#333', textAlign: 'center', fontSize: 24, marginBottom: 10 }}>Mina sparade locations</Text>
            </View>

            <View>
              <Text style={{ color: '#333', textAlign: 'center', fontSize: 24, marginBottom: 10 }}>Ändra lösenord</Text>
              <Formik
                initialValues={{ currentPass: '', newPass: '', repeatPass: '' }}
                onSubmit={(values, { validate }) => {
                  validate(values)
                  console.log(values)

                }}
                validateOnChange={false}
                validateOnBlur={false}
              >
                {({ handleChange, handleBlur, handleSubmit, values }) => (
                  <View style={styles.border}>
                    <View>
                      <TextInput
                        style={styles.inputField}
                        onChangeText={handleChange('currentPass')}
                        onBlur={handleBlur('currentPass')}
                        value={values.currentPass}
                        placeholder="Nuvarande lösenord"
                        secureTextEntry
                      />
                    </View>
                    <View>
                      <TextInput
                        style={styles.inputField}
                        onChangeText={handleChange('newPass')}
                        onBlur={handleBlur('newPass')}
                        value={values.newPass}
                        placeholder="Nytt lösenord"
                        secureTextEntry
                      />
                    </View>
                    <View style={{ marginBottom: 30 }}>
                      <TextInput
                        style={styles.inputField}
                        onChangeText={handleChange('repeatPass')}
                        onBlur={handleBlur('repeatPass')}
                        value={values.repeatPass}
                        placeholder="Upprepa lösenord"
                        secureTextEntry
                      />
                    </View>
                    <View style={styles.submitButton}>
                      <TouchableOpacity onPress={handleSubmit}>
                        <Text style={{ color: '#FFF', fontSize: 15 }}>Spara</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </Formik>
            </View>

            <View style={{
              backgroundColor: '#ccc', paddingHorizontal: 15,
              paddingVertical: 10,
              alignItems: 'center', marginTop: 30
            }} >
              <TouchableOpacity onPress={() => {
                setToken(null)
                setPage('Login')
              }}>
                <Text style={{ color: '#FFF', fontSize: 15 }}>Logga ut</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View >


  )
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: 50,
    paddingHorizontal: 30,
    borderRadius: 20,
    width: 325
  },
  inputField: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15
  },

  // border: {
  //   borderColor: '#000',
  //   borderWidth: 1
  // },

  submitButton: {
    color: '#fff',
    backgroundColor: '#2991bb',
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center'
  }
})
