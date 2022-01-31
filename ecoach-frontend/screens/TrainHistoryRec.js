import React from "react";
import { ScrollView } from "react-native";
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Calendar,
} from "@ui-kitten/components";
import ExeHistoryCard from "../components/ExeHistoryCard";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

export default function TrainHistoryRec({ navigation }) {
  const navigateBack = () => {
    navigation.goBack();
  };
  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  const viewReport = () => {
    navigation.navigate("ReportOverview");
  };
  const [date, setDate] = React.useState(new Date());

  return (
    <Layout style={{ height: "100%" }}>
      <TopNavigation
        title="历史训练记录"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Calendar date={date} onSelect={(nextDate) => setDate(nextDate)} />
        <ScrollView
          style={{
            flexGrow: 1,
            margin: 10,
          }}
          contentContainerStyle={{
            width: "100%",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Text category="h5">运动情况</Text>
          <ExeHistoryCard
            date="1"
            onPress={viewReport}
            rate={1}
          ></ExeHistoryCard>
          <ExeHistoryCard
            date="2"
            onPress={viewReport}
            rate={2}
          ></ExeHistoryCard>
          <ExeHistoryCard
            date="3"
            onPress={viewReport}
            rate={5}
          ></ExeHistoryCard>
          <ExeHistoryCard
            date="4"
            onPress={viewReport}
            rate={3}
          ></ExeHistoryCard>
          <ExeHistoryCard
            date="5"
            onPress={viewReport}
            rate={3}
          ></ExeHistoryCard>
          <ExeHistoryCard
            date="6"
            onPress={viewReport}
            rate={4}
          ></ExeHistoryCard>
          <ExeHistoryCard
            date="7"
            onPress={viewReport}
            rate={2}
          ></ExeHistoryCard>
        </ScrollView>
      </Layout>
    </Layout>
  );
}
