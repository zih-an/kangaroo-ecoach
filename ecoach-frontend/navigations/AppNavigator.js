/** Main - App Navigator */
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
} from "@ui-kitten/components";
import Home from "../screens/Home";
import Plan from "./Plan";
import Shopping from "../screens/Shopping";
import Mine from "./Mine";

const HomeIcon = (props) => <Icon {...props} name="home-outline" />;
const PlanIcon = (props) => <Icon {...props} name="book-open-outline" />;
const ShoppingIcon = (props) => (
  <Icon {...props} name="shopping-cart-outline" />
);
const PersonIcon = (props) => <Icon {...props} name="person-outline" />;

const { Navigator, Screen } = createBottomTabNavigator();
const TabNavigator = () => (
  <Navigator
    tabBar={(props) => <BottomTabBar {...props} />}
    screenOptions={{ title: "袋鼠教练", headerTitleAlign: "center" }}
  >
    <Screen name="Home" component={Home} />
    <Screen name="Plan" component={Plan} />
    <Screen name="Shopping" component={Shopping} />
    <Screen name="Mine" component={Mine} />
  </Navigator>
);

export function BottomTabBar({ navigation, state }) {
  return (
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={(index) => navigation.navigate(state.routeNames[index])}
    >
      <BottomNavigationTab icon={HomeIcon} title="主页" />
      <BottomNavigationTab icon={PlanIcon} title="计划" />
      <BottomNavigationTab icon={ShoppingIcon} title="商城" />
      <BottomNavigationTab icon={PersonIcon} title="我的" />
    </BottomNavigation>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}
