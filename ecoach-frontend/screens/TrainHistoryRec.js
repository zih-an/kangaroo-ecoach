import React from "react";
import { ScrollView } from "react-native";
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import VideoCard from "../components/VideoCard";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

export default function TrainHistoryRec({ navigation }) {
  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  return (
    <ScrollView style={{ maxHeight: "100%" }}>
      <TopNavigation
        title="历史训练记录"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout
        style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}
      >
        <VideoCard></VideoCard>
        <VideoCard></VideoCard>
        <VideoCard></VideoCard>
        <VideoCard></VideoCard>
        <VideoCard></VideoCard>
        <VideoCard></VideoCard>
        <VideoCard></VideoCard>
      </Layout>
    </ScrollView>
  );
}
