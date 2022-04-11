import React,{useState} from 'react';
import {StyleSheet, View, Alert, ActivityIndicator, ScrollView,TouchableOpacity} from 'react-native';
import {Layout, Card, Text, Button,Modal} from '@ui-kitten/components';
import {Icon} from '@ui-kitten/components';
import {default as theme} from '../custom-theme.json';
import TodayTrainPlanCard from './TodayTrainPlanCard';
import {getData} from './FetchData';
import {connect} from 'react-redux';
import ActionSheetComp from "./ActionSheetComp"
import Svg from './Svg';

const BulbIcon = props => <Icon {...props} name="bulb-outline" />;
const ArrorDownIcon = props => (
  <Icon {...props} name="arrowhead-down-outline" />
);
const url = "http://81.68.226.132:80/exercise/begin";
const HistoryTrainCard = () => {
  return (
    <Card style={styles.historyTrainCard}>
      <Text category="s1" style={{color: theme['color-info-100']}}>
        距上次运动已经过去...
      </Text>
      <Layout style={styles.cardMsgContainer}>
        <BulbIcon
          style={{width: 80, height: 80}}
          fill={theme['color-primary-100']}
        />
        <Text
          category="h1"
          style={{color: '#fff', fontWeight: 'bold', fontSize: 40}}>
          3天
        </Text>
      </Layout>
    </Card>
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

  const toExercising = async () => {
    setLoading(true);
    let res = await getData(url,props.login.token);
    setLoading(false);
    if(res["code"]===0) {
      Alert.alert(res["message"]);
    }
    else {
      Alert.alert("开始运动！");
      props.nav2exercising.navigate("SportOverviewPage");
    }
  };
  const toConnectSend = () => {
    // setConnect(false);
    setModalViseibleCnSe(true);
  };
  const toConnectReceive = async () => {
    setModalViseibleCnRe(true);
    // else  Alert.alert("设备未开启！");
  };
  return (
    <Layout style={styles.tabContainer}>
      <TodayTrainPlanCard height={350}/>
      <Layout style={styles.btnContainer}>

        <TouchableOpacity onPress={()=>toConnectSend()} style={styles.touchContainer}>
          <Svg icon="开始监听" size="40" color={theme["color-primary-500"]}/>
          {/* <Svg icon="开始监听" size="50"/> */}
          <Text style={{color:"grey",fontSize:10}}>开启设备</Text>
        </TouchableOpacity >

        <TouchableOpacity onPress={()=>toExercising()}  style={styles.touchContainer}>
          {loginProgress
          ? <View style={{width:110,height:100,alignItems:"center",justifyContent:"center"}}><ActivityIndicator color="orange"/></View>
          : <Svg icon="开始" size="80" />}
          <Text style={{color:"grey",fontSize:15}}>开始运动</Text>
        </TouchableOpacity >

        <TouchableOpacity onPress={()=>toConnectReceive()} style={styles.touchContainer}>
          <Svg icon="搜索设备" size="40" color={theme["color-primary-500"]}/>
          {/* <Svg icon="搜索设备" size="50"/> */}
          <Text style={{color:"grey",fontSize:10}}>附近设备</Text>
        </TouchableOpacity >
        
      </Layout>
      {/* <HistoryTrainCard /> */}
      <ActionSheetComp 
        visible={modalVisibleCnRe} 
        setVisible={setModalViseibleCnRe} 
        items={itemsForCnRe} 
        setStatus={setConnect} 
        modalTitle="查找附近设备" 
        token={props.login.token} 
        nav={props.nav2exercising}/>
      <ActionSheetComp visible={modalVisibleCnSe} setVisible={setModalViseibleCnSe} items={itemsForCnSe} setStatus={setDeviceOpen} modalTitle="设置设备" token={props.login.token}/>

    </Layout>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    height: '93%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  btnContainer: {
    marginTop:"10%",
    width: '100%',
    flexDirection:"row",
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  historyTrainCard: {
    width: '90%',
    backgroundColor: theme['color-info-900'],
  },
  cardMsgContainer: {
    width: '90%',
    backgroundColor: theme['color-info-900'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 8,
  },
  touchContainer:{
    alignItems:"center",
    width:"30%"
  },
});

const mapStateToProps = state =>{
  return {
      login:state.login,
  };
};

export default connect(mapStateToProps)(HomeSportTab);
