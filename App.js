import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './views/Home';
import Game from './views/Game';
import Result from './views/Result';
const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
        <Stack.Screen name="NewGame" component={Game} options={{ headerShown: false }} />
        <Stack.Screen name="Result" component={Result} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
