import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';
import ListProfiles from './Home/ListProfils';  
import MyAccount from './Home/MyAccount';     
import Groups from './Home/Groups';          

const Tab = createMaterialBottomTabNavigator();

export default function Home(props) {
  const currentuserid = props.route.params.userID;

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="ListProfils"
        component={ListProfiles}
        initialParams={{ currentuserid }} 
      />
      <Tab.Screen
        name="MyAccount"
        component={MyAccount}
        initialParams={{ currentuserid }}
      />
      <Tab.Screen
        name="Groups"
        component={Groups}
        initialParams={{ currentuserid }}
      />
    </Tab.Navigator>
  );
}
