import React, { useState } from 'react'
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { Formik } from 'formik'

export default function MyReactNativeForm(props) {
  // const [email, setEmail] = useState('')
  //   const [password, setPassword] = useState('')

  function login(formData) {
    fetch('http://10.0.2.2:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then((result) => result.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err))
  }

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={(values) => {
          console.log(values)
          login(values)
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
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

            <View style={styles.border}>
              <TextInput
                style={styles.inputField}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                placeholder="Lösenord"
              />
            </View>

            <View>
              <Text>Glömt ditt lösenord?</Text>
            </View>

            <View style={styles.submitButton}>
              <TouchableOpacity onPress={handleSubmit}>
                <Text style={{ color: '#FFF', fontSize: 15 }}>Logga in</Text>
              </TouchableOpacity>
            </View>

            <View>
              <Text>Har du inget konto?</Text>
              <Text>Skapa konto</Text>
            </View>
          </View>
        )}
      </Formik>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: 50,
    paddingHorizontal: 30,
    borderRadius: 20,
    width: '65%'
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
