import React from "react";
import { ScrollView, View, StyleSheet,Dimensions} from "react-native";
import { Layout, Text, ViewPager, Icon,IndexPath,Select,SelectItem,TopNavigationAction,  } from "@ui-kitten/components";
import ScatterChartScreen from "../components/ScatterChartScreen";
import PieChartScreen from "../components/PieChartScreen";
import RadarChartScreen from "../components/RadarChartScreen";
import LineChartScreen from "../components/LineChartScreen";
import TimeSeriesLineChartScreen from "../components/TimeSeriesLineChartScreen"
import Svg from "../components/Svg"

import dataSets from "../assets/dataSets"
import newest from "../assets/newest"
import { connect } from "react-redux";
import * as actions from "./store/actions";


let dataAll = newest["data"];
let typesId = dataAll.map((item,index)=>{return item.id});
let SplitData = dataAll.map((item,index)=>{return item.data});
let ScatterData = SplitData.map((item,index)=>{return item.scorebypart});
let PieData = SplitData.map((item,index)=>{return item.completeness});
let LineData = SplitData.map((item,index)=>{return item.exerciseIntensity});
let DTWdata = SplitData.map((item,index)=>{return item["DTW"]});


const BackIcon = props => <Icon {...props} name="arrow-back" />;

function SportOverview(props) {
  const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
  const [loaded,setLoaded] = React.useState(false);
  const typesName = props.plansIndex.filter((item,index)=>typesId.includes(index+1));
  const displayValue = typesName[selectedIndex.row];

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
    const calculateAver=(data)=>{
      let scoreArr =  data;
      let keys = Object.keys(scoreArr);
      let counts = 0;
      for(let i of keys){
        let sum = scoreArr[i].reduce(function (a,b){return a+b});
        sum = sum/(scoreArr[i].length);
        counts += sum;
      }
      return counts/3;
    };
   const calculateInten=(data)=>{
      let scoreArr =  data;
      let sum = scoreArr.reduce(function (a,b){return a+b});
      sum = sum/(scoreArr.length);
      return sum;
   };
   const calculateComp=(data)=>{
    let counts = 0;
    let len = data.length;
    for(let i=0;i<len;i++){
      if(data[i]===true) counts++;
    }
    return (counts/len)*100;
   };
  return (
    <Layout>
      <Layout style={{minHeight: 48,width:"100%",marginLeft:"1%",marginTop:10,flexDirection:"row"}} level='1'>
        <View style={{width:40,alignItems:"center",justifyContent:"center"}}>
         <BackAction/>
        </View>
      <Select
        style={{width:200,marginLeft:"12%"}}
        value={displayValue}
        selectedIndex={selectedIndex}
        onSelect={index => setSelectedIndex(index)}>
          {typesName.map((item,index)=><SelectItem key={index} title={item}/>)}
      </Select>
    </Layout>
      {typesId.map((item,index)=>
        {
          let averageScore = calculateAver(ScatterData[index]);
          let rhythmData = DTWdata[index].score;
          let intensity = calculateInten(LineData[index]);
          let complete = calculateComp(PieData[index]);
          return ((selectedIndex.row === index)&&(<Layout
          style={styles.tab}
          level='2'
          key={index}>
          <ScrollView 
              style={styles.scrollContainer} 
              contentContainerStyle={styles.scrollContent}
              onMomentumScrollEnd = {(e)=>_contentViewScroll(e)}
              >
              <View style={styles.card}>
                <View style={styles.sportTime}>
                        <View style={styles.timeView}>
                            <Text style={styles.time}>09:13:35</Text>
                            <Text style={styles.timeType}>开始时间</Text>
                        </View>
                        <View style={styles.timeView}>
                            <Text style={styles.time}>00:22:03</Text>
                            <Text style={styles.timeType}>用时</Text>
                        </View>
                        <View style={styles.timeView}>
                            <Text style={styles.time}>167</Text>
                            <Text style={styles.timeType}>千卡</Text>
                        </View>
                    </View>
              </View>
              <View style={styles.card}>
                <View style={styles.title}>
                  <Svg icon="雷达图" size="20"/>
                  <Text style={styles.text}>数据总览</Text>
                </View>
                <RadarChartScreen
                stanData = {averageScore}
                rhythmData = {rhythmData}
                intensityData = {intensity}
                completeData = {complete}
                />
              </View>

              <View style={styles.card}>
                <View style={styles.title}>
                  <Svg icon="分数" size="17"/>
                  <Text style={styles.text}>部位得分</Text>
                  </View>
                <ScatterChartScreen scatterData={ScatterData[index]}></ScatterChartScreen>
              </View>

              <View style={styles.card}>
                <View style={styles.title}>
                  <Svg icon="汗量强度" size="17"/>
                  <Text style={styles.text}>运动强度</Text></View>
                {(loaded)&&<LineChartScreen lineData={LineData[index]}></LineChartScreen>}
              </View>

              <View style={styles.card}>
                <View style={styles.title}>
                  <Svg icon="本月完成度" size="17"/>
                  <Text style={styles.text}>动作完成度</Text></View>
                {(loaded)&&<PieChartScreen completeness={PieData[index]}></PieChartScreen>}
              </View>

              <View style={styles.card}>
                <View style={styles.title}>
                  <Svg icon="节奏" size="17"/>
                  <Text style={styles.text}>动作快慢</Text></View>
                {(loaded)&&<TimeSeriesLineChartScreen dtwData={DTWdata[index]}></TimeSeriesLineChartScreen>}
              </View>

          </ScrollView>
        </Layout>))}
      )}
  </Layout>
  );
}
const styles = StyleSheet.create({
  tab: {
    height: "100%",
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
  card:{
    width:"95%",
    marginTop:10,
    marginBottom:10,
    borderRadius:20,
    borderWidth:1,
    borderColor:"mistyrose",
    backgroundColor:"#ffffff",
    overflow:'hidden',
    alignItems:'center'
  },
  title:{
    flexDirection:"row",
    justifyContent:"flex-start",
    alignItems:'center',
    width:"100%",
    marginBottom:5,
    paddingLeft:10,
    borderBottomWidth:1,
    borderBottomColor:"mistyrose"
  },
  text:{ 
    height: 25,
    marginLeft:10,
    fontSize:13,
    includeFontPadding: false,
    textAlignVertical: 'center',   
    color:"rgba(0, 0, 0, 0.8)"
  },
  sportTime:{
      width:"100%",
      flexDirection:"row",
      justifyContent:"center",
      alignItems:"center",
  },
  timeView:{
      width:"30%",
      flexDirection:"column",
      alignItems:"center"
  },
  time:{
      color:"grey",
      fontSize:15,
  },
  timeType:{
      color:'black',
      fontSize:12
  },
  scrollContent: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  }
});

const mapStateToProps = state =>{
  return {
      login:state.login,
      plansIndex:state.allPlansIndex,
  };

};

export default connect(mapStateToProps,actions)(SportOverview);