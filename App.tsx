import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import * as Yup from 'yup'

const passwordSchema = Yup.object().shape({
  PasswordLength: Yup.number()
  .min(4,'atleast 4 letter')
  .max(16,'mas 16 letter allowed')
  .required('Length is required')
})

export default function Password() {
  return (
    <View>
      <Text>Password Generator </Text>
    </View>
  )
}

const styles = StyleSheet.create({})