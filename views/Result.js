import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Result({route, navigation}) {
    const {isWon}=route.params;
  const [isWons, setIsWon] = useState(isWon); // default value is false, meaning the player lost the game
  const [animatedValue, setAnimatedValue] = useState(new Animated.Value(0));

  const remove=async()=>{
    const username = await AsyncStorage.getItem('user');
    await axios.post("https://xo-efft.onrender.com/game/remove",{username}).then((res)=>{
        navigation.navigate('Home');
    }).catch((err)=>{
        console.log(err);
    })
  }


  useEffect(() => {
    if (isWon) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [isWons, animatedValue]);

  const scaleValue = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.5, 1],
  });

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      backgroundColor: '#fff',
    },
    text: {
      fontSize: 32,
      fontWeight: 'bold',
      color: isWon ? 'green' : 'red',
      transform: [{ scale: scaleValue }],
    },button: {
        backgroundColor: '#007AFF',
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 24,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }
   ,
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <Animated.Text style={styles.text}>
        {isWon ? 'You won!' : 'You lost.'}
      </Animated.Text>
      <TouchableOpacity
        style={styles.button}
        onPress={remove}>
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
    </View>
  );
}
