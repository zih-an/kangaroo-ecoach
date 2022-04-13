import React from "react";
import { StyleSheet, Image, ScrollView, Linking,View } from "react-native";
import { Layout, Text, Button } from "@ui-kitten/components";


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
      <Text category="h5" style={{color:"#444444"}}>{props.name}</Text>
      <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
        <View style={{width:80,alignItems:"center",justifyContent:"center"}}><Text style={{fontSize:15}}>￥{props.price}</Text></View>
        <Button style={styles.btnStyle} appearance="outline" onPress={open}>
          购买
        </Button>
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
    width: "21%",
    backgroundColor: "transparent", 
    marginTop: 10,
  },
  imgStyle: {
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "#fca766",
    width: "80%",
    height: 200,
    
  },
});
