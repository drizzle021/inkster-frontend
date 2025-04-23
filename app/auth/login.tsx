import { View, Text, StyleSheet, TextInput, Button, Image, useColorScheme } from 'react-native';
import { Link, useRouter } from 'expo-router'
import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Login() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = useCallback(() => {
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);

    fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Login failed');
        return res.json();
      })
      .then(async (data) => {
        const token = data.access_token;
        if (token) {
          await AsyncStorage.setItem('token', token);
          console.log('Token stored!');
          router.push('/home');
        } else {
          alert('Login failed. No token received.');
        }
      })
      .catch((err) => {
        console.error('Login error:', err);
        alert('Login failed. Please check your credentials.');
      });
  }, [email, password]);
  
  const styles = colorScheme === 'dark' ? darkStyles : lightStyles;
  const iconSource = colorScheme === 'dark'
    ? require('../../assets/images/splash-icon-dark.png')
    : require('../../assets/images/splash-icon.png');

  return (
    <View style={styles.container}>
        <Image source={iconSource} style={styles.icon} />
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput 
                style={styles.input} 
                keyboardType='default' 
                autoCapitalize='none' 
                autoCorrect={false} 
                value={email}
                onChangeText={setEmail}
              />
          </View>
          <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput 
                style={styles.input} 
                secureTextEntry 
                autoCapitalize='none' 
                autoCorrect={false} 
                value={password}
                onChangeText={setPassword}
              />
          </View>
            
          <Button title='Login' color='black' onPress={onLogin}/>

        </View>
        <Link href='./register' style={styles.registerLink} >
          <Text style={styles.registerText}>Don't have an account? Sign up!</Text>
        </Link>
    </View>
);
}

const lightStyles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 16,
      backgroundColor: '#FFF',
  },
  icon: {
      width: 300,
      height: 100,
      alignSelf: 'center',
      marginBottom: 100,
  },
  formContainer: {
      backgroundColor: '#EEE',
      padding: 20,
      borderRadius: 30,
      marginHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: '#000',
  },
  input: {
      height: 40,
      marginBottom: 12,
      paddingHorizontal: 8,
      borderRadius: 5,
      backgroundColor: '#FFF',
  },
  registerLink: {
      marginTop: 15,
      alignSelf: 'center',
  },
  registerText: {
      color: '#000',
      textDecorationLine: 'underline',
  },
});

const darkStyles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 16,
      backgroundColor: '#000',
  },
  icon: {
      width: 300,
      height: 100,
      alignSelf: 'center',
      marginBottom: 100,
  },
  formContainer: {
      backgroundColor: '#FFF',
      padding: 20,
      borderRadius: 30,
      marginHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: '#000',
  },
  input: {
      height: 40,
      marginBottom: 12,
      paddingHorizontal: 8,
      borderRadius: 5,
      backgroundColor: '#EEEEEE',
  },
  registerLink: {
      marginTop: 15,
      alignSelf: 'center',
  },
  registerText: {
      color: '#FFF',
      textDecorationLine: 'underline',
  },
});
  
