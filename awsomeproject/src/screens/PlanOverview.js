import React,{useState} from "react";
import { StyleSheet } from "react-native";
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
          计划为
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

function PlanOverview({ navigation }) {
  const navigateAddItem = () => {
    navigation.navigate("AddItem");
  };
  const [modalVisible1,setModalVisible1]=useState(false);
  const [theCode,setTheCode]=useState('0');
  const generalPlan=()=>{
    let correct = "1";
    if(correct==="1"){
      setTheCode("生成完毕，请查看计划");
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
          onPress={navigateAddItem}
        >
          修改计划
        </Button>
      </Layout>
      <PlanScore />
      <Layout style={styles.btnContainer}>
        <Button style={btnStyle.btn}>评估身体</Button>
        <Button style={btnStyle.btn} onPress={generalPlan}>生成科学计划</Button>
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
    // width: "70%",
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
    todayPlan:state.todayPlans
  };
}

export default connect(mapStateToProps,actions)(PlanOverview);

