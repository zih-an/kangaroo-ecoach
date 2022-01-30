import React from "react";
import { StyleSheet } from "react-native";
import {
  Layout,
  Text,
  Button,
  Card,
  Divider,
  TopNavigation,
} from "@ui-kitten/components";
import { default as theme } from "../custom-theme.json";
import TodayTrainPlanCard from "../components/TodayTrainPlanCard";

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

export default function PlanOverview({ navigation }) {
  const navigateAddItem = () => {
    navigation.navigate("AddItem");
  };

  return (
    <Layout style={styles.container}>
      <Layout style={styles.planContainer}>
        <TodayTrainPlanCard />
        <Button
          style={btnStyle.btnAddItem}
          size="medium"
          status="primary"
          appearance="outline"
          onPress={navigateAddItem}
        >
          自定义添加项目
        </Button>
      </Layout>
      <PlanScore />
      <Layout style={styles.btnContainer}>
        <Button style={btnStyle.btn}>评估身体</Button>
        <Button style={btnStyle.btn}>制定完整计划</Button>
      </Layout>
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
    width: "70%",
    borderWidth: 0,
    // backgroundColor: theme["color-info-800"],
    margin: 5,
    borderRadius: 30,
  },
});

// import React from "react";
// import { SafeAreaView } from "react-native";
// import { Button, Divider, Layout, TopNavigation } from "@ui-kitten/components";

// const HomeScreen = ({ navigation }) => {
//   const navigateDetails = () => {
//     navigation.navigate("AddItem");
//   };

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <TopNavigation title="MyApp" alignment="center" />
//       <Divider />
//       <Layout
//         style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
//       >
//         <Button onPress={navigateDetails}>OPEN DETAILS</Button>
//       </Layout>
//     </SafeAreaView>
//   );
// };

// export default HomeScreen;
