/** Main - App Navigator */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
} from '@ui-kitten/components';
import SplashScreen from '../screens/WelcomePage';
import Home from '../screens/Home';
import Plan from './Plan';
import Shopping from '../screens/Shopping';
import Mine from './Mine';
import Exercising from '../screens/Exercising';
import Login from '../screens/Login';
import Register from "../screens/Register";

const HomeIcon = props => <Icon {...props} name="home-outline" />;
const PlanIcon = props => <Icon {...props} name="book-open-outline" />;
const ShoppingIcon = props => <Icon {...props} name="shopping-cart-outline" />;
const PersonIcon = props => <Icon {...props} name="person-outline" />;

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

const BottomTabBar = ({navigation, state}) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}>
    <BottomNavigationTab icon={HomeIcon} title="主页" />
    <BottomNavigationTab icon={PlanIcon} title="计划" />
    <BottomNavigationTab icon={ShoppingIcon} title="商城" />
    <BottomNavigationTab icon={PersonIcon} title="我的" />
  </BottomNavigation>
);
const TabNavigator = () => (
  <BottomTab.Navigator
    tabBar={props => <BottomTabBar {...props} />}
    screenOptions={{title: '袋鼠教练', headerTitleAlign: 'center'}}>
    <BottomTab.Screen name="Home" component={Home} />
    <BottomTab.Screen name="Plan" component={Plan} />
    <BottomTab.Screen name="Shopping" component={Shopping} />
    <BottomTab.Screen name="Mine" component={Mine} />
  </BottomTab.Navigator>
);

const AppStack = () => (
  <Stack.Navigator
    initialRouteName="Splash"
    screenOptions={{headerShown: false}}>
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Register" component={Register} />
    <Stack.Screen name="MainPage" component={TabNavigator}></Stack.Screen>
    <Stack.Screen name="Exercising" component={Exercising} />
  </Stack.Navigator>
);

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
}
