import React from "react";
import { StyleSheet, Image, ScrollView } from "react-native";
import { Layout, Card, Text, Button } from "@ui-kitten/components";
import { default as theme } from "../custom-theme.json";

export default function ShoppingCard() {
  return (
    <Layout style={styles.cardContainer}>
      <Image style={styles.imgStyle}></Image>
      <Text category="h5">OPPO智能手表</Text>
      <Text category="h6">￥999</Text>
      <Button style={styles.btnStyle} appearance="outline">
        购买
      </Button>
      <ScrollView style={styles.paraCardStyle}>
        <Text category="p1" style={styles.paraStyle}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus
          quos velit non consequuntur, doloribus quo deleniti similique ad
          reprehenderit consectetur cum voluptatem incidunt minima rem ipsa
          totam explicabo perferendis atque.
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
    height: 150,
    // borderStyle: "solid",
    // borderWidth: 1,
    // borderRadius: 5,
    // borderColor: "gray",
  },
  paraStyle: {
    padding: 5,
  },
  btnStyle: {
    width: "50%",
    backgroundColor: "transparent", //theme["color-primary-100"],
    margin: 10,
  },
  imgStyle: {
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "black",
    width: "80%",
    height: 200,
  },
});
