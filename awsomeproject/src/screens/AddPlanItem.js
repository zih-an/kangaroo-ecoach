import React,{useState,useEffect} from 'react';
import {ScrollView, Alert,ActivityIndicator,ToastAndroid,Text,BackHandler} from 'react-native';
import {
  Divider,
  Icon,
  Layout,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import VideoCard from '../components/VideoCard';
import { connect } from "react-redux";
import * as actions from "./store/actions";
import { getData, postData } from "../components/FetchData";
import { default as theme } from "../custom-theme.json";

const urlChange = "http://81.68.226.132:80/plan/change";
const urlChoosen = "http://81.68.226.132:80/plan/index";

const BackIcon = props => <Icon {...props} name="arrow-back" />;
const ClickIcon = props => <Text style={{color:theme["color-primary-500"],fontSize:18}}>确定</Text>;


function AddItem(props) {
  const [progress,setProgress] = useState(false);
  const navigateBackWithSend = async () => {
    setProgress(true);
    //这里的回调函数修改了下，用于在修改计划后，跳转页面前，根据最终的今日计划id数组向服务器请求并更新今日计划
    let update = await postData(urlChange,{"id":props.todayPlans},props.login.token);
    let message = update["message"];
    if(update["code"]==="1"){
      let resToday = await getData(urlChoosen,props.login.token);
      props.addTodayDetail(resToday["data"]);
      ToastAndroid.show("修改成功！",500);
      setProgress(false);
      props.navigation.goBack();
    }
    else {
      setProgress(false);
      ToastAndroid.show(message,500);
    }
  };
  const navigateBack = async () => {
    // setProgress(true);
    //这里的回调函数修改了下，用于在修改计划后，跳转页面前，根据最终的今日计划id数组向服务器请求并更新今日计划
      let resToday = await getData(urlChoosen,props.login.token);
      props.changeToday(resToday["data"].map(item => item.id));
      props.navigation.goBack();
      ToastAndroid.show("计划未修改！",500);
  };

  const BackAction = () => {
    return <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;
  }

  const ClickAction = () => {
    return (progress? <ActivityIndicator color="orange"/>:<TopNavigationAction icon={ClickIcon} onPress={navigateBackWithSend} />);
  }
  const backAction = () => {
    Alert.alert("稍等!", "确定不修改计划吗?", [
      {
        text: "取消",
        onPress: () => null,
        style: "cancel"
      },
      { text: "确定", onPress: () => navigateBack() }
    ]);
    
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);
  return (
    <ScrollView style={{maxHeight: '100%'}}>
      <TopNavigation
        title="添加项目"
        alignment="center"
        accessoryLeft={BackAction}
        accessoryRight={ClickAction}
      />
      <Divider />
      <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {/* 直接根据登录时就获取到的所有计划生成修改计划中的各动作卡片，是否选中卡片由今日计划的id数组决定 */}
        {props.allPlans.map((Item,index)=>{
          return <VideoCard
          key={index}
          id={Item["id"]}
          sv_path={Item["sv_path"]}
          sketch_sv_path={Item["sketch_sv_path"]}
          A_intensity={Item["A_intensity"]}
          title={Item["title"]}
          introduction={Item["introduction"]}
          choose={props.todayPlans.includes(Item["id"])}
          type = "modify"
          ></VideoCard>
        })}
      </Layout>
    </ScrollView>
  );
}

const mapStateToProps = state =>{
  return {
      login:state.login,
      todayPlans:state.todayPlans,
      todayPlansB:state.todayPlansB,
      todayPlansDetail:state.todayPlansDetail,
      allPlans:state.allPlans,
  };
};

export default connect(mapStateToProps,actions)(AddItem);