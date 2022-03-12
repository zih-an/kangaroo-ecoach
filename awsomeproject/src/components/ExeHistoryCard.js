import React from "react";
import { Layout, Text } from "@ui-kitten/components";
import StarGroup from "./StarGroup";
import { default as theme } from "../custom-theme.json";
import { TouchableOpacity } from "react-native";

export default function ExeHistoryCard(props) {
  return (
    <TouchableOpacity onPress={props.onPress} style={{ flex: 1 }}>
      <Layout style={{ flexDirection: "row", margin: 10, width: "100%" }}>
        <Text
          category="h6"
          style={{
            flex: 1,
            backgroundColor: theme["color-primary-500"],
            color: "#fff",
            width: 30,
            textAlign: "center",
            marginRight: 20,
            alignSelf: "flex-start",
          }}
        >
        {props.date}
        </Text>
        <Layout
          style={{
            flex: 7,
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <StarGroup rate={props.rate} />
          <Text category="p1">
            {props.content}
          </Text>
        </Layout>
      </Layout>
    </TouchableOpacity>
  );
}
