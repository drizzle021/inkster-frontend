import { View, Text, StyleSheet, TextInput, Button, Image, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router'
import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import { apiFetch } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Register() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = useCallback(async () => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
  
    try {

      const res_register = await apiFetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const res_login = await apiFetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const token = res_login.data.access_token;
      if (token) {
        await AsyncStorage.setItem('token', token);
        console.log('Token stored!');
        router.push('/setup');
      } else {
        alert('Login failed. No token received.');
      }

      
    } catch (err) {
      console.error('Register error:', err);
      alert('Register failed. Please try again.');
    }
  }, [username, email, password, router]);


  return (
    <View style={styles.container}>
        <Image source={require('../../assets/images/splash-icon-dark.png')} style={styles.icon} />
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput 
                style={styles.input} 
                keyboardType='default' 
                autoCapitalize='none' 
                autoCorrect={false} 
                onChangeText={setUsername}
                value={username}
              />
          </View>
          <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput 
                style={styles.input} 
                keyboardType='email-address'
                autoCapitalize='none' 
                autoCorrect={false} 
                onChangeText={setEmail} 
                value={email}
              />
          </View>
          <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput 
                style={styles.input} 
                secureTextEntry 
                autoCapitalize='none' 
                autoCorrect={false} 
                onChangeText={setPassword}
                value={password}
              />
          </View>
            
          <Button title='Sign up' color='black' onPress={handleSignUp}/>

        </View>
        <Link href='./login' style={styles.registerLink} >
            <Text style={styles.registerText}>Already have an account? Log in!</Text>
        </Link>
    </View>
);
}

const styles = StyleSheet.create({
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
},
input: {
    height: 40,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 5,
    backgroundColor: '#EEEEEE'
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
  
