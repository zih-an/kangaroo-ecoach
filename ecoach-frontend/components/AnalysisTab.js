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
      <Text style={{ height: 200 }}>数据分析图放在这里</Text>
      <StarGroup rate={4} />
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
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium
          numquam soluta ea dolores recusandae itaque enim tempora molestias.
          Dignissimos, veritatis fuga recusandae accusamus quae tenetur
          voluptates! Beatae expedita quod, vel alias magni quidem pariatur
          iusto. At possimus, nobis cupiditate tempore ipsum non corporis esse
          quos officia cumque minus excepturi, voluptatem alias autem omnis.
          Ratione accusamus vero libero perferendis, nisi a, distinctio nesciunt
          voluptates id vitae animi, unde quo delectus quia sequi consequatur.
          Provident necessitatibus dolore assumenda voluptatum ab facilis, fugit
          asperiores voluptates maxime quae neque unde illum exercitationem
          debitis doloremque commodi a fuga dignissimos amet, tempora ipsum
          minima consequatur itaque.
        </Text>
      </ScrollView>
    </Layout>
  );
}
