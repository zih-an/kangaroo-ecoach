import React,{useEffect, useState} from "react";
import { StyleSheet,ActivityIndicator,View,TouchableOpacity,ScrollView,Image,ToastAndroid} from "react-native";
import {
  Layout,
  Text,
  Button,
  Divider,
  TopNavigation,
} from "@ui-kitten/components";
import { default as theme } from "../custom-theme.json";
import TodayTrainPlanCard from "../components/TodayTrainPlanCard";
import { connect } from "react-redux";
import * as actions from "./store/actions";
import {getData} from "../components/FetchData";
import Svg from "../components/Svg";
import { Card } from "react-native-shadow-cards";
import LinearGradinet from 'react-native-linear-gradient';
import { menus } from "../components/menus";
import Video from 'react-native-video';


const PlanScore = (props) => {
  return (
    <LinearGradinet
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            colors={['#FB8C6F' ,'#FF826C','pink','#F8D49B']}
            style={{height:55,width:"85%",alignSelf: 'center',borderRadius: 60,}}
          >
    <Card style={scoreStyles.container}>
      <Text style={scoreStyles.scoreHeader}>
        推荐计划评分
      </Text>
      <Layout style={scoreStyles.scoreContainer}>
        <Svg icon="评估身体" size="20" color="gray"/>
        <Text style={scoreStyles.actualScoreStyle}>
          90
        </Text>
        <Text style={scoreStyles.totalScoreStyle}>
          {" "}
          / 100
        </Text>
      </Layout>
      </Card>
      </LinearGradinet>
  );
};

