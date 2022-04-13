import React,{useState} from "react";
import { StyleSheet,ActivityIndicator,View,TouchableOpacity } from "react-native";
import {
  Layout,
  Text,
  Button,
  Card,
  Divider,
  TopNavigation,
  Modal,
} from "@ui-kitten/components";
import { default as theme } from "../custom-theme.json";
import TodayTrainPlanCard from "../components/TodayTrainPlanCard";
import RowDataCard from "../components/RowDateCard";
import { connect } from "react-redux";
import * as actions from "./store/actions";
import {getData} from "../components/FetchData";
import Svg from "../components/Svg";
const ModalContainer1 = (props) => {
  return (
    <Modal
      style={styles.modalContainer}
      visible={props.visible}
      backdropStyle={styles.backdrop}
      onBackdropPress={() => props.setVisible(false)}
    >
      <Card disabled={true}>
        <Text category="h6" style={{ margin: 20 }}>
          {props.code}
          {props.message}
        </Text>
        <Button size="medium" onPress={() => props.setVisible(false)}>
          确定
        </Button>
      </Card>
    </Modal>
  );
};


const PlanScore = (props) => {
  return (
    <Card style={scoreStyles.container}>
      <Text category="h6" style={scoreStyles.scoreHeader}>
        计划评分
      </Text>
      <Layout style={scoreStyles.scoreContainer}>
        <Text category="h1" style={scoreStyles.actualScoreStyle}>
          90
        </Text>
        <Text category="h5" style={scoreStyles.totalScoreStyle}>
          {" "}
          / 100
        </Text>
      </Layout>
    </Card>
  );
};

function PlanOverview(props) {
  const [modalVisible1,setModalVisible1]=useState(false);
  const [theCode,setTheCode]=useState('0');
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
          setTheCode("生成完毕");
          setGeneral(false);
          setModalVisible1(true);
        },1500)   
      }
      else{
        setTheCode(resToday["message"]);
        setGeneral(false);
        setModalVisible1(true);
      }
    }
    else{
      setTheCode(res["message"]);
      setGeneral(false);
      setModalVisible1(true);
    }
    
  }
  return (
    <Layout style={styles.container}>
      <View style={{width:"100%",height:80,backgroundColor:"white",marginTop:-50,marginBottom:-30}}>
        <RowDataCard
        horizontal={true}
        showIndicator={false}/>
      </View>
      <Layout style={styles.planContainer}>
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
      <PlanScore />
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
      <ModalContainer1
        visible={modalVisible1}
        setVisible={setModalVisible1}
        code={theCode}
      />
    </Layout>
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
  btnContainer: {
    flexDirection:"row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
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
    width:"40%"
  },
});

const scoreStyles = StyleSheet.create({
  container: {
    borderColor: theme["color-info-800"],
    borderBottomWidth: 10,
    width: "90%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreHeader: {
    alignSelf: "center",
  },
  actualScoreStyle: {
    fontWeight: "bold",
  },
  totalScoreStyle: {
    color: theme["color-primary-500"],
  },
});

const btnStyle = StyleSheet.create({
  btnAddItem: {
    height:16,
    width: "15%",
    marginTop: 5,
    marginRight: 20,
    alignSelf: "flex-end",
    alignItems:"center"
  },
});

const mapStateToProps = (state) =>{
  return {
    plan:state.allPlans,
    todayPlan:state.todayPlans,
    login:state.login
  };
}

export default connect(mapStateToProps,actions)(PlanOverview);

