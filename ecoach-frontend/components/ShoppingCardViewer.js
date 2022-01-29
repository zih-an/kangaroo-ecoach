import React from "react";
import { StyleSheet } from "react-native";
import { Layout, Text, ViewPager, Icon } from "@ui-kitten/components";
import ShoppingCard from "./ShoppingCard";
import { default as theme } from "../custom-theme.json";

const ForwardIcon = (props) => (
  <Icon
    {...props}
    name="arrow-ios-forward-outline"
    fill={theme["color-primary-500"]}
    style={styles.iconStyle}
  />
);
const BackIcon = (props) => (
  <Icon
    {...props}
    name="arrow-ios-back-outline"
    fill={theme["color-primary-500"]}
    style={styles.iconStyle}
  />
);

export const ShoppingCardViewer = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  return (
    <Layout>
      <Layout style={styles.headerContainer}>
        <BackIcon />
        <Text category="h6">{String(selectedIndex + 1)} / 5</Text>
        <ForwardIcon />
      </Layout>
      <ViewPager
        selectedIndex={selectedIndex}
        onSelect={(index) => setSelectedIndex(index)}
      >
        <ShoppingCard />
        <ShoppingCard />
        <ShoppingCard />
        <Layout style={styles.tab} level="2">
          <Text category="h5">TRANSACTIONS</Text>
        </Layout>
      </ViewPager>
    </Layout>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    margin: 5,
  },
  tab: {
    height: 192,
    alignItems: "center",
    justifyContent: "center",
  },
  iconStyle: {
    width: 50,
    height: 50,
  },
});
