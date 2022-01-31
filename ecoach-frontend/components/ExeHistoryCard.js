import React from "react";
import { Icon, Layout, Text } from "@ui-kitten/components";
import { default as theme } from "../custom-theme.json";
import { TouchableHighlight, TouchableOpacity } from "react-native";

const StarIcon = (props) => (
  <Icon {...props} style={{ width: 15, height: 15 }} name="star" />
);
const StarGroup = (props) => {
  return (
    <Layout style={{ flexDirection: "row" }}>
      <StarIcon fill={theme["color-primary-500"]} />
      <StarIcon fill={theme["color-primary-500"]} />
      <StarIcon fill="gray" />
      <StarIcon fill="gray" />
      <StarIcon fill="gray" />
    </Layout>
  );
};

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
          <StarGroup />
          <Text category="p1">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus
            maxime similique.
          </Text>
        </Layout>
      </Layout>
    </TouchableOpacity>
  );
}
