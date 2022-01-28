import React from "react";
import { Layout, Text } from "@ui-kitten/components";
import { View } from "react-native";

export default function HeaderFlag(props) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-end",
        height: 80,
        width: "100%",

        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,

        elevation: 1,
      }}
    >
      <Text category="h5">袋鼠教练</Text>
    </View>
  );
}
