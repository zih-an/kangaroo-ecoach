import React,{useState} from "react";
import { StyleSheet, TouchableOpacity, Alert,View,ScrollView,Image,ToastAndroid } from "react-native";
import {
  Layout,
  List,
  ListItem,
  Divider,
  Text,
  Icon,
  Modal,
  Button,
  Input,
  TabBar,
  Tab
} from "@ui-kitten/components";
import Svg from "../components/Svg";
import { default as theme } from "../custom-theme.json";
import CookieManager from '@react-native-cookies/cookies';
import RNRestart from 'react-native-restart'; 
import LinearGradinet from 'react-native-linear-gradient';
import { postData,getData } from "../components/FetchData";
import { color } from "react-native-tcharts/theme/theme";
import { Card } from "react-native-shadow-cards";
import Picker from 'react-native-picker';
import { connect } from "react-redux";
import * as actions from "./store/actions";
import VideoCard from "../components/VideoCard";

// const figureUrl = ""

let figureMsg = [
  {
    title: "生日",
    description: "",
  },
  {
    title: "身高",
    description: "",
  },
  {
    title: "体重",
    description: "",
  },
  {
    title: "性别",
    description: "",
  },
  {
    title: "级别",
    description: "",
  },
];

const ModalContainer = (props) => {
  const _getCurrentDate = ()=>{
    var currDate = new Date()
    var year = currDate.getFullYear()
    var month = (currDate.getMonth()+1).toString()
    month = month.padStart(2,'0')
    var dateDay = currDate.getDate().toString()
    dateDay = dateDay.padStart(2,'0')
    let time = year+'.'+month+'.'+dateDay
    return time;
  }

  const [value, setValue] = React.useState('');
  let [currentDate,setCurrentdate] = React.useState(_getCurrentDate());
  let [number,setNumber] = React.useState("0");
  let [Sex,setSex] = React.useState("♂");

  const _createDateData = () =>{
      let date = [];
      var currDate = new Date()
      var year = currDate.getFullYear()
      var month = currDate.getMonth()+1
      for(let i=1970;i<=year;i++){
          let month = [];
          for(let j = 1;j<13;j++){
              let day = [];
              if(j === 2){
                  for(let k=1;k<29;k++){
                      day.push(k+'日');
                  }
                  //Leap day for years that are divisible by 4, such as 2000, 2004
                  if(i%4 === 0){
                      day.push(29+'日');
                  }
              }
              else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
                  for(let k=1;k<32;k++){
                      day.push(k+'日');
                  }
              }
              else{
                  for(let k=1;k<31;k++){
                      day.push(k+'日');
                  }
              }
              let _month = {};
              _month[j+'月'] = day;
              month.push(_month);
          }
          let _date = {};
          _date[i+'年'] = month;
          date.push(_date);
      }
      return date;
    }

  const _createNumberData = () =>{
    let data = [];
    for(let i = 30;i<351;i++){
      data.push(i);
    }
    return data;
  }

  const _createSexData = () =>{
    return ['♂(男)','♀(女)']
  }

  //打开日期选择视图
  const _showDatePicker = () =>{
    var year = ''
    var month = ''
    var day = ''
    var dateStr = currentDate
    year = dateStr.substring(0,4)
    month = parseInt(dateStr.substring(5,7))
    day = parseInt(dateStr.substring(8,10))
    Picker.init({
      pickerTitleText:'时间选择',
      pickerCancelBtnText:'取消',
      pickerConfirmBtnText:'确定',
      selectedValue:[year+'年',month+'月',day+'日'],
      pickerBg:[255,255,255,1],
      pickerData: _createDateData(),
      pickerFontColor: [33, 33 ,33, 1],
      onPickerConfirm: (pickedValue, pickedIndex) => {
          var year = pickedValue[0].substring(0,pickedValue[0].length-1)
          var month = pickedValue[1].substring(0,pickedValue[1].length-1)
          month = month.padStart(2,'0')
          var day = pickedValue[2].substring(0,pickedValue[2].length-1)
          day = day.padStart(2,'0')
          let str = year+'.'+month+'.'+day
          setCurrentdate(str)
          setValue(str)
      },
      onPickerCancel: (pickedValue, pickedIndex) => {
      },
      onPickerSelect: (pickedValue, pickedIndex) => {
      }
    });
    Picker.show();
  }
  //打开数字选择视图
  const _showNumberPicker = () =>{
    var dateStr = "0"
    Picker.init({
      pickerTitleText:'选择',
      pickerCancelBtnText:'取消',
      pickerConfirmBtnText:'确定',
      selectedValue:[dateStr],
      pickerBg:[255,255,255,1],
      pickerData: _createNumberData(),
      pickerFontColor: [33, 33 ,33, 1],
      onPickerConfirm: (pickedValue, pickedIndex) => {
        let str = pickedValue[0]
          setNumber(str);
          if(props.title==="身高") setValue(str+'cm');
          else if(props.title==="体重") setValue(str+'Kg');
      },
      onPickerCancel: (pickedValue, pickedIndex) => {
      },
      onPickerSelect: (pickedValue, pickedIndex) => {
      }
    });
    Picker.show();
  }
  const _showSexPicker = () =>{
    var dateStr = "♂"
    Picker.init({
      pickerTitleText:'选择',
      pickerCancelBtnText:'取消',
      pickerConfirmBtnText:'确定',
      selectedValue:[dateStr],
      pickerBg:[255,255,255,1],
      pickerData: _createSexData(),
      pickerFontColor: [33, 33 ,33, 1],
      onPickerConfirm: (pickedValue, pickedIndex) => {
        let str = pickedValue[0]
          setSex(str[0]);
          setValue(str[0]);
      },
      onPickerCancel: (pickedValue, pickedIndex) => {
      },
      onPickerSelect: (pickedValue, pickedIndex) => {
      }
    });
    Picker.show();
  }
  return (
    <Modal
      style={styles.modalContainer}
      visible={props.visible}
      backdropStyle={styles.backdrop}
    >
      <Card disabled={true} style={styles.modalTitle}>
        <Text style={{height:20,color:"gray"}}>设置您的{props.title}:</Text>
        
        {(props.title==="生日")&&
        (<TouchableOpacity onPress={()=>_showDatePicker()} style={styles.modalTxt}>
            <Text style={{color:"white"}}>{currentDate}</Text>
        </TouchableOpacity>)}

        {(props.title==="身高")&&
        (<TouchableOpacity onPress={()=>_showNumberPicker()} style={styles.modalTxt}>
            <Text style={{color:"white"}}>{number}</Text>
            <Text style={{color:"white"}}>cm</Text>
        </TouchableOpacity>)}

        {(props.title==="体重")&&
        (<TouchableOpacity onPress={()=>_showNumberPicker()} style={styles.modalTxt}>
            <Text style={{color:"white"}}>{number}</Text>
            <Text style={{color:"white"}}>Kg</Text>
        </TouchableOpacity>)}

        {(props.title==="级别")&&
        (<Text style={{color:"gray",alignSelf: 'center',}}>无法修改</Text>)}

        {(props.title==="性别")&&
        (<TouchableOpacity onPress={()=>_showSexPicker()} style={styles.modalTxt}>
            <Text style={{color:"white"}}>{Sex}</Text>
        </TouchableOpacity>)}

        <View style={styles.modalBtn}>
        <Text onPress={() => {
          props.setMessage(value,props.index);
          props.setVisible(false);setValue('');setNumber("0");setSex("♂");
        }}
          style={{color:"white"}}
        >确定</Text>
        </View>
      </Card>
    </Modal>
  );
};

