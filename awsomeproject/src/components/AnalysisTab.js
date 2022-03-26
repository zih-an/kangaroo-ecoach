import React from "react";
import { ScrollView, View, StyleSheet,Dimensions } from "react-native";
import { Layout, Text, ViewPager, Icon } from "@ui-kitten/components";
import StarGroup from "./StarGroup";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import RadarMap from "./RadarMap";
import { default as theme } from "../custom-theme.json";

const ForwardIcon = (props) => (
  <Icon
    {...props}
    name="arrow-ios-forward-outline"
    fill={theme["color-primary-500"]}
    style={styles.iconStyle}
  />
);
const BackIcon = (props) => (
  <Icon
    {...props}
    name="arrow-ios-back-outline"
    fill={theme["color-primary-500"]}
    style={styles.iconStyle}
  />
);
export default function HLMomentTab(props) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  return (
    <Layout>
      <View style={{
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        margin: 5,}}>
        <BackIcon />
          <Text category="h6">{String(selectedIndex + 1)} / 3 </Text>
        <ForwardIcon />
      </View>
      <ViewPager
      selectedIndex={selectedIndex}
      onSelect={index => setSelectedIndex(index)}>
      <Layout
        style={styles.tab}
        level='2'>
        <Text style={{ height: 80 }}>数据分析图放在这里</Text>
        <RadarMap
              items={[
                { content: '认知', percent: 0.7 },
                { content: '健康', percent: 0.5 },
                { content: '心理', percent: 0.5 },
                { content: '沟通', percent: 0.6 },
                { content: '信用', percent: 0.8 },
              ]}
            />
      </Layout>
      <Layout
        style={styles.tab}
        level='2'>
        <Text style={{ height: 80 }}>数据图在这里</Text>
        <View>
            <Text>Bezier Line Chart</Text>
            <LineChart
              data={{
                labels: ["January", "February", "March", "April", "May", "June"],
                datasets: [
                  {
                    data: [
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100
                    ]
                  }
                ]
              }}
              width={Dimensions.get("window").width} // from react-native
              height={220}
              yAxisLabel="$"
              yAxisSuffix="k"
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#ffa726",
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726"
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          </View>
      </Layout>
      <Layout
        style={styles.tab}
        level='2'>
        <Text category='h5'>TRANSACTIONS</Text>
      </Layout>
    </ViewPager>
  </Layout>
  );
}
const styles = StyleSheet.create({
  tab: {
    height: '100%',
    alignItems: "center",
    justifyContent:'flex-start',
  },
  iconStyle: {
    width: 50,
    height: 50,
  },
});