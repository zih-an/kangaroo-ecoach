import React from "react";
import { View, StyleSheet } from "react-native";
import { Layout } from "@ui-kitten/components";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppNavigator from "../components/AppNavigator";
import HeaderFlag from "../components/HeaderFlag";

import Home from "./Home";

const { Navigator, Screen } = createNativeStackNavigator();
const navexp = () => (
  <NavigationContainer>
    <Navigator headerMode="none" initialRouteName="Main">
      <Screen
        name="Main"
        component={Main}
        options={{
          title: "袋鼠教练",
          headerStyle: {
            backgroundColor: "#fff",
            // posi,
          },
          headerTitleAlign: "center",
          headerTintColor: theme["color-primary-500"],
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </Navigator>
  </NavigationContainer>
);

export default class HomeScreen extends React.Component {
  state = { selectedIndex: 0 };
  showTab = (index) => {
    switch (index) {
      case 0:
        return <HomeSportTab />;
      case 1:
        return <HomeNewsTab />;
    }
  };

  render() {
    return (
      <Layout
        style={{
          justifyContent: "space-between",
        }}
      >
        <HeaderFlag />
        <Home style={styles.layout} />
        <AppNavigator />
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  layout: {
    height: "81%",
  },
});
