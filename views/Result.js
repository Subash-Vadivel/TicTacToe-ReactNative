import { View, Text, StyleSheet, Animated, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import winImage from '../assets/won.jpg';
import loseImage from '../assets/lost.jpg';
import drawImage from '../assets/draw.jpg';

export default function Result({route, navigation}) {
  const {isWon,type}=route.params;
  const [isWons, setIsWon] = useState(isWon); // default value is false, meaning the player lost the game
  const [animatedValue, setAnimatedValue] = useState(new Animated.Value(0));

  const remove=async()=>{
    const username = await AsyncStorage.getItem('user');
    await axios.post("https://xo-efft.onrender.com/game/remove",{username}).then((res)=>{
        navigation.navigate('Home');
        console.log(res);
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

  const getImage = () => {
    if (type) {
      if (isWon) {
        return winImage;
      } else {
        return loseImage;
      }
    } else {
      return drawImage;
    }
  }

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
      color:type ? (isWon ? 'green' : 'red'):'#db7b14',
      transform: [{ scale: scaleValue }],
    },
    button: {
      backgroundColor: 'black',
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
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    image: {
      width: 200,
      height: 200,
      marginBottom: 20,
    },
  });

  return (
    <View style={styles.container}>
      <Image source={getImage()} style={styles.image} />
      <Animated.Text style={styles.text}>
        {(type)?(isWon ? 'You won!' : 'You lost.'):'Draw ! '}
      </Animated.Text>
      <TouchableOpacity
        style={styles.button}
        onPress={remove}>
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
    </View>
  );
}
