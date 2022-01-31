import React from "react";
import { ScrollView } from "react-native";
import { Layout, Text } from "@ui-kitten/components";
import StarGroup from "./StarGroup";

export default function HLMomentTab(props) {
  return (
    <Layout
      style={{
        height: "93%",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <Text style={{ height: 200 }}>雷达图放在这里</Text>
    </Layout>
  );
}
