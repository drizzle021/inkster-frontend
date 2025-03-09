import { View, Text, StyleSheet, TextInput, Button, Image } from 'react-native';
import { Link } from 'expo-router'

export default function Register() {
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
              />
          </View>
          <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput 
                style={styles.input} 
                keyboardType='email-address'
                autoCapitalize='none' 
                autoCorrect={false}  

              />
          </View>
          <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput 
                style={styles.input} 
                secureTextEntry 
                autoCapitalize='none' 
                autoCorrect={false} 
              />
          </View>
            
          <Button title='Sign up' color='black'/>
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
  
