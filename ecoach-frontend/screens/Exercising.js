import React from "react";
import { StyleSheet, View } from "react-native";
import { Layout, Text, Button } from "@ui-kitten/components";
import { default as theme } from "../custom-theme.json";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Exercising({ navigation }) {
  return (
    <SafeAreaView>
      <Button onPress={() => navigation.goBack()}>Quit Exercising</Button>
      <Text>
        Exercising!!!! Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        Laborum consequatur deleniti eos impedit nesciunt voluptas sit similique
        perferendis distinctio corrupti tenetur incidunt, vitae accusamus ipsum
        doloribus unde, corporis natus amet!
      </Text>
    </SafeAreaView>
  );
}
