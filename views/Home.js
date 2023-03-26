import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Logo from '../assets/XO.png'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect,useState } from 'react';
import axios from 'axios';
export default function Home({ navigation }) {
    const [user,setUser]=useState('');


    const load=async()=>{
        const uid=await AsyncStorage.getItem('user');
        if(uid===null||uid===undefined)
        {
            
            await axios.post("https://xo-efft.onrender.com/auth/newUser").then((res)=>{
              AsyncStorage.setItem("user",res.data.uid);
            }).catch((err)=>{
                console.log(err)
            }).then(()=>{
                console.log("Finish");
            })
        }
        else
        {
            setUser(AsyncStorage.getItem('user'));
        }
    }
    useEffect(()=>{
        load();
    },[])
  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} />
      <TouchableOpacity style={[styles.button, { backgroundColor: '#007AFF' }]}>
        <Text style={styles.buttonText}   onPress={() => navigation.navigate('NewGame')}>New Game</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#007AFF' }]}>
        <Text style={styles.buttonText}>Leader Board</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#FF3B30' }]}>
        <Text style={styles.buttonText}>Quit</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  button: {
    width: 200,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
