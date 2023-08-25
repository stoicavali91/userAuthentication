import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import { Colors } from './constants/styles';
import AuthContextProvider from './store/auth-context';
import { useContext, useState } from 'react';
import { AuthContext } from './store/auth-context';
import IconButton from './components/ui/IconButton';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen 
        name="Welcome" 
        component={WelcomeScreen} 
        options={{headerRight:({tintColor})=>(
          <IconButton icon="exit" color={tintColor} size={24} onPress={authCtx.logout}/>
        )}} />
    </Stack.Navigator>
  );
}

function Navigation() {

  const authCtx = useContext(AuthContext);

  return (
      <NavigationContainer>
        {/* using this method we protect the screen Welcome to be reached if a condition is not met, so we are separating the screens */}
        {!authCtx.isAuthenticated && <AuthStack />}
        {authCtx.isAuthenticated && <AuthenticatedStack />}
      </NavigationContainer>
    
  );
}

function Root(){

  const [isTyingLogin, setIsTyingLogin] = useState(true);
  const authCtx = useContext(AuthContext);

   //to run some code when the component is loading we are using useEffect
   useEffect(() => {
    async function fetchToken(){
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken){
        authCtx.authenticate(storedToken);
      }
      setIsTyingLogin(false);
    } 
    fetchToken();
  }, []);

  if (isTyingLogin){
    return <AppLoading/>
  }

  return <Navigation/>
  
}

export default function App() {

  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </>
  );
}