class Mine extends React.Component {
  constructor(props){
    super(props);
  }
  state = {
    enableScrollViewScroll: true,
    msg: figureMsg,
    visible: false,
    currentIndex: 0,
    currentTitle:"身高",
    selectedIndex: 0,
    exerciseRecent:[],
    totalTime:""
  };
  setScroll = (value) =>{
    this.setState({enableScrollViewScroll:value});
  }
  setVisible = (shown) => {
    this.setState({ visible: shown });
  };
  setCurrentIndex = (index) => {
    this.setState({ currentIndex: index });
  }
  setCurrentTitle = (title) => {
    this.setState({ currentTitle: title });
  }
  setMessage = (message,i) =>{
    let arr = this.state.msg.map((item,index)=>{
      if(index===i) return {
        title:item.title,
        description:message
      }
      else return item;
    });
    this.setState({msg:arr});
  }
  navigateTrainHistoryRec = () => {
    this.props.navigation.navigate("TrainHistoryRec");
  };
  clickBtnClear = () =>{
    this.setState({msg:figureMsg});
  }
  clickBtnQuit = () =>{
    CookieManager.clearAll().then((success) => {
      if(success) RNRestart.Restart();
    });
  }
  UNSAFE_componentWillMount(){
    this.getData();
  }
  componentDidMount(){
  }
  shouldComponentUpdate(nextProps,nextStates){
    return true;
  }
  sendData = async (value)=>{
    let urlCollect = "http://81.68.226.132:80/standardV/collect"
    let res = await postData(urlCollect,{"collect":value},this.props.login.token);
    if(res["code"]!=="1"||res["code"]!==1) {}
    else ToastAndroid.show(res["message"],500);
  }
  getData = async () =>{
    let urlRecent = "http://81.68.226.132:80/exercise/recent";
    let urlTotal = "http://81.68.226.132:80/exercise/total-time";
    let urlFigure = "http://81.68.226.132:80/account/information";
    let resRecent = await getData(urlRecent,this.props.login.token);
    let resTotal = await getData(urlTotal,this.props.login.token);
    let resFigure = await getData(urlFigure,this.props.login.token);

    this.setState({exerciseRecent:resRecent["data"]});
    this.setState({totalTime:resTotal["data"]});
    const dataFigure = resFigure["data"];
    figureMsg = figureMsg.map((item,index)=>{
      return {"title":item.title,"description":dataFigure[item.title]}
    });
    this.setState({msg:figureMsg});


  }
  _sendFigureData = async () =>{
    let urlFigure = "http://81.68.226.132:80/account/information";
    const descriptions = this.state.msg.map((item,index)=>item.description);
    const figureData = {
      "生日":"",
      "身高":"",
      "体重":"",
      "性别":"",
      "级别":"",
    };
    let counts = 0;
    let keys = Object.keys(figureData);
    for(let i of keys){
      figureData[i] = descriptions[counts];
      counts++;
    }
    counts = 0;
    let resFigure = await postData(urlFigure,figureData,this.props.login.token);
    if(resFigure["code"]===1||resFigure["code"]==="1"){}
    else ToastAndroid.show(resFigure["message"],500);

    resFigure = await getData(urlFigure,this.props.login.token);
  }
  showTab = (index) => {
    this.sendData(this.props.collect);
    if(this.state.exerciseRecent.length>0){
      var ids = this.state.exerciseRecent.map((item,index)=>item[0]);
      var counts = this.state.exerciseRecent.map((item,index)=>item[1]);
    }

  // this.componentDidMount()

    switch (index) {
      case 0:
        return <Card style={{margin:0,width:"100%",}}>
                  {(this.props.collect.length!==0)&&this.props.allPlans.filter((item,index)=>this.props.collect.includes(item.id)).map((Item,index)=>{
                  return <VideoCard
                      key={index}
                      id={Item["id"]}
                      sv_path={Item["sv_path"]}
                      sketch_sv_path={Item["sketch_sv_path"]}
                      A_intensity={Item["A_intensity"]}
                      title={Item["title"]}
                      introduction={Item["introduction"]}
                      choose={true}
                      type="collect"
                      ></VideoCard>
                })}
                {(this.props.collect.length===0)&&<View style={{padding:10,width:"100%"}}>
                    <Text style={{color:"#aaaaaa",fontSize:8}}>暂无收藏动作，可在计划页面的运动种类卡片中收藏对应部位动作...</Text>
                  </View>}
                </Card>;
      case 1:
        return <Card style={{margin:0,width:"100%",flexWrap:"wrap",flexDirection: 'row',}}>
          {(this.state.exerciseRecent.length>0)&&
          this.props.allPlans.filter((item,index)=>
          {return ids.includes(item.id)&&counts[index]>0}).map((item,index)=>{
            return <View style={{height:40,width:"100%",margin:"2%",flexDirection: 'row',alignItems: 'center',}} key={index}>
              <Svg icon="notice" size="25"/>
              <View style={{height:30,width:"50%",justifyContent: 'flex-start',alignItems:"center",flexDirection: 'row',marginLeft:10
              }}><Text style={{fontSize:15,color:"black"}}>{item.title}</Text></View>

              <View style={{height:30,width:"30%",justifyContent: 'center',alignItems:"center",flexDirection: 'row',
              }}><Text style={{fontSize:10,color:"#aaaaaa"}}>最近练过</Text>
              <Text style={{color:theme["color-primary-500"]}}>{counts[index]}</Text>
              <Text style={{fontSize:10,color:"#aaaaaa"}}>次</Text>
              </View>

            </View>
          })}
          {this.state.exerciseRecent.length===0&&<View style={{padding:10,width:"100%"}}>
                    <Text style={{color:"#aaaaaa",fontSize:8}}>最近没有锻炼...</Text>
                  </View>}
          {this.props.allPlans.filter((item,index)=>{return ids.includes(item.id)&&counts[index]>0}).length===0&&
          <View style={{padding:10,width:"100%"}}>
          <Text style={{color:"#aaaaaa",fontSize:8}}>最近没有锻炼...</Text>
          </View>
          }
        </Card>;
    }
  };
  renderItem = ({ item, index }) => {
      return (
        <ListItem
          style={{height:75,backgroundColor:"rgb(0,0,0,0)",marginTop:10}}
          title={item.title}
          description={item.description}
          accessoryLeft={<Svg icon={item.title} size="25" color={theme["color-primary-500"]} />}
          // onPress={() => {this.setVisible(true);this.setCurrentIndex(index);this.setCurrentTitle(item.title)}}
          onPress={() => {ToastAndroid.show("暂时不可更改！",500);}}
          key={index}
        />
      );
    };
    setMsg = (obj) =>{
      this.setState({msg:obj});
    }
  render() {
    return (
      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={this.state.enableScrollViewScroll}
      >
        <View style={{height:180,width:"100%", borderBottomRadius: 20}}>
          <LinearGradinet
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            colors={['#FB8C6F' ,'#FF826C','#F8D49B']}
            style={styles.profileCard}
          >
            <View style={{flexDirection:"row"}}>
              <View style={styles.photo}>
              <Image
                style={{ width:"100%",height: "100%"}}
                source={require('../assets/avatar.png')}
                resizeMode='contain'
                />
              </View>
              <Card
              style={styles.totalTime}>
                <Text style={{color:theme["color-primary-500"],fontSize:10,position: "absolute",top:10,left:25}}>运动总时长</Text>
                <Text style={{color:theme["color-primary-500"],fontSize:35,fontWeight: "bold",}}>{this.state.totalTime}</Text>
                <Text style={{color:theme["color-primary-500"],fontSize:10,position: "absolute",top:60,left:100}}>分钟</Text>
              </Card>
            </View>

            <View style={styles.footerFunc}>
              <View  style={styles.iconFunc}>
                <Svg icon="历史记录" size="15" color={theme["color-primary-100"]}/>
                <Text style={{fontSize:12, color:"white"}} onPress={this.navigateTrainHistoryRec}>历史记录</Text>
                </View>
              <View
                style={styles.iconFunc}
              >
                <Svg icon="删除" size="15" color={theme["color-primary-100"]}/>
                <Text style={{fontSize:12, color:"white",}} onPress={this.clickBtnClear}>清空身体数据</Text>
              </View>
              <View
                style={styles.iconFunc}
              >
                <Svg icon="退出" size="15" color={theme["color-primary-100"]}/>
                <Text style={{fontSize:12, color:"white"}} onPress={this.clickBtnQuit}>退出登录</Text>
              </View>
            </View>

          </LinearGradinet>
        </View>

        <Card style={styles.figuredataCard}>
          <View style={styles.figureData}>
            {/* <View style={{height:"100%",width:"100%",flexDirection:"row"}}> */}
              <Svg icon="评估身体" size="15" color="gray"/>
              <Text style={{fontSize:12,color:"gray"}}>身体数据</Text>
            {/* </View> */}
          </View>
          <List
            style={{width:"95%" ,backgroundColor: "rgb(0,0,0,0)",marginTop: -10,}}
            data={this.state.msg}
            ItemSeparatorComponent={Divider}
            renderItem={this.renderItem}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </Card>

        <View style={{width:"100%",alignItems: 'flex-start'}}>
          <View style={styles.medal}>
            <Svg icon="级别" size="15" color="gray"/>
            <Text style={{color:"gray",fontSize:15}}>成就勋章</Text>
          </View>
          <View style={{marginTop:10,width:"95%",flexDirection:"row",alignItems: 'center',marginLeft:10,justifyContent: 'space-evenly',}}>
            <Svg icon="额外任务成就1天" size="45"/>
            <Svg icon="额外任务成就3天" size="45"/>
            <Svg icon="额外任务成就灰色7天" size="45"/>
            <Svg icon="额外任务成就灰色15天" size="45"/>
            <Svg icon="额外任务成就灰色60天" size="45"/>
          </View>
        </View>

        <View style={styles.details}>
          <Layout style={{backgroundColor: "rgb(0,0,0,0)",}}>
            <TabBar
              selectedIndex={this.state.selectedIndex}
              onSelect={(selectedIndex) => this.setState({ selectedIndex })}
              style={{backgroundColor: "rgb(0,0,0,0)",}}
            >
              <Tab title="我的收藏" />
              <Tab title="最近常练" />
              {/* <Tab title="身体评估" /> */}
            </TabBar>
            {this.showTab(this.state.selectedIndex)}
          </Layout>
      </View>

        <ModalContainer
          visible={this.state.visible}
          setVisible={this.setVisible}
          index={this.state.currentIndex}
          setMessage={this.setMessage}
          title={this.state.currentTitle}
          msg={this.state.msg}
          token={this.props.login.token}
          setMsg={this.setMsg}
        />

      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    height: "100%",
    padding:10,
    backgroundColor: "white",
  },
  scrollContainer: {
    flexGrow: 1,
    width: "100%",
    maxHeight: "100%",
    padding: 12,
    backgroundColor: "white",
  },
  scrollContent: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  profileCard:{
    width: "100%", 
    height: "100%",
    borderRadius: 20,
    zIndex: 999
  },
  photo:{
    height:80,
    width:80,
    backgroundColor: "white",
    borderRadius: 40,
    marginTop:20,
    marginLeft:20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: "white",
  },
  modalTitle:{
    backgroundColor: "white",
    width:"100%",
    justifyContent:"center",
    alignItems:"center",
    borderRadius: 15,
    padding:20,
    backgroundColor:"white",
    borderWidth:1,
    borderColor:"salmon"
  },
  modalTxt:{
    height:40,
    width:"120%",
    justifyContent:"center",
    backgroundColor: "salmon",
    alignItems: 'center',
    marginTop:10,
    marginBottom:10,
    flexDirection:"row"
  },
  modalBtn:{
    width:60,
    height: 30,
    borderWidth:2,
    borderColor:"salmon",
    justifyContent:"center",
    alignItems:"center",
    backgroundColor: "salmon",
    borderRadius: 15,
  },
  totalTime:{
    height:80,
    width:150,
    backgroundColor: "white",
    borderRadius: 40,
    marginTop:20,
    marginLeft:55,
    justifyContent:"center",
    alignItems:"center"
  },
  footerFunc:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"space-between",
    marginTop:35
  },
  iconFunc:{
    width:"33%",
    paddingRight:15,
    justifyContent: 'center',
    alignItems:"center"
  },
  figuredataCard:{
    width:"100%",
    height:100,
    borderRadius:30,
    marginTop:-5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  figureData:{
    alignItems: 'flex-start',
    width:"100%",
    paddingLeft:30,
    paddingBottom:5,
    borderBottomWidth:1,
    borderColor:"#BDFCC9",
    borderRadius: 50,
    flexDirection: 'row',
    paddingTop:10,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  medal:{
    width:"100%",
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:20,
    borderRadius:40,
    borderBottomWidth:1,
    borderColor:"salmon"
  },
  details:{ 
    // height: 300, 
    width:"100%",
    marginTop:20,
    marginBottom:20,
    backgroundColor: "rgb(0,0,0,0)",
  },
  modalContainer: {
    position: "absolute",
    width: "70%",
    height:200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: "rgb(255,255,255,0.5)",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

const mapStateToProps = state =>{
  return {
      login:state.login,
      todayPlansDetail:state.todayPlansDetail,
      collect:state.collect,
      allPlans:state.allPlans,
      plansIndex:state.allPlansIndex,
  };
};
export default connect ( mapStateToProps,actions)(Mine);