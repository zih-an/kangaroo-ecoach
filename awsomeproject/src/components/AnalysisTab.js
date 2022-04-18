import React from "react";
import { ScrollView, View, StyleSheet,Dimensions,Image} from "react-native";
import { Layout, Text, ViewPager, Icon,IndexPath,Select,SelectItem,TopNavigationAction,  } from "@ui-kitten/components";
import ScatterChartScreen from "./ScatterChartScreen";
import PieChartScreen from "./PieChartScreen";
import RadarChartScreen from "./RadarChartScreen";
import LineChartScreen from "./LineChartScreen";
import TimeSeriesLineChartScreen from "./TimeSeriesLineChartScreen"
import Svg from "./Svg"
import LinearGradinet from 'react-native-linear-gradient';
import { Card } from "react-native-shadow-cards";

import dataSets from "../assets/dataSets"
import newest from "../assets/newest"
import { connect } from "react-redux";
import * as actions from "../screens/store/actions";


const BackIcon = props => <Icon {...props} name="arrow-back" />;

function HLMomentTab(props) {
  const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
  const [loaded,setLoaded] = React.useState(false);
  const [dataAll,setDataAll] = React.useState(JSON.parse(props.report).data);
  const [typesId,setTypesId] = React.useState([]);
  const [scatterData,setScatter] = React.useState([{}]);
  const [pieData,setPie] = React.useState([[]]);
  const [lineData,setLine] = React.useState([[]]);
  const [dtwData,setDTW] = React.useState([{}]);
  const typesName = props.plansIndex.filter((item,index)=>typesId.includes(item.id)).map((item,index)=>item.title);
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
      return sum*12;
   };
   const calculateComp=(data)=>{
    let counts = 0;
    let len = data.length;
    for(let i=0;i<len;i++){
      if(data[i]===true) counts++;
    }
    return (counts/len)*100;
   };

   React.useEffect(() => { 
   let typesId = dataAll.map((item,index)=>{return item.id});
   let SplitData = dataAll.map((item,index)=>{return item.data});
   let ScatterData = SplitData.map((item,index)=>{return item.scorebypart});
   let PieData = SplitData.map((item,index)=>{return item.completeness});
   let LineData = SplitData.map((item,index)=>{return item.exerciseIntensity});
   let DTWdata = SplitData.map((item,index)=>{return item["DTW"]});

   setTypesId(typesId);

   setScatter(ScatterData);

   setPie(PieData);

   setLine(LineData);
   
   setDTW(DTWdata);

 },[dataAll]);
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
          let averageScore = calculateAver(scatterData[index]);
          let rhythmData = dtwData[index].score;
          let intensity = calculateInten(lineData[index]);
          let complete = calculateComp(pieData[index]);
          return ((selectedIndex.row === index)&&(<Layout
          style={styles.tab}
          level='2'
          key={index}>
          <ScrollView 
              style={styles.scrollContainer} 
              contentContainerStyle={styles.scrollContent}
              onMomentumScrollEnd = {(e)=>_contentViewScroll(e)}
              >
              <LinearGradinet
                  start={{x: 0.5, y: 0}}
                  end={{x: 0.5, y: 1}}
                  colors={['#FF826C','#F8D49B','white']}
                  style={{width:"100%",height:250,borderRadius:40,zIndex:999}}
                >
              <Image
              style={{ width:"100%",height: 250,position:"absolute",top:-25,left:-40}}
              source={require('../assets/planall.png')}
              resizeMode='contain'
              />
              <Image
              style={{ width:"100%",height: 250,position:"absolute",top:20,left:40}}
              source={require('../assets/3dgirl.png')}
              resizeMode='contain'
              />
              <View style={{width:60,alignItems:"center",justifyContent:"center",position:"absolute",top:20,right:30,flexDirection: 'row',}}>
                  {/* <BackAction/> */}
                  {/* <Text style={{color:"white",fontSize:10}}>本次运动</Text> */}
                  <Text style={{color:"white",fontSize:30,fontWeight:"bold"}}>{parseInt(complete)}</Text>
                  <Text style={{color:"white",fontSize:10,marginLeft:5}}>分</Text>

                </View>
              </LinearGradinet>
              <Card style={styles.card}>
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
              </Card>

              <Card style={styles.card}>
                <View style={styles.title}>
                  <Svg icon="分数" size="17"/>
                  <Text style={styles.text}>部位得分</Text>
                  </View>
                <ScatterChartScreen scatterData={scatterData[index]}></ScatterChartScreen>
              </Card>

              <Card style={styles.card}>
                <View style={styles.title}>
                  <Svg icon="汗量强度" size="17"/>
                  <Text style={styles.text}>运动强度</Text></View>
                {(loaded)&&<LineChartScreen lineData={lineData[index]}></LineChartScreen>}
              </Card>

              <Card style={styles.card}>
                <View style={styles.title}>
                  <Svg icon="本月完成度" size="17"/>
                  <Text style={styles.text}>动作完成度</Text></View>
                {(loaded)&&<PieChartScreen completeness={pieData[index]}></PieChartScreen>}
              </Card>

              <Card style={styles.card}>
                <View style={styles.title}>
                  <Svg icon="节奏" size="17"/>
                  <Text style={styles.text}>动作快慢</Text></View>
                {(loaded)&&<TimeSeriesLineChartScreen dtwData={dtwData[index]}></TimeSeriesLineChartScreen>}
              </Card>

          </ScrollView>
        </Layout>))}
      )}
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
  card:{
    width:"95%",
    marginBottom:10,
    borderRadius:20,
    borderWidth:1,
    borderColor:"#eeeeee",
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
    borderBottomColor:"#eeeeee"
  },
  text:{ 
    height: 25,
    marginLeft:10,
    fontSize:13,
    includeFontPadding: false,
    textAlignVertical: 'center',   
    color:"rgba(0, 0, 0, 0.8)"
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
      report:state.report,
  };

};

export default connect(mapStateToProps,actions)(HLMomentTab);