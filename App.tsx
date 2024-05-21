import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'

import * as Yup from 'yup'
import { Formik } from 'formik'
import BouncyCheckbox from 'react-native-bouncy-checkbox'

const passwordSchema = Yup.object().shape({
  PasswordLength: Yup.number()
    .min(4, 'atleast 4 letter')
    .max(16, 'mas 16 letter allowed')
    .required('Length is required')
})

export default function Password() {

  const [password, setPassword] = useState('')
  const [isPasswordGenerated, setIsPasswordGenerated] = useState(false)
  const [lowerCase, setLowercase] = useState(true)
  const [upperCase, setUppercase] = useState(false)
  const [number, setNumber] = useState(false)
  const [symbols, setSymbols] = useState(false)

  const generatedPasswordString = (passwordLength: number) => {
    // 

    // Initialize an empty string for the character list
    let characterList = ''

    // Define the possible characters for each category
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz'
    const numberChars = '0123456789'
    const spcialChar = '!@#$%^&*()_+'

    // Add characters to the list based on the selected criteria
    if (upperCase) {
      characterList += upperCaseChars
    }

    if (lowerCase) {
      characterList += lowerCaseChars
    }
    if (number) {
      characterList += numberChars
    }
    if (symbols) {
      characterList += spcialChar
    }

    // Generate the password using the createPassword function
    const passwordResult = createPassword(characterList, passwordLength)

    // Update the state with the generated password
    setPassword(passwordResult)
    setIsPasswordGenerated(true)
  }


  const createPassword = (characters: string, passwordLength: number) => {
    //
    let result = ''
    for (let i = 0; i < passwordLength; i++) {
      const characterIndex = Math.round(Math.random() * characters.length)
      result += characters.charAt(characterIndex)
    }
    return result
  }
  const resetPassword = () => {
    // reset password by changing the value to default state.
    setPassword('')
    setIsPasswordGenerated(false)
    setLowercase(true)
    setUppercase(false)
    setSymbols(false)
    setNumber(false)
  }



  return (
    <ScrollView keyboardShouldPersistTaps='handled'>
      <SafeAreaView style={styles.appContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>
            Password Generator
          </Text>
          <Formik

            initialValues={{ PasswordLength: '' }}
            validationSchema={passwordSchema}
            // typecasting to number
            onSubmit={values => {
              generatedPasswordString(Number(values.PasswordLength))
            }}
          >

            {({

              values,
              errors,
              touched,
              isValid,
              handleChange,
              handleSubmit,
              handleReset
              /* and other goodies */

            }) => (

              <>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputColumn}>
                    <Text style={styles.heading}>Password Length</Text>
                    {touched.PasswordLength && errors.PasswordLength && (
                      <Text style={styles.errorText}>{errors.PasswordLength}</Text>
                    )}



                  </View>
                  <TextInput style={styles.inputStyle}
                    value={values.PasswordLength}     // assining the input value to Password length
                    onChangeText={handleChange('PasswordLength')}     // if user change the text it should be change in password lemgth
                    placeholder='Ex. 8'
                    keyboardType='numeric'
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.heading}>Include lowrecase</Text>
                  <View>
                    <BouncyCheckbox
                      isChecked={lowerCase}
                      onPress={() => setLowercase(!lowerCase)}
                      fillColor='red'
                    />
                  </View>

                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.heading}>Include uppercase</Text>
                  <View>
                    <BouncyCheckbox
                      isChecked={upperCase}
                      onPress={() => setUppercase(!upperCase)}
                      fillColor='red'
                    />
                  </View>
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.heading}>Include numbers</Text>
                  <View>
                    <BouncyCheckbox
                      isChecked={number}
                      onPress={() => setNumber(!number)}
                      fillColor='red'
                    />
                  </View>
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.heading}>Include symbols</Text>
                  <View>
                    <BouncyCheckbox
                      isChecked={symbols}
                      onPress={() => setSymbols(!symbols)}
                      fillColor='red'
                    />
                  </View>
                </View>

                <View style={styles.formActions}>
                  <TouchableOpacity
                    disabled={!isValid}
                    style={styles.primaryBtn}
                    onPress={() => handleSubmit()}
                  >
                    <Text style={styles.primaryBtnTxt}>
                      Generate Password
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.secondaryBtn}
                    onPress={() => {
                      handleReset();
                      resetPassword()
                    }
                    }
                  ><Text style={styles.secondaryBtnTxt}>
                      Reset
                    </Text>
                  </TouchableOpacity>
                </View>
              </>

            )}

          </Formik>
        </View>

        {isPasswordGenerated ? (
          <View style={[styles.card, styles.cardElevated]}>
            <Text style={styles.subTitle}>Result:</Text>
            <Text style={styles.description}>Long press to copy</Text>
            <Text selectable={true} style={styles.generatedPassword}>{password}</Text>
          </View>
        ) : (<View style={[styles.card, styles.cardElevated]}>

          <Text style={styles.generatedPassword} >6</Text>
        </View>)}

      </SafeAreaView>

    </ScrollView >
  )
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  formContainer: {
    margin: 8,
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 15,
  },
  subTitle: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    color: '#758283',
    marginBottom: 8,
  },
  heading: {
    fontSize: 15,
  },
  inputWrapper: {
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  inputColumn: {
    flexDirection: 'column',
  },
  inputStyle: {
    padding: 8,
    width: '30%',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#16213e',
  },
  errorText: {
    fontSize: 12,
    color: '#ff0d10',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  primaryBtn: {
    width: 120,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: '#5DA3FA',
  },
  primaryBtnTxt: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
  secondaryBtn: {
    width: 120,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: '#CAD5E2',
  },
  secondaryBtnTxt: {
    textAlign: 'center',
  },
  card: {
    padding: 12,
    borderRadius: 6,
    marginHorizontal: 12,
  },
  cardElevated: {
    backgroundColor: '#ffffff',
    elevation: 1,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: '#333',
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  generatedPassword: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 12,
    color: '#000'
  },
});