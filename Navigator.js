import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import UserScreen from './screens/UserScreen';
import LoginScreen from './screens/LoginScreen';
import ChatGroupScreen from './screens/ChatGroupScreen';
import ListUser from './screens/ListUser'
import GroupChat from './screens/GroupChat'
import SearchScreen from './screens/SearchScreen'
import { useSelector } from 'react-redux';
import FetchData from './FetchData'
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Navigator = () => {
    const user = useSelector((state) => state.auth.user);

    const HomeStack = () => {
        return (
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ChatGroup" component={GroupChat} options={{ headerShown: false }} />
                <Stack.Screen name="ChatScreen" component={ChatGroupScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ListUser" component={ListUser} options={{ headerShown: false }} />
                <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        );
    }

    const UserStack = () => {
        return (
            <Stack.Navigator>
                <Stack.Screen name="User" component={UserScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        );
    }

    const LoginStack = () => {
        return (
            <Stack.Navigator>
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        );
    }

    return (
        <NavigationContainer>
            {user ? (
                <>
                    <FetchData />
                    <Tab.Navigator>
                        <Tab.Screen name="HomeTab" component={HomeStack} options={{ headerShown: false }} />
                        <Tab.Screen name="UserTab" component={UserStack} options={{ headerShown: false }} />
                    </Tab.Navigator>
                </>
            ) : (
                <LoginStack />
            )}
        </NavigationContainer>
    );



}

export default Navigator;