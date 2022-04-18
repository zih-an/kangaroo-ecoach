import React,{useState,useEffect} from 'react';
import {ScrollView, Alert,ActivityIndicator,BackHandler} from 'react-native';
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
const subTypes = {
    "全身运动":[1,2,3],
    "背部运动":[9,10,11],
    "臀部运动":[29,30,31],
    "腹部运动":[19,20,21,22,23],
    "肩部运动":[5,6,7,8],
    "手臂运动":[4],
    "腿部运动":[24,25,26],
    "胸部运动":[12,13,14,15],
    "腰部运动":[16,17,18],
}
const urlChange = "http://81.68.226.132:80/plan/change";
const urlChoosen = "http://81.68.226.132:80/plan/index";

const BackIcon = props => <Icon {...props} name="arrow-back" />;

function movementDetail(props) {
  const [subType,setType] = useState([]);

  const navigateBack = () => {
      props.navigation.goBack();
  };

  const BackAction = () => {
    return <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;
  }
  const backAction = () => {
    navigateBack();
    return true;
  };
  useEffect(() => { 
    setType(subTypes[props.title]);
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  },[subType]);

  return (
    <ScrollView style={{maxHeight: '100%'}}>
      <TopNavigation
        title={props.title}
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {/* 根据相应页面获取对应部位的动作生成动作展示，就获取到的所有计划生成修改计划中的各动作卡片，是否选中卡片由今日计划的id数组决定 */}
        {props.allPlan.filter((item,index)=>subType.includes(item.id)).map((Item,index)=>{
          return <VideoCard
          key={index}
          id={Item["id"]}
          sv_path={Item["sv_path"]}
          sketch_sv_path={Item["sketch_sv_path"]}
          A_intensity={Item["A_intensity"]}
          title={Item["title"]}
          introduction={Item["introduction"]}
          choose={props.collect.includes(Item["id"])}
          type="collect"
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
      allPlan:state.allPlans,
      title:state.title,
      plansIndex:state.allPlansIndex,
      collect:state.collect
  };
};

export default connect(mapStateToProps,actions)(movementDetail);