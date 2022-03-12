import React from "react";
import { StyleSheet, Image, ScrollView } from "react-native";
import { Layout, Card, Text, Button } from "@ui-kitten/components";
import { default as theme } from "../custom-theme.json";

export default function ShoppingCard(props) {
  return (
    <Layout style={styles.cardContainer}>
      <Image
          style={styles.imgStyle}
          source={{uri: props.imageUrl}}
        />
      <Text category="h5">{props.name}</Text>
      <Text category="h6">{props.price}</Text>
      <Button style={styles.btnStyle} appearance="outline">
        购买
      </Button>
      <ScrollView style={styles.paraCardStyle}>
        <Text category="p1" style={styles.paraStyle}>
          {props.data}
        </Text>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paraCardStyle: {
    width: "85%",
    height: 150
  },
  paraStyle: {
    padding: 5,
  },
  btnStyle: {
    width: "50%",
    backgroundColor: "transparent", 
    margin: 10,
  },
  imgStyle: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "black",
    width: "80%",
    height: 200,
    
  },
});