function PlanOverview(props) {
  const [generalProgress,setGeneral] =useState(false);
  const [progress,setProgress] =useState(false);
  let [enableScrollViewScroll,setScoll] = useState(true);
  const navigateAddItem = () => {
    setProgress(true);
    setTimeout(()=>{
      props.navigation.navigate("AddItem");
      setTimeout(() => {
        setProgress(false);
      }, 500);
    },500)
  };
  const generalPlan= async ()=>{
    setGeneral(true);
    const urlUpdate ="http://81.68.226.132/plan/general";
    const urlChoosen = "http://81.68.226.132:80/plan/index";
    let res = await getData(urlUpdate,props.login.token);
    if(res["code"]==="1"||res["code"]===1){
      let resToday = await getData(urlChoosen,props.login.token);
      if(resToday["code"]===1) {
        setTimeout(()=>
        {
          props.addTodayDetail(resToday["data"]);
          props.changeToday(resToday["data"].map(item => item.id));
          setGeneral(false);
          ToastAndroid.show("生成成功！",500)
        },1500)   
      }
      else{
        ToastAndroid.show(resToday["message"],500);
        setGeneral(false);
      }
    }
    else{
      ToastAndroid.show(res["message"],500);
      setGeneral(false);
    }
    
  }

  const typeClick = (name)=>{
    props.addTitle(name+"运动");
    props.navigation.navigate("movementDetail");
  }

  return (
    <ScrollView 
      style={styles.scrollContainer} 
      contentContainerStyle={styles.scrollContent}
      scrollEnabled={enableScrollViewScroll}
      backdropStyle={{backgroundColor: "white",}}
    >

      {(generalProgress)&&(<View
        style={{position:"absolute",height:1000,width:"100%",backdrop:"#aaaaaa",
        backgroundColor: "white",zIndex: 99999,justifyContent: 'flex-start',alignItems: 'center',
      }}
      >
        <View style={{height:"30%",width:"80%",marginTop:0}}>
        <Video
              source={require("../assets/plangen.mp4")}//设置视频源  
              style={{marginRight: 5 ,marginLeft: 5,height:"100%", width:"100%",marginBottom:0}}//组件样式
              resizeMode='stretch'//缩放模式
              repeat={true}//确定在到达结尾时是否重复播放视频。
        />
        </View>
        <Text style={{color:"gray",fontSize:15,marginTop:100}}>...计划生成中...</Text>
      </View>)}

      <View style={{width:"100%",height:285,backgroundColor:"white",flexDirection: 'row',marginTop:-30}}>
        <View style={{width:"50%",height:"100%",justifyContent: 'center',alignItems: 'center',position:"absolute",left:50,top:20}}>
          <Svg icon="告示栏" size="250"/>
        </View>
        <View style={{width:"50%",height:"100%",justifyContent: 'center',alignItems: 'center',position:"absolute",right:0,top:20}}>
          <Svg icon="运动看书人1" size="220"/>
        </View>
        <View style={{width:100,height:100,position: "absolute",backgroundColor: "white",left:90,top:110,justifyContent: 'center',alignItems: 'center',}}>
          <Text style={{fontSize:10,color:theme["color-primary-500"],fontFamily:'Arial'}}>{"        "}涓滴之水终可以磨损大石，
          不是由于它力量强大，而是由于昼夜不舍的滴坠.
          {"\n"}{"            "}——贝多芬</Text>
        </View>
      </View>

      <Layout style={styles.btnContainer}>
        <TouchableOpacity style={styles.touchContainer}>
          <Svg icon="评估身体" size="35" color={theme["color-primary-500"]}/>
          <Text style={{color:"grey",fontSize:10}}>评估身体</Text>
        </TouchableOpacity >

        <TouchableOpacity onPress={()=>generalPlan()}  style={styles.touchContainer}>
          {generalProgress
          ? <View style={{width:35,height:35,alignItems:"center",justifyContent:"center"}}><ActivityIndicator color="orange"/></View>
          : <Svg icon="生成计划" size="35" color={theme["color-primary-500"]}/>
          }
          <Text style={{color:"grey",fontSize:10}}>生成科学计划</Text>
        </TouchableOpacity >
      </Layout>

      <Layout style={styles.planContainer}>
        <PlanScore />
        <View style={{flexDirection:"row",justifyContent:"space-around",alignItems: 'center',width:"100%"}}>
          <Svg icon="挂钩" size="20" />
          <Svg icon="挂钩" size="20" />
        </View>
        <TodayTrainPlanCard 
          height={220} 
          onEnableScroll={setScoll}
          horizontal={false}
          showIndicator={false}/>
        <TouchableOpacity onPress={()=>navigateAddItem()}  style={btnStyle.btnAddItem}>
          {progress?<View style={{height:24}}>
          <ActivityIndicator color={theme["color-primary-500"]}/>
          </View>: <View style={{height:24}}>
            <Svg icon="修改计划" size="24"/>
          </View>}
          <Text style={{color:"grey",fontSize:10}}>修改计划</Text>
        </TouchableOpacity >

      </Layout>

      <Layout style={{height: 400,width:"100%",justifyContent:"center",alignItems: 'center',marginBottom:30,marginTop:-20}}>
          <Card style={{backgroundColor: "white",width:"90%",height:"90%",borderRadius: 10,}}>
            <View style={{height: "13%",width:"100%",
            flexDirection: 'row',justifyContent: 'center',alignItems: 'center',
            borderBottomWidth:1,borderBottomColor: "#dddddd",borderStyle:'dotted'}}>
              <Svg icon="分类" size="18" color={theme["color-primary-500"]}/>
              <Text style={{color:"gray",marginLeft:10}}>运动种类</Text>
              <View style={{height:16,width:16,backgroundColor: "white",borderRadius:10,
              position:"absolute",left:-8,bottom:-8,borderColor: "#dddddd",borderRightWidth:1}}></View>
              <View style={{height:16,width:16,backgroundColor: "white",borderRadius:10,
              position:"absolute",right:-8,bottom:-8,borderColor: "#dddddd",borderLeftWidth:1}}></View>
            </View>

            <View style={{flexWrap:"wrap",flexDirection: 'row',justifyContent: 'space-evenly',alignItems: 'center',paddingTop:15}}>
              {menus.map((item,index)=>{
                return <View
                  style={{height:90,width:"26%",borderRadius:50,justifyContent: 'center',alignItems: 'center',}}
                  key={index}
                >
                  <TouchableOpacity onPress={()=>typeClick(item.name)} style={{height:45,width:45,borderRadius: 25,borderWidth: 1,borderColor: "#eeeeee",
                  justifyContent:"center",alignItems:"center",marginBottom:5}}>
                    <Svg icon={item.name} size="35" color={theme["color-primary-500"]}/>
                  </TouchableOpacity>
                  <Text style={{fontSize:8,color:"gray"}}>{item.name}</Text>
                </View>
              })}
            </View>  

          </Card>
      </Layout>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width:"100%",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingTop: 0,
    marginTop:0
  },
  scrollContainer: {
    flexGrow: 1,
    width: "100%",
    maxHeight: "100%",
    paddingTop: 5,
    backgroundColor:"white",

  },
  scrollContent: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  btnContainer: {
    flexDirection:"row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop:10,
    marginBottom:20,
    backgroundColor:"rgb(0,0,0,0)"
  },
  planContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  touchContainer:{
    alignItems:"center",
    width:"40%",
    backgroundColor:"rgb(0,0,0,0)"
  },
});

const scoreStyles = StyleSheet.create({
  container: {
    width: "94%",
    height:"99%",
    overflow: 'hidden',
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: 'center',
    borderRadius: 100,
    marginBottom:2
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreHeader: {
    alignSelf: "center",
    fontSize: 14,
    color:"#888888"
  },
  actualScoreStyle: {
    marginLeft: 10,
    fontWeight: "bold",
    fontSize:20
  },
  totalScoreStyle: {
    color: theme["color-primary-500"],
    fontSize: 10
  },
});

const btnStyle = StyleSheet.create({
  btnAddItem: {
    height:16,
    width: "15%",
    marginTop: 5,
    marginRight: 20,
    marginBottom:50,
    alignSelf: "flex-end",
    alignItems:"center"
  },
});

const mapStateToProps = (state) =>{
  return {
    plan:state.allPlans,
    todayPlan:state.todayPlans,
    todayPlanB:state.todayPlansB,

    login:state.login
  };
}

export default connect(mapStateToProps,actions)(PlanOverview);

