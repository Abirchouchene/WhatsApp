import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importation des écrans
import Auth from './Screens/Auth';
import Home from './Screens/Home';
import NewUser from './Screens/NewUser';
import Chat from './Screens/Chat';
import MyAccount from './Screens/Home/MyAccount';
import ContactList from './Screens/Home/ContactList';
import Groups from './Screens/Home/Groups'; 
import GroupDetails from './Screens/Home/GroupDetails'; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}}>
        {/* Existing screens */}
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="NewUser" component={NewUser} options={{headerShown: true }} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="MyAccount" component={MyAccount} />
        <Stack.Screen name="Groups" component={Groups} />
        <Stack.Screen name="ContactList" component={ContactList} />
        <Stack.Screen name="GroupDetails" component={GroupDetails} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
