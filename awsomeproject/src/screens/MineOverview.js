import React,{useState} from "react";
import { StyleSheet, TouchableOpacity,View,ScrollView,Image,ToastAndroid } from "react-native";
import {
  Layout,
  List,
  ListItem,
  Divider,
  Text,
  TabBar,
  Tab
} from "@ui-kitten/components";
import Svg from "../components/Svg";
import { default as theme } from "../custom-theme.json";
import CookieManager from '@react-native-cookies/cookies';
import RNRestart from 'react-native-restart'; 
import LinearGradinet from 'react-native-linear-gradient';
import { postData,getData } from "../components/FetchData";
import { Card } from "react-native-shadow-cards";
import { connect } from "react-redux";
import * as actions from "./store/actions";
import VideoCard from "../components/VideoCard";
import {ModalContainerFigure} from "../components/Modals";
import {ModalContainerAvatar} from "../components/Modals";
import {ModalContainerName} from "../components/Modals";

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

class Mine extends React.Component {
  constructor(props){
    super(props);
  }
  state = {
    enableScrollViewScroll: true,
    msg: figureMsg,
    visible: false,
    visibleAvatar:false,
    visibleName:false,
    avatarPath:"",
    currentIndex: 0,
    currentTitle:"身高",
    selectedIndex: 0,
    exerciseRecent:[],
    totalTime:"",
    nickname:"",
    ranks:[0,0,0,0,0],
  };
  setName = (value) =>{
    this.setState({nickname:value});
  }
  setScroll = (value) =>{
    this.setState({enableScrollViewScroll:value});
  }
  setVisible = (shown) => {
    this.setState({ visible: shown });
  };
  setVisibleAvatar = (shown) => {
    this.setState({ visibleAvatar: shown });
  };
  setVisibleName = (shown) =>{
    this.setState({ visibleName: shown });
  }
  setAvatarPath = (value) =>{
    this.setState({ avatarPath: value });
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
  clickBtnFigure = () =>{
    this._sendFigureData();
  }
  clickBtnName = async () =>{
    let urlFigure = "http://120.46.128.131:8000/account/nickname";
    let resName = await postData(urlFigure,{"nickname":this.state.nickname},this.props.login.token);
    if(resName["code"]===1||resName["code"]==="1"){ToastAndroid.show(resName["message"],500)}
    else ToastAndroid.show(resName["message"],500);
  }
  componentDidMount(){
    this.getData();
  }

  sendData = async (value)=>{
    let urlCollect = "http://120.46.128.131:8000/standardV/collect"
    let res = await postData(urlCollect,{"collect":value},this.props.login.token);
    if(res["code"]!=="1"||res["code"]!==1) {}
    else ToastAndroid.show(res["message"],500);
  }
  getData = async () =>{
    let urlRecent = "http://120.46.128.131:8000/exercise/recent";
    let urlTotal = "http://120.46.128.131:8000/exercise/total-time";
    let urlFigure = "http://120.46.128.131:8000/account/information";
    let urlName = "http://120.46.128.131:8000/account/nickname";
    let resRecent = await getData(urlRecent,this.props.login.token);
    let resTotal = await getData(urlTotal,this.props.login.token);
    let resFigure = await getData(urlFigure,this.props.login.token);
    let resName = await getData(urlName,this.props.login.token);

    this.setState({exerciseRecent:resRecent["data"]});
    this.setState({totalTime:resTotal["data"]});
    this.setState({nickname:resName["data"]});
    const dataFigure = resFigure["data"];
    figureMsg = figureMsg.map((item,index)=>{
      return {"title":item.title,"description":dataFigure[item.title]}
    });
    this.setState({msg:figureMsg});
    let url = "http://120.46.128.131:8000/account/avatar";   
    let resAvatar = await getData(url,this.props.login.token);
    this.setState({avatarPath:resAvatar["img"]});
    switch(dataFigure["级别"]){
      case "入门": this.setState({ranks:[1,0,0,0,0]});break;
      case "进阶": this.setState({ranks:[1,1,0,0,0]});break;
      case "强化": this.setState({ranks:[1,1,1,0,0]});break;
      case "大牛": this.setState({ranks:[1,1,1,1,0]});break;
      case "大神": this.setState({ranks:[1,1,1,1,1]});break;
    }
  }
  _sendFigureData = async () =>{
    let urlFigure = "http://120.46.128.131:8000/account/information";
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
    if(resFigure["code"]===1||resFigure["code"]==="1"){ToastAndroid.show(resFigure["message"],500)}
    else ToastAndroid.show(resFigure["message"],500);

    resFigure = await getData(urlFigure,this.props.login.token);

  }
  showTab = (index) => {
    this.sendData(this.props.collect);
      var ids = this.state.exerciseRecent.map((item,index)=>{return item[0]});
      var counts = this.state.exerciseRecent.map((item,index)=>{
        let str = item[0];
        return {[str]:item[1]}});
      let obj={}
      for(let i=0;i<5;i++){
        obj = Object.assign(obj,counts[i]);
      }
      counts = obj;
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
          {/* {(this.state.exerciseRecent.length>0)&& */}
          {this.props.plansIndex.filter((item,index)=>
          {return ids.includes(item.id)}).map((item,index)=>{
            return (counts[item.id.toString()]>0)&&<View style={{height:40,width:"100%",margin:"2%",flexDirection: 'row',alignItems: 'center',}} key={index}>
              <Svg icon="notice" size="25"/>
              <View style={{height:30,width:"50%",justifyContent: 'flex-start',alignItems:"center",flexDirection: 'row',marginLeft:10
              }}><Text style={{fontSize:15,color:"black"}}>{item.title}</Text></View>

              <View style={{height:30,width:"30%",justifyContent: 'center',alignItems:"center",flexDirection: 'row',
              }}><Text style={{fontSize:10,color:"#aaaaaa"}}>最近练过</Text>
              <Text style={{color:theme["color-primary-500"]}}>{counts[item.id.toString()]}</Text>
              <Text style={{fontSize:10,color:"#aaaaaa"}}>次</Text>
              </View>

            </View>
          })}
          {this.props.plansIndex.filter((item,index)=>{return ids.includes(item.id)&&counts[item.id.toString()]>0}).length===0&&
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
          onPress={() => {
            if(index===4) ToastAndroid.show("不可更改！",500);
            else {
              this.setVisible(true);
              this.setCurrentIndex(index);
              this.setCurrentTitle(item.title)
              }}}
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
              <View style={{flexDirection:"column"}}>
                <TouchableOpacity style={styles.photo} onPress={()=>this.setVisibleAvatar(true)}>
                <Image
                  style={{ width:"100%",height: "100%"}}
                  source={{uri:this.state.avatarPath}}
                  resizeMode='contain'
                  />
                  <View style={{position: "absolute",height: 23,width:23,
                  backgroundColor:"transparent",borderRadius: 30,left:28,top:57,borderWidth: 2,borderColor: "#bbbbbb",
                  alignItems: 'center',
                  justifyContent: 'center',
                  }}>
                  <Svg icon="相机" size="17" color="#bbbbbb"/>
                  </View>
                </TouchableOpacity>
                <View style={{width:100,height:20,
                    flexDirection:"row" ,marginLeft:25,marginRight:-40,marginTop:1,alignItems: 'center',
                    }} >
                  <Svg icon="修改计划" size="10" color="white"/>
                  <Text style={{height:30,color:"white",fontWeight:"bold",fontSize:20,width: 150,}}
                    onPress={()=>this.setVisibleName(true)}
                    >{this.state.nickname}</Text>
                  <Card style={{width:40,height:16,marginTop: 10,
                    borderWidth: 1,flexDirection: 'row',marginLeft:80,
                    borderColor: theme["color-primary-500"],justifyContent: 'center',alignItems: 'center',}}>
                      <Text 
                      style={{fontSize:8,color:theme["color-primary-500"],fontWeight:"bold",
                      }}
                      onPress={()=>this.clickBtnName()}>保存昵称</Text></Card>
                </View>
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
            <Card style={{width:60,height:18,marginLeft:"50%"}}><Text 
            style={{fontSize:12,color:theme["color-primary-500"]}}
            onPress={()=>this.clickBtnFigure()}>保存修改</Text></Card>
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
            <Svg icon="级别" size="15" color={theme["color-primary-500"]}/>
            <Text style={{color:"gray",fontSize:15}}>成就勋章</Text>
          </View>
          <View style={{marginTop:10,width:"95%",flexDirection:"row",alignItems: 'center',marginLeft:10,justifyContent: 'space-evenly',}}>
            {this.state.ranks[0]===1?<Svg icon="额外任务成就1天" size="45"/>:<Svg icon="额外任务成就灰色1天" size="45"/>}
            {this.state.ranks[1]===1?<Svg icon="额外任务成就3天" size="45"/>:<Svg icon="额外任务成就灰色3天" size="45"/>}
            {this.state.ranks[2]===1?<Svg icon="额外任务成就7天" size="45"/>:<Svg icon="额外任务成就灰色7天" size="45"/>}
            {this.state.ranks[3]===1?<Svg icon="额外任务成就15天" size="45"/>:<Svg icon="额外任务成就灰色15天" size="45"/>}
            {this.state.ranks[4]===1?<Svg icon="额外任务成就60天" size="45"/>:<Svg icon="额外任务成就灰色60天" size="45"/>}
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
            </TabBar>
            {this.showTab(this.state.selectedIndex)}
          </Layout>
      </View>

        <ModalContainerFigure
          visible={this.state.visible}
          setVisible={this.setVisible}
          index={this.state.currentIndex}
          setMessage={this.setMessage}
          title={this.state.currentTitle}
          msg={this.state.msg}
          token={this.props.login.token}
          setMsg={this.setMsg}
        />
        <ModalContainerAvatar
          visible={this.state.visibleAvatar}
          setVisible={this.setVisibleAvatar}
          token={this.props.login.token}
          setAvatarPath={this.setAvatarPath}
        />
        <ModalContainerName
          visible = {this.state.visibleName}
          setVisible = {this.setVisibleName}
          setVal = {this.setName}
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
    marginTop:10,
    marginLeft:20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: "white",
  },
  totalTime:{
    height:80,
    width:150,
    backgroundColor: "white",
    borderRadius: 40,
    marginTop:10,
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