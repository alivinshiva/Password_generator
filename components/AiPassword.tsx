import { Keyboard, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik'

const passwordSchema = Yup.object().shape({
  PasswordLength: Yup.number()
    .min(4, 'At least 4 characters')
    .max(16, 'Max 16 characters allowed')
    .required('Length is required')
})

export default function Password() {

  const [password, setPassword] = useState('')
  const [isPasswordGenerated, setIsPasswordGenerated] = useState(false)
  const [lowerCase, setLowercase] = useState(true)
  const [upperCase, setUppercase] = useState(false)
  const [number, setNumber] = useState(false)
  const [symbols, setSymbols] = useState(false)

  // Ai password
  const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");

  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-001",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

  const createAIPassword = async (passwordLength: number) => {
    try {
      const chatSession = model.startChat({
        generationConfig,
        safetySettings,
        history: [
          {
            role: "user",
            parts: [
              {
                text: `Generate a random string that is exactly ${passwordLength} characters long. The string must include numbers, symbols, uppercase letters, and lowercase letters, and should not contain any spaces. i only need string in reply nothing else, no sentences, no spaces`,
              },
            ],
          },
        ],
      });

      const result = await chatSession.sendMessage("Generate password");
      const generatedPassword = result.response.text();
      return generatedPassword;
    } catch (error) {
      console.error("Error generating password:", error);
      return '';
    }
  };

  const generatedPasswordString = async (passwordLength: number) => {
    let generatedPassword = await createAIPassword(passwordLength);
    if (generatedPassword.length !== passwordLength) {
      generatedPassword = generatedPassword.substring(0, passwordLength);
    }

    setPassword(generatedPassword);
    setIsPasswordGenerated(true);
  }

  const resetPassword = () => {
    setPassword('');
    setIsPasswordGenerated(false);
    setLowercase(true);
    setUppercase(false);
    setSymbols(false);
    setNumber(false);
  }

  return (
    <ScrollView keyboardShouldPersistTaps='handled'>
      <SafeAreaView style={styles.appContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>
            AI Password Generator
          </Text>
          <Formik
            initialValues={{ PasswordLength: '' }}
            validationSchema={passwordSchema}
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
            }) => (
              <>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputColumn}>
                    <Text style={styles.heading}>Password Length</Text>
                    {touched.PasswordLength && errors.PasswordLength && (
                      <Text style={styles.errorText} numberOfLines={1}>{errors.PasswordLength}</Text>
                    )}
                  </View>
                  <TextInput
                    style={styles.inputStyle}
                    value={values.PasswordLength}
                    onChangeText={handleChange('PasswordLength')}
                    placeholder='Ex. 8'
                    keyboardType='numeric'
                    placeholderTextColor={'#000001'}
                  />
                </View>



                <View style={styles.formActions}>
                  <TouchableOpacity
                    disabled={!isValid}
                    style={styles.primaryBtn}
                    onPress={() => {
                      handleSubmit();
                      Keyboard.dismiss();
                    }}
                  >
                    <Text style={styles.primaryBtnTxt}>
                      Generate Password
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => {
                      handleReset();
                      resetPassword()
                    }}
                  >
                    <Text style={styles.secondaryBtnTxt}>
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
            <Text style={styles.subTitle}>AI Result:</Text>
            <Text style={styles.description}>Long press to copy</Text>
            <Text selectable={true} style={styles.generatedPassword}>{password}</Text>
          </View>
        ) : <View style={[styles.card, styles.cardElevated]}>
          <Text style={styles.subTitle}>Result not generated:</Text>
          {/* <Text style={styles.description}>Error try again!!!</Text> */}
          <Text selectable={true} style={styles.generatedPassword}>{password}</Text>
        </View>}
      </SafeAreaView>
    </ScrollView >
  )
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#96939B',
    height: 900,
  },
  formContainer: {
    margin: 8,
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  suggestions: {
    marginBottom: 10,
    marginStart: 10,
  },
  subTitle: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 2,
    color: '#000001'
  },
  description: {
    color: '#758283',
    marginBottom: 8,
  },
  heading: {
    fontSize: 17,
    color: 'black'
  },
  inputWrapper: {
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: "#ffeef2",
    padding: 8,
    borderRadius: 20
  },
  inputColumn: {
    flexDirection: 'column',
    color: '#ffeef2'
  },
  inputStyle: {
    padding: 8,
    width: '30%',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#000001',
    color: '#000001'
  },
  errorText: {
    flex: 1,
    width: 210,
    fontSize: 12,
    color: 'red',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  primaryBtn: {
    width: 120,
    padding: 10,
    borderRadius: 30,
    marginHorizontal: 8,
    backgroundColor: '#0e0004',
  },
  primaryBtnTxt: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
  secondaryBtn: {
    width: 120,
    padding: 10,
    borderRadius: 30,
    marginHorizontal: 8,
    backgroundColor: '#31081f',
    alignItems: 'center',
    justifyContent: 'center'
  },
  secondaryBtnTxt: {
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
  },
  card: {
    padding: 12,
    borderRadius: 6,
    marginHorizontal: 12,
  },
  cardElevated: {
    backgroundColor: '#bfc0c0',
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


