import React from "react";
import { StyleSheet, Image, ScrollView, Linking,View } from "react-native";
import { Layout, Text, Button } from "@ui-kitten/components";
import { Card } from "react-native-shadow-cards";
import { default as theme } from "../custom-theme.json";


export default function ShoppingCard(props) {
  const open=()=>{
    Linking.openURL(props.purchase) 
	}
  return (
    <Layout style={styles.cardContainer}>
      <Card style={styles.img}>
        <Image
            style={styles.imgStyle}
            source={{uri: props.imageUrl}}
          />
      </Card>
      <Text category="h5" style={{color:"#444444"}}>{props.name}</Text>
      <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
        <View style={{width:80,alignItems:"center",justifyContent:"center"}}><Text style={{fontSize:15}}>￥{props.price}</Text></View>
        <Card style={styles.btnStyle}>
          <Text style={{fontSize:18,color:theme["color-primary-500"]}}>
            购买
          </Text>
        </Card>
      </View>
      <View style={{width:"100%",alignItems:"flex-start",marginLeft:40,borderBottomWidth:1,borderBottomColor:"lightgrey"}}>
        <Text style={styles.paraStyle}>
            商品信息
          </Text>
      </View>
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
    fontSize:12,
    color:'#666666',
    marginLeft:10,
    fontFamily: 'PingFang SC',
    lineHeight: 25
  },
  btnStyle: {
    width: "15%",
    backgroundColor: "white", 
    marginTop: 0,
    borderWidth:1,
    borderColor:theme["color-primary-500"],
    justifyContent: 'center',
    alignItems: 'center',
  },
  img:{
    borderRadius: 20,
    borderColor: "#eeeeee",
    borderWidth: 1,
    width: "70%",
    height: 180,margin:20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgStyle: {
    // borderWidth: 2,
    borderRadius: 20,
    borderColor: "#fca766",
    width: "80%",
    height: "80%",
  },
});
