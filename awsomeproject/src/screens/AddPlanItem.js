import React,{useState,useEffect} from 'react';
import {ScrollView, Alert,ActivityIndicator} from 'react-native';
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import VideoCard from '../components/VideoCard';
import { connect } from "react-redux";
import * as actions from "./store/actions";
import { getData, postData } from "../components/FetchData";
const urlChange = "http://81.68.226.132:80/plan/change";
const urlChoosen = "http://81.68.226.132:80/plan/index";

const BackIcon = props => <Icon {...props} name="arrow-back" />;

function AddItem(props) {
  const [progress,setProgress] = useState(false);
  const navigateBack = async () => {
    setProgress(true);
    //这里的回调函数修改了下，用于在修改计划后，跳转页面前，根据最终的今日计划id数组向服务器请求并更新今日计划
    let update = await postData(urlChange,{"id":props.todayPlan},props.login.token);
    let message = update["message"];
    if(update["code"]==="1"){
      let resToday = await getData(urlChoosen,props.login.token);
      props.addTodayDetail(resToday["data"]);
      setProgress(false);
      props.navigation.goBack();
    }
    else {
      setProgress(false);
      Alert.alert(message);
    }
  };

  const BackAction = () => {
    return (progress? <ActivityIndicator color="orange"/>:<TopNavigationAction icon={BackIcon} onPress={navigateBack} />);
  }

  return (
    <ScrollView style={{maxHeight: '100%'}}>
      <TopNavigation
        title="添加项目"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {/* 直接根据登录时就获取到的所有计划生成修改计划中的各动作卡片，是否选中卡片由今日计划的id数组决定 */}
        {props.allPlan.map((Item,index)=>{
          return <VideoCard
          key={index}
          id={Item["id"]}
          sv_path={Item["sv_path"]}
          sketch_sv_path={Item["sketch_sv_path"]}
          A_intensity={Item["A_intensity"]}
          title={Item["title"]}
          introduction={Item["introduction"]}
          choose={props.todayPlan.includes(Item["id"])}
          ></VideoCard>
        })}
      </Layout>
    </ScrollView>
  );
}

const mapStateToProps = state =>{
  return {
      login:state.login,
      todayPlan:state.todayPlans,
      todayPlanDetail:state.todayPlansDetail,
      allPlan:state.allPlans
  };
};

export default connect(mapStateToProps,actions)(AddItem);