import React,{useState} from 'react';
import {StyleSheet, View, Alert, ActivityIndicator, ScrollView,TouchableOpacity,Image,Linking,ToastAndroid} from 'react-native';
import {Layout, Text, Button,Modal} from '@ui-kitten/components';
import {Icon} from '@ui-kitten/components';
import {default as theme} from '../custom-theme.json';
import TodayTrainPlanCard from './TodayTrainPlanCard';
import {getData,postData} from './FetchData';
import {connect} from 'react-redux';
import ActionSheetComp from "./ActionSheetComp"
import Svg from './Svg';
import { Card } from "react-native-shadow-cards";
import CameraModule from"../../KotlinStream"
import newest from "../assets/newest.json";
import * as actions from "../screens/store/actions";

let reportData = newest;
const BulbIcon = props => <Icon {...props} name="bulb-outline" />;
const ArrorDownIcon = props => (
  <Icon {...props} name="arrowhead-down-outline" />
);
const beginurl = "http://81.68.226.132:80/exercise/begin";
const finishurl = "http://81.68.226.132:80/exercise/finish";
const HistoryTrainCard = () => {
  const displayCards = [
    {title:"运动中如何正确呼吸？",clickTo:1,icon:"运动女孩2",url:"https://mip.jy135.com/yundong/78571.html"},
    {title:"大基数鼠崽们如何锻炼？",clickTo:2,icon:"运动女孩1",url:"https://mip.cndzys.com/shenghuoyangsheng/changshi/1952075.html?ivk_sa=1024320u"},
    {title:"想运动却难坚持怎么办？",clickTo:3,icon:"运动女孩4",url:"https://baijiahao.baidu.com/s?id=1552914123850551&wfr=spider&for=pc&searchword=%E8%BF%90%E5%8A%A8%E5%A6%82%E4%BD%95%E5%9D%9A%E6%8C%81%E7%A7%91%E6%99%AE"},
    {title:"三分练,七分吃！",clickTo:4,icon:"运动女孩5",url:"https://baijiahao.baidu.com/s?id=1672000560561935648&wfr=spider&for=pc&searchword=%E4%B8%83%E5%88%86%E5%90%83%E4%B8%89%E5%88%86%E7%BB%83"}
  ];

const handleClick = (index,url) =>{
  switch(index){
    case 1:
      Linking.openURL(url);
    case 2:
      Linking.openURL(url);
    case 3:
      Linking.openURL(url);
    case 4:
      Linking.openURL(url);
  }
}
  return (
    <View style={{width:"95%",justifyContent:"center",alignItems: 'center',}}>
      <Card style={styles.historyTrainCard}>
      <Text category="s1" style={{color: "white",marginLeft:20,marginTop:10}}>
        距上次运动已经过去...
      </Text>
      <Layout style={styles.cardMsgContainer}>
        <BulbIcon
          style={{width: 40, height: 40}}
          fill={theme['color-primary-100']}
        />
        <Text
          category="h1"
          style={{color: '#fff', fontWeight: 'bold', fontSize: 20}}>
          3天
        </Text>
      </Layout>
    </Card>
      <Card style={{marginTop:-10,width:"85%",height:250,backgroundColor:"#ffcbad",marginBottom:40,borderRadius:50,
      justifyContent: 'center',
      alignItems: 'center',}}>
        <View style={{flexWrap:"wrap",height:"92%",width:"99%",flexDirection:"row",
        justifyContent: 'center',alignItems: 'center',paddingTop:20}}>
          {displayCards.map((item,index)=>{
            return <TouchableOpacity 
            onPress={()=>handleClick(item.clickTo,item.url)}
            style={{height:"45%",width:"45%",padding:2,margin:5}}
            key={index}>
            <View style={{width:"100%",height:"95%",overflow: 'hidden',
            justifyContent: 'flex-start',alignItems: 'center',borderRadius: 10,}}>
              <Svg icon={item.icon} size="100"/>
            </View>
            <View style={{height:30,width:"100%",justifyContent: 'center',
            alignItems: 'center',}}><Text style={{fontSize:7,marginTop:-20,color:"purple"}}>{item.title}</Text></View>
          </TouchableOpacity>
          })}
        </View>
        </Card>
    </View>
  );
};

