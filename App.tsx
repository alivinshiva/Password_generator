import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'

import * as Yup from 'yup'

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
      characterList += upperCase
    }

    if (lowerCase) {
      characterList += lowerCase
    }
    if (number) {
      characterList += number
    }
    if (symbols) {
      characterList += symbols
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
    <View>
      <Text>Password Generator </Text>
    </View>
  )
}

const styles = StyleSheet.create({})