import { View, Text, StyleSheet, TouchableOpacity,ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const Square = ({ value, onPress }) => {
  return (
    <TouchableOpacity style={styles.square} onPress={onPress}>
      <Text style={styles.squareText}>{value}</Text>
    </TouchableOpacity>
  )
}

const Game = ({navigation}) => {
  const [draw,setDraw]=useState(false);
  const [outcome,setOutCome]=useState(false);
  const [data,setData]=useState();
  const [playerTag,setPlayerTag]=useState('X');
  const [waiting, setWaiting] = useState(true);
  const [playerOneName, setPlayerOneName] = useState('Player One');
  const [playerTwoName, setPlayerTwoName] = useState('Player Two');
  const [flag,setFlag]=useState(true);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [result,setResult]=useState();
  const[table,setTable]=useState();
  const[upd,setUpd]=useState(true);
  const [pid,setpid]=useState();
const handleQuit=async()=>{
  const username = await AsyncStorage.getItem('user');
  await axios.post('https://xo-efft.onrender.com/game/quit', { username,table }).then((res)=>{
    navigation.goBack();
    }).catch((err)=>{
        console.log(err);
        alert("SomeThing Went Wrong")
    }).then(()=>{
        console.log("Finish");
    })
  navigation.goBack();

}
  const cancelMatch = async() => {
    const username = await AsyncStorage.getItem('user');
    await axios.post('https://xo-efft.onrender.com/game/cancel', { username }).then((res)=>{
    navigation.goBack();
    }).catch((err)=>{
        console.log(err);
        alert("SomeThing Went Wrong")
    }).then(()=>{
        console.log("Finish");
    })
  }

  const renderSquare = (i) => {
    return (
      <Square
  value={board[i]}
  onPress={() => {
    if (board[i] !== 'O' && board[i] !== 'X') {
      handleSquarePress(i);
    }
  }}
/>
    )
  }

  const update=async(newBoard)=>{
    const username = await AsyncStorage.getItem('user');
    await axios.post("https://xo-efft.onrender.com/game/update",{tid:table,board:newBoard,username}).then((res)=>{
     console.log(res.data);
     setData(res.data.details[0]);
     setBoard(res.data.details[0].board);
     setDraw(res.data.details[0].draw);

     setResult(res.data.details[0].result);
     if (username === res.data.details[0].player1Id)
     {
       setFlag(res.data.details[0].player1status);
     }
     else 
     {
       setFlag(res.data.details[0].player2status);
     }
  }).catch((err)=>{
        console.log(err)
    }).then(()=>{
        console.log("Finish");
    });
    setUpd(true);
  }

  const handleSquarePress = (i) => {
    if (flag) {
      setUpd(false);
      const newBoard = [...board];
      newBoard[i] = playerTag;
      setBoard(newBoard);
      update(newBoard);
    } else {
      alert('Opponent Move');
    }
  }

  const Search = async () => {
    const username = await AsyncStorage.getItem('user');
    await axios.post('https://xo-efft.onrender.com/game/lobby', { username }).then((res) => {
      console.log(res.data);
      if (res.data.status === 'waiting for opponent') {
        console.log("Waiting")
      } else if (res.data.status === 'success') {
        setBoard(res.data.details[0].board);
        
     setData(res.data.details[0]);
        setPlayerOneName(res.data.details[0].player1Id);
        setPlayerTwoName(res.data.details[0].player2Id);
        setDraw(res.data.details[0].draw);
        setResult(res.data.details[0].result);
        if (username === res.data.details[0].player1Id)
        {
          setPlayerTag(res.data.details[0].player1symbol);
          setFlag(res.data.details[0].player1status);
        }
        else 
        {setPlayerTag(res.data.details[0].player2symbol);
          setFlag(res.data.details[0].player2status);
        }
        setWaiting(false);
        setTable(res.data.details[0]._id);
      }
    }).catch((err) => {
      console.log(err);
    }).then(() => {
      console.log('Finish');
    });
  };
  const waitForResult = async (interval) => {
    if(waiting)
    {
    const username = await AsyncStorage.getItem('user');
    await axios
      .post('https://xo-efft.onrender.com/game/match',{username})
      .then((res) => {
        if (res.data.status === 'success') {
          
     setData(res.data.details[0]);
          setBoard(res.data.details[0].board);
          setPlayerOneName(res.data.details[0].player1Id);
          setPlayerTwoName(res.data.details[0].player2Id);
          setResult(res.data.details[0].result);
          setDraw(res.data.details[0].draw);

          if (username === res.data.details[0].player1Id)
          {
            setPlayerTag(res.data.details[0].player1symbol);
            setFlag(res.data.details[0].player1status);
          }
          else 
          {setPlayerTag(res.data.details[0].player2symbol);
            setFlag(res.data.details[0].player2status);
          }
          setTable(res.data.details[0]._id);
          setWaiting(false); 
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        console.log('Searching...');
      });
    }
    else if(upd)
    {
periodupdate();
    }
  };
  useEffect(async() => {
    setpid(await AsyncStorage.getItem('user'));
    Search();
    const interval = setInterval(() => waitForResult(interval), 5000);
    return () => clearInterval(interval);
  }, []);
const load=async()=>{
  if(result==="completed" && !draw)
  {
    const username = await AsyncStorage.getItem('user');
    if(data.winner===username)
      navigation.navigate('Result',{ isWon: true,type:true });
    else
       navigation.navigate('Result',{ isWon: false,type:true });
  }
  else if(draw)
  {
    navigation.navigate('Result',{ isWon: true,type:false });
  }
}
useEffect(()=>{
 load();
},[result])
 
  const periodupdate=async()=>{
    console.log(table);
    const username = await AsyncStorage.getItem('user');

    await axios.post("https://xo-efft.onrender.com/game/updateperiod",{table,username}).then((res)=>{
      // console.log(res.data.details);
      setBoard(res.data.details[0].board);
      setResult(res.data.details[0].result);
      setDraw(res.data.details[0].draw);
     setData(res.data.details[0]);
      if (username === res.data.details[0].player1Id)
      {
        setPlayerTag(res.data.details[0].player1symbol);
        setFlag(res.data.details[0].player1status);
      }
      else 
      {setPlayerTag(res.data.details[0].player2symbol);
        setFlag(res.data.details[0].player2status);
      }
   }).catch((err)=>{
         console.log(err)
     }).then(()=>{
         console.log("Finish");
     })
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
          <TouchableOpacity onPress={cancelMatch}>
            <Text style={styles.quit}>Cancel Match</Text>
          </TouchableOpacity>
        </View>
        :
        <View style={styles.container}>
 


 <Text style={[styles.text, {position: 'absolute', left: 20, top: 70, color: pid === playerOneName && flag ? 'red' : 'black'}]}>
  {playerOneName}
</Text>
<Text style={[styles.text, {position: 'absolute', right: 20 , top: 70, color: pid === playerTwoName && flag ? 'red' : 'black'}]}>
  {playerTwoName}
</Text>
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
  }
});

export default Game;
