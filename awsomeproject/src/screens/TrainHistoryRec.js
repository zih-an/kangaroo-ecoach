import React from "react";
import { ScrollView, Alert,StyleSheet,View } from "react-native";
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Calendar,
} from "@ui-kitten/components";
import ExeHistoryCard from "../components/ExeHistoryCard";
import { getData } from "../components/FetchData";
import { useState,useEffect } from "react";
import { connect } from "react-redux";
import { color } from "react-native-tcharts/theme/theme";

let url="http://81.68.226.132:80/exercise/date";
const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const BackFill = (props) => <Text style={{marginTop:20,marginLeft:0,color:"grey"}}>无历史记录</Text> //组件在无历史记录时显示
const HisIcon = (props) => <Icon {...props} name="heart" />;


function TrainHistoryRec(props) {
  const navigateBack = () => {
    props.navigation.goBack();
  };
  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );
  const viewReport = () => {
    props.navigation.navigate("ReportOverview");
  };
   //这里我直接先获取了今日时间用以设置日历时间的初值
  // 切换日期后重新设置theUrl更新数据
  let [data, setData] = useState([]);
  let [date, setDate] = useState(new Date());
  let [record,setRecord] = useState([]);
  let [ready,setReady] = useState(false);
  let [theUrl,setUrl]=useState(url+"?year="+date.getFullYear().toString()+"&month="+(date.getMonth()+1).toString()+"&day="+date.getDate().toString());
  const DayCell = ({ date }, style) => {
     return (<View
      style={[styles.dayContainer, style.container]}>
      <Text style={style.text}>{`${date.getDate()}`}</Text>
      { (record.includes(date.toLocaleDateString()))&&(
      <Text style={{color:"pink",marginTop:0}}>
        ✿
        </Text>)}
        { !(record.includes(date.toLocaleDateString()))&&(
      <Text style={{color:"rgba(220,38,38,0.0)"}}>
        ★
        </Text>)}
    </View>);
  };
  const DayCellOringin = ({ date }, style) => {
     return (<View
      style={[styles.dayContainer, style.container]}>
      <Text style={style.text}>{`${date.getDate()}`}</Text>
       <Text style={{color:"rgba(220,38,38,0.0)"}}>★</Text>
    </View>);
  };
  useEffect(() => { 
    if(!ready) getRecord();
    
    getResponse();

  },[date,theUrl]);
  const getRecord = async () => {

    let urlRecord ="http://81.68.226.132/exercise/all-record";
    let res = await getData(urlRecord,props.login.token);
    let datesRecord = res["data"].map((item,index)=>item.start_time);
    datesRecord = datesRecord.map((item,index)=>{let tmp = item.split('T');return tmp[0]});
    datesRecord = datesRecord.map((item,index)=>{
      let array = item.split('-');
      let s = array[1]+"/"+array[2]+"/"+array[0].slice(2);
      return s;
    })
    setRecord(datesRecord);
    setReady(true);
  };
  const getResponse = async () => {

    let localDate = date.toLocaleDateString();
    let year,month,day;
    year = "20"+localDate.slice(6);
    if(localDate.slice(0,1)==="0") month = localDate.slice(1,2);
    else month =  localDate.slice(0,2);
    if(localDate.slice(3,4)==="0") day = localDate.slice(4,5);
    else day = localDate.slice(3,5);

    setUrl(url+"?year="+year+"&month="+month+"&day="+day);
    let res = await getData(theUrl,props.login.token);
    let message = res["message"];
    if(res["code"]==="1"){
      setData(res["data"]);
    }
    else {Alert.alert(message)}
  };
  return (
    <Layout style={{ height: "100%" }}>
      <TopNavigation
        title="历史训练记录"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        {(ready)&&(<Calendar date={date} onSelect={(nextDate) => setDate(nextDate)} renderDay={DayCell}/>)}
        {(!ready)&&(<Calendar date={date} onSelect={(nextDate) => setDate(nextDate)} renderDay={DayCellOringin}/>)}
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
          <Text category="h5">运动情况</Text>
           {/* 根据获取历史记录生成运动情况 */}
          {(data.length===0)&&(<BackFill/>)}
          {(data.length!==0)&&data.map((myData,index)=>{
          return <ExeHistoryCard
          key={index}
          date={index+1}
          onPress={viewReport}
          rate={myData.id}
          content={myData.start_time}
        ></ExeHistoryCard>
        })}
        </ScrollView>
      </Layout>
    </Layout>
  );
}


const styles = StyleSheet.create({
  dayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
  },
  value: {
    fontSize: 12,
    fontWeight: '400',
  },
});


const mapStateToProps = state =>{
  return {
      login:state.login
  };

};


export default connect(mapStateToProps)(TrainHistoryRec);