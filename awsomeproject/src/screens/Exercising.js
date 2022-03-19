import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {Layout, Text, Button} from '@ui-kitten/components';
import {default as theme} from '../custom-theme.json';
import { useremail } from "./Login";
import { getData,postData } from "../components/FetchData";
// import Video from 'react-native-video';
const {height,width,scale}=Dimensions.get("window");

var theUrl="";

class ShowMovies extends React.Component{
  render() {
    return (
      <Layout style={styles.box}>
        {/* <Button onPress={()=>this.handleClick()}>显示视频</Button>
        <Button onPress={()=>this.handleClick2()}>显示视频</Button> */}
        <View >
        {/* {this.gettheMovie()} */}
        {/* <Video 
          source={{url: this.urlb}}
          style={styles.fullScreen}//组件样式
          rate={1}
          volume={1}
          resizeMode="contain"
          repeat={true}
        /> */}
          <Text>演示视频lalalla</Text>
        </View>
        
      </Layout>
    );
  }
  
}

function handleClick(){
  let urlf = "http://81.68.226.132:80/exercise/begin"
  toExercising = async () => {
    // props.nav2exercising.navigate('Exercising');
    let res = await getData(urlf,props.login.token);
    if(res["code"]===0) Alert.alert(res["message"]);
    else {
      //调用安卓原生界面
      MyNativeModule.startcameraActivity()
    }
  };

  
}


export default function Exercising({navigation}) {
  return (
    <View>
      <Layout style={styles.container1}>
        {/* 演示视频 */}
        <ShowMovies/> 
        {/* 用户视频 */}
        <View style={styles.box}>
          <Text>用户视频some introductions</Text>
        </View>
      </Layout>
      <Layout style={styles.container2}>
        <Button onPress={()=>handleClick()}>Begin!</Button>
        <Button onPress={() => navigation.goBack()}>Quit Exercising</Button>
      </Layout>
    </View>
  );
}

const styles=StyleSheet.create({
  mainContainer:{
    justifyContent:"space-evenly",
    alignContent:"center",
    flex:1
  },
  container1:{
    flexDirection:"row",
    justifyContent:"space-around",
    alignContent:"flex-start",
    height:height*0.5
  },
  container2:{
    marginTop:height*0.15,
    marginLeft:width*0.25,
    flexDirection:"column",
    justifyContent:"space-evenly",
    alignContent:"center",
    height:height*0.2,
    width:width*0.5,
    backgroundColor:"orange"
  },
  box:{
    flex:1,
    height:height*0.5,
    width:width*0.4,
    borderStyle:"solid",
    borderWidth:1/scale,
  }
})