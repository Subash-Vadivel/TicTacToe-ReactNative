import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';

const Square = ({ value, onPress }) => {
  return (
    <TouchableOpacity style={styles.square} onPress={onPress}>
      <Text style={styles.squareText}>{value}</Text>
    </TouchableOpacity>
  )
}

const Game = () => {

  const navigation = useNavigation();
  const [playerTag,setPlayerTag]=useState('X');
  const [waiting, setWaiting] = useState(false);
  const [playerOneName, setPlayerOneName] = useState('Player One');
  const [playerTwoName, setPlayerTwoName] = useState('Player Two');
  const [flag,setFlag]=useState(true);
  const [board, setBoard] = useState(Array(9).fill(null));

  const handleQuit = () => {
    navigation.goBack();
  }

  const renderSquare = (i) => {
    return (
      <Square
        value={board[i]}
        onPress={() => handleSquarePress(i)}
      />
    )
  }

  const handleSquarePress = (i) => {
    if (flag) {
      const newBoard = [...board];
      newBoard[i] = playerTag;
      setBoard(newBoard);
      setFlag(false);
    } else {
      alert('Opponent Move');
    }
  }

  return (
    <>
      {waiting ?
        <View style={styles.container}>
          <ActivityIndicator
            size="large"
            color="#00ff00"
          />
          <Text style={styles.text}>Looking For Opponent</Text>
          <TouchableOpacity onPress={handleQuit}>
            <Text style={styles.quit}>Cancel Match</Text>
          </TouchableOpacity>
        </View>
        :
        <View style={styles.container}>
             <Text style={[styles.text, {position: 'absolute', left: 20, top: 70}]}>{playerOneName}</Text>
          <Text style={[styles.text, {position: 'absolute', right: 20 , top: 70}]}>{playerTwoName}</Text>
          <Text style={styles.text}>Game</Text>
          <View style={styles.board}>
            <View style={styles.row}>
              {renderSquare(0)}
              {renderSquare(1)}
              {renderSquare(2)}
            </View>
            <View style={styles.row}>
              {renderSquare(3)}
              {renderSquare(4)}
              {renderSquare(5)}
            </View>
            <View style={styles.row}>
              {renderSquare(6)}
              {renderSquare(7)}
              {renderSquare(8)}
            </View>
          </View>
          <TouchableOpacity onPress={handleQuit}>
            <Text style={styles.quit}>Forfeite</Text>
          </TouchableOpacity>
        </View>
      }
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
 
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 16,
  },
  quit: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'red',
    marginTop: 25,
    borderRadius: 10,
    padding: 10,
  },
  board: {
    marginTop: 25,
  },
  row: {
    flexDirection: 'row',
  },
  square: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default Game;
