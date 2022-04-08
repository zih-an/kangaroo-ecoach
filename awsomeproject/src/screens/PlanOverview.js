import React,{useState} from "react";
import { StyleSheet,ActivityIndicator } from "react-native";
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
import { connect } from "react-redux";
import * as actions from "./store/actions";
import {getData} from "../components/FetchData"
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
      <Layout style={styles.planContainer}>
        <TodayTrainPlanCard />
        <Button
          style={btnStyle.btnAddItem}
          size="small"
          status="primary"
          appearance="outline"
          onPress={()=>navigateAddItem()}
        >
          {progress?<ActivityIndicator color="orange"/>:<Text>修改计划</Text>}
        </Button>
      </Layout>
      <PlanScore />
      <Layout style={styles.btnContainer}>
        <Button style={btnStyle.btn}>评估身体</Button>
        <Button style={btnStyle.btn} onPress={()=>generalPlan()}>
        {generalProgress? 
        <ActivityIndicator color="white"/>
                    : <Text>生成科学计划</Text>}
          </Button>
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
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingTop: 10,
  },
  btnContainer: {
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
  btn: {
    width: "80%",
    margin: 5,
    borderRadius: 30,
  },
  btnAddItem: {
    width: "25%",
    borderWidth: 0,
    // backgroundColor: theme["color-info-800"],
    margin: 5,
    marginRight: 20,
    borderRadius: 30,
    alignSelf: "flex-end",
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

