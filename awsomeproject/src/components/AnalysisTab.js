import React from "react";
import { ScrollView, View, StyleSheet,Dimensions} from "react-native";
import { Layout, Text, ViewPager, Icon,IndexPath,Select,SelectItem,TopNavigationAction,  } from "@ui-kitten/components";
import StarGroup from "./StarGroup";
import {
  LineChart,
} from "react-native-chart-kit";
import RadarMap from "./RadarMap";
import { default as theme } from "../custom-theme.json";
import ScatterChartScreen from "./ScatterChartScreen";
import PieChartScreen from "./PieChartScreen";

const BackIcon = props => <Icon {...props} name="arrow-back" />;

export default function HLMomentTab(props) {
  const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
  const [loaded,setLoaded] = React.useState(false);
  const navigateBack = () => {props.navigation.goBack();};

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );
  const _contentViewScroll=(e)=>{
      //  上拉触底
      var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
      var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
      var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度

      if (offsetY + oriageScrollHeight >= contentSizeHeight){
        setLoaded(true);
      }else if(offsetY + oriageScrollHeight <= 1){
        //这个是没有数据了然后给了false  得时候还在往上拉
      }else if(offsetY == 0){
      //这个地方是下拉刷新，意思是到顶了还在指行，可以在这个地方进行处理需要刷新得数据
      }
    }
  return (
    <Layout>
      <Layout style={{minHeight: 48,width:"100%",marginLeft:"1%",marginTop:10,flexDirection:"row"}} level='1'>
        <View style={{width:40,alignItems:"center",justifyContent:"center"}}>
         <BackAction/>
        </View>
      <Select
        style={{width:200,marginLeft:"12%"}}
        selectedIndex={selectedIndex}
        onSelect={index => setSelectedIndex(index)}>
        <SelectItem title='Option 1'/>
        <SelectItem title='Option 2'/>
        <SelectItem title='Option 3'/>
      </Select>
    </Layout>
     
      {(selectedIndex.row === 0)&&(<Layout
        style={styles.tab}
        level='2'>
        <ScrollView 
            style={styles.scrollContainer} 
            contentContainerStyle={styles.scrollContent}
            onMomentumScrollEnd = {(e)=>_contentViewScroll(e)}
            >
            {/* <ScatterChartScreen></ScatterChartScreen> */}
            {/* <Line></Line> */}
            <Text style={{ height: 30 }}>雷达图</Text>
            <RadarMap
              items={[
                { content: '认知', percent: 0.7 },
                { content: '健康', percent: 0.5 },
                { content: '心理', percent: 0.5 },
                { content: '沟通', percent: 0.6 },
                { content: '信用', percent: 0.8 },
              ]}
            />
            <Text style={{ height: 30 }}>散点图</Text>
            {/* <Animated.View
            style={{width:350}}
            > */}
            <ScatterChartScreen></ScatterChartScreen>
            {/* </Animated.View> */}
            <Text style={{ height: 30 }}>折线图</Text>
            <LineChart
                data={{
                  labels: ["January", "February", "March", "April", "May", "June"],
                  datasets: [
                    {
                      data: [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                      ]
                    }
                  ]
                }}
                width={360} // from react-native
                height={200}
                yAxisLabel="$"
                yAxisSuffix="k"
                yAxisInterval={3} // optional, defaults to 1
                chartConfig={{
                  // backgroundColor: "white",
                  backgroundGradientFrom: "#F5FCFF",
                  backgroundGradientTo: "#F5FCFF",
                  decimalPlaces: 1, // optional, defaults to 2dp
                  color: (opacity = 1) => `rgba(0, 0, 0, 0.05)`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, 0.3)`,
                  style: {
                    borderRadius: 16
                  },
                  propsForDots: {
                    r: "1",
                    strokeWidth: "2",
                    stroke: "#e67e22"
                  }
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}
            />
            <Text style={{ height: 30 }}>饼状图</Text>
            {(loaded)&&<PieChartScreen></PieChartScreen>}
        </ScrollView>
      </Layout>)}

      {(selectedIndex.row === 1)&&(<Layout
        style={styles.tab}
        level='2'>
        <Text style={{ height: 80 }}>数据图在这里</Text>
        <View>
            <Text>Bezier Line Chart</Text>
          </View>
      </Layout>)}
      
      {(selectedIndex.row === 2)&&(<Layout
        style={styles.tab}
        level='2'>
        <Text category='h5'>TRANSACTIONS</Text>
      </Layout>)}
  </Layout>
  );
}
const styles = StyleSheet.create({
  tab: {
    height: "93%",
    alignItems: "center",
    justifyContent:'flex-start',
  },
  iconStyle: {
    width: 50,
    height: 50,
  },
  scrollContainer: {
    flexGrow: 1,
    width: "100%",
    maxHeight: "83%",
    padding: 5,
  }, 
  scrollContent: {
    width: "100%",
            justifyContent: "flex-start",
            alignItems: "center",
  }
});