const itemsForCnSe= [
  {
      title: '我是摄像头',
  },
  {
      title: '我是电视',
  },
];
const itemsForCnRe= [
  {
      title: '查找附近摄像头',
  },
  {
      title: '查找附近电视',
  },
];
function HomeSportTab(props) {
  let [loginProgress,setLoading] = useState(false);
  let [modalVisibleCnRe,setModalViseibleCnRe] = useState(false);
  let [modalVisibleCnSe,setModalViseibleCnSe] = useState(false);
  let [deviceOpen,setDeviceOpen] = useState(false);
  let [connect,setConnect] = useState(false);
  let [enableScrollViewScroll,setScoll] = useState(true);

  const toExercising = async () => {
    setLoading(true);
    let resSchedual = await getData(beginurl,props.login.token);
    setLoading(false);
    if(resSchedual["code"]===0) {
      Alert.alert(resSchedual["message"].message);
    }
    else {
      resSchedual=JSON.stringify(resSchedual);
      let response = await CameraModule.startcameraActivity(resSchedual);
      if(response===0)
      {
        
      }else{
        reportData = JSON.parse(response);
        let resfinish = await postData(finishurl,{'information':response,'id':reportData['id']},props.login.token);
        props.addReport(reportData);
        if(resfinish["code"]===1||resfinish["code"]==="1") props.addReportTime(resfinish["data"]);
        props.nav2exercising.navigate("SportOverviewPage");
      }
    }
  };
  const toConnectSend = () => {
    setModalViseibleCnSe(true);
  };
  const toConnectReceive = async () => {
    setModalViseibleCnRe(true);
  };
  return (
    <ScrollView 
      style={styles.scrollContainer} 
      contentContainerStyle={styles.scrollContent}
      scrollEnabled={enableScrollViewScroll}
    >
      <View style={{flexDirection:"row",justifyContent:"flex-start",width:"100%",height:200,backgroundColor:"white"}}>
        <View style={{paddingTop: 10,paddingLeft: 20,}}>
        <Svg icon="运动女孩3" size="200"/>
        </View>
        <Image
          style={{ width:"60%",height: 200,position:"absolute",left:130,top:-70}}
          source={require('../assets/开始运动吧.png')}
          resizeMode='contain'
          />
      </View>

      <Layout style={styles.btnContainer}>

        <TouchableOpacity onPress={()=>toConnectSend()} style={styles.touchContainer}>
          <Svg icon="开始监听" size="40" color={theme["color-primary-500"]}/>
          <Text style={{color:"grey",fontSize:10}}>开启设备</Text>
        </TouchableOpacity >

        <TouchableOpacity onPress={()=>toExercising()}  style={styles.touchContainer}>
          {loginProgress
          ? <View style={{width:110,height:80,alignItems:"center",justifyContent:"center"}}><ActivityIndicator color="orange"/></View>
          : <Svg icon="开始" size="80" color={theme["color-primary-500"]}/>}
          <Text style={{color:"grey",fontSize:15}}>开始运动</Text>
        </TouchableOpacity >

        <TouchableOpacity onPress={()=>toConnectReceive()} style={styles.touchContainer}>
          <Svg icon="搜索设备" size="40" color={theme["color-primary-500"]}/>
          <Text style={{color:"grey",fontSize:10}}>附近设备</Text>
        </TouchableOpacity >
        
      </Layout>
      <TodayTrainPlanCard 
          height={150} 
          onEnableScroll={setScoll} 
          horizontal={true}
          showIndicator={true}/>
      
      <HistoryTrainCard />

      <ActionSheetComp 
        visible={modalVisibleCnRe} 
        setVisible={setModalViseibleCnRe} 
        items={itemsForCnRe} 
        setStatus={setConnect} 
        modalTitle="查找附近设备" 
        token={props.login.token} 
        nav={props.nav2exercising}/>
      <ActionSheetComp visible={modalVisibleCnSe} setVisible={setModalViseibleCnSe} items={itemsForCnSe} setStatus={setDeviceOpen} modalTitle="设置设备" token={props.login.token}/>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    height: '93%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  scrollContainer: {
    flexGrow: 1,
    width: "100%",
    maxHeight: "93%",
    padding: 5,
  },
  scrollContent: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  btnContainer: {
    marginTop:-10,
    marginBottom:15,
    width: '100%',
    flexDirection:"row",
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  historyTrainCard: {
    marginTop:15,
    marginBottom:-20,
    zIndex:999,
    width: '90%',
    backgroundColor: theme["color-primary-500"],
    borderWidth:0,
    borderColor:theme["color-primary-500"],
    borderRadius: 40,
  },
  cardMsgContainer: {
    width: '50%',
    backgroundColor: theme["color-primary-500"],
    borderRadius:20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 8,
    marginLeft:120
  },
  touchContainer:{
    alignItems:"center",
    width:"30%"
  },
});

const mapStateToProps = state =>{
  return {
      login:state.login,
      reportTime:state.reportTime,
  };
};

export default connect(mapStateToProps,actions)(HomeSportTab);
export {reportData};