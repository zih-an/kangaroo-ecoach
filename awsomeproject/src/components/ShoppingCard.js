import React from "react";
import { StyleSheet, Image, ScrollView, Linking } from "react-native";
import { Layout, Card, Text, Button } from "@ui-kitten/components";
import { default as theme } from "../custom-theme.json";

export default function ShoppingCard(props) {
  const open=()=>{
    Linking.openURL(props.purchase) 
	}
  return (
    <Layout style={styles.cardContainer}>
      <Image
          style={styles.imgStyle}
          source={{uri: props.imageUrl}}
        />
      <Text category="h5">{props.name}</Text>
      <Text style={{fontSize:15}}>{props.price}</Text>
      <Button style={styles.btnStyle} appearance="outline" onPress={open}>
        购买
      </Button>
      <ScrollView style={styles.paraCardStyle}>
        <Text style={styles.paraStyle}>
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
    padding: 10,
    fontSize:14
  },
  btnStyle: {
    width: "40%",
    backgroundColor: "transparent", 
    margin: 10,
  },
  imgStyle: {
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "orange",
    width: "80%",
    height: 200,
    
  },
});
