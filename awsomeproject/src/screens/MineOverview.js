import React,{useState} from "react";
import { StyleSheet, TouchableOpacity, Alert,View,ScrollView,Image } from "react-native";
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
import { color } from "react-native-tcharts/theme/theme";
import { Card } from "react-native-shadow-cards";
import Picker from 'react-native-picker';

const HomeIcon = (props) => (
  <Icon
    {...props}
    name="arrow-ios-forward-outline"
    fill={theme["color-primary-500"]}
    style={{ width: 20, height: 20 }}
  />
);

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
    //console.log('dateStr',dateStr)
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
          // console.log('date', pickedValue, pickedIndex);
      },
      onPickerSelect: (pickedValue, pickedIndex) => {
          // console.log('date', pickedValue, pickedIndex);
      }
    });
    Picker.show();
  }
  //打开数字选择视图
  const _showNumberPicker = () =>{
    var dateStr = "0"
    //console.log('dateStr',dateStr)
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
          setValue(str);
      },
      onPickerCancel: (pickedValue, pickedIndex) => {
          // console.log('date', pickedValue, pickedIndex);
      },
      onPickerSelect: (pickedValue, pickedIndex) => {
          // console.log('date', pickedValue, pickedIndex);
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
          // console.log('date', pickedValue, pickedIndex);
      },
      onPickerSelect: (pickedValue, pickedIndex) => {
          // console.log('date', pickedValue, pickedIndex);
      }
    });
    Picker.show();
  }

  return (
    <Modal
      style={styles.modalContainer}
      visible={props.visible}
      backdropStyle={styles.backdrop}
      // onBackdropPress={() => props.setVisible(false)}
    >
      <Card disabled={true} style={{backgroundColor: "white",width:"100%",justifyContent:"center",
      alignItems:"center",borderRadius: 15,padding:20,backgroundColor:"white",borderWidth:1,borderColor:"salmon"}}>
        {/* <Text style={{height:20,color:"gray",marginTop:10}}>设置您的{props.title}:</Text> */}
        <Text style={{height:20,color:"gray"}}>设置您的{props.title}:</Text>
        {/* <TouchableOpacity onPress={()=>_showDatePicker()} style={{height:40,width:"120%",justifyContent:"center",
        backgroundColor: "salmon",alignItems: 'center',marginTop:10,marginBottom:10}}>
            <Text style={{color:"white"}}>{currentDate}</Text>
        </TouchableOpacity> */}
        
        {(props.title==="生日")&&
        (<TouchableOpacity onPress={()=>_showDatePicker()} style={{height:40,width:"120%",justifyContent:"center",
        backgroundColor: "salmon",alignItems: 'center',marginTop:10,marginBottom:10,flexDirection:"row"}}>
            <Text style={{color:"white"}}>{currentDate}</Text>
        </TouchableOpacity>)}

        {(props.title==="身高")&&
        (<TouchableOpacity onPress={()=>_showNumberPicker()} style={{height:40,width:"120%",justifyContent:"center",
        backgroundColor: "salmon",alignItems: 'center',marginTop:10,marginBottom:10,flexDirection:"row"}}>
            <Text style={{color:"white"}}>{number}</Text>
            <Text style={{color:"white"}}>cm</Text>
        </TouchableOpacity>)}

        {(props.title==="体重")&&
        (<TouchableOpacity onPress={()=>_showNumberPicker()} style={{height:40,width:"120%",justifyContent:"center",
        backgroundColor: "salmon",alignItems: 'center',marginTop:10,marginBottom:10,flexDirection:"row"}}>
            <Text style={{color:"white"}}>{number}</Text>
            <Text style={{color:"white"}}>Kg</Text>
        </TouchableOpacity>)}

        {(props.title==="级别")&&
        (<Input
          style={{height:50,width:250,marginTop:20}}
          placeholder='鼠崽/鼠王'
          value={value}
          onChangeText={nextValue => setValue(nextValue)}
        />)}

        {(props.title==="性别")&&
        (<TouchableOpacity onPress={()=>_showSexPicker()} style={{height:40,width:"120%",justifyContent:"center",
        backgroundColor: "salmon",alignItems: 'center',marginTop:10,marginBottom:10,flexDirection:"row"}}>
            <Text style={{color:"white"}}>{Sex}</Text>
        </TouchableOpacity>)}

        <View style={{width:60,height: 30,borderWidth:2,borderColor:"salmon",justifyContent:"center",alignItems:"center",
        backgroundColor: "salmon",borderRadius: 15,}}>
        <Text onPress={() => {props.setVisible(false);props.setMessage(value,props.index);setValue('');setNumber("0");setSex("♂")}}
          style={{color:"white"}}
        >确定</Text>
        </View>
      </Card>
    </Modal>
  );
};

export default class Mine extends React.Component {
  state = {
    enableScrollViewScroll: true,
    msg: [
      {
        title: "生日",
        description: "2022.1.29",
      },
      {
        title: "身高",
        description: "177cm",
      },
      {
        title: "体重",
        description: "60kg",
      },
      {
        title: "性别",
        description: "♀",
      },
      {
        title: "级别",
        description: "鼠崽",
      },
    ],
    visible: false,
    currentIndex: 0,
    currentTitle:"身高",
    selectedIndex: 0
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
    let arr = this.state.msg.map((item,index)=>{
      return {
        title:item.title,
        description:''
      }
    });
    this.setState({msg:arr});
  }
  clickBtnQuit = () =>{
    CookieManager.clearAll().then((success) => {
      if(success) RNRestart.Restart();
    });
  }
  showTab = (index) => {
    switch (index) {
      case 0:
        return <Card style={{margin:10,width:200}}><Text>1</Text></Card>;
      case 1:
        return <Card style={{margin:10,width:200}}><Text>2</Text></Card>;
      case 2:
        return <Card style={{margin:10,width:200}}><Text>3</Text></Card>;
    }
  };
  renderItem = ({ item, index }) => {
      return (
        <ListItem
          style={{height:75,backgroundColor:"rgb(0,0,0,0)",marginTop:10}}
          title={item.title}
          description={item.description}
          accessoryLeft={<Svg icon={item.title} size="25" color={theme["color-primary-500"]} />}
          onPress={() => {this.setVisible(true);this.setCurrentIndex(index);this.setCurrentTitle(item.title)}}
        />
      );
    };

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
            colors={['#FB8C6F' ,'#FF826C','pink','#F8D49B']}
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
              <View style={styles.totalTime}>
                <Text style={{color:"pink"}}>运动总时长</Text>
              </View>
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
                <Text style={{fontSize:12, color:"white",}} onPress={this.clickBtnClear}>清空所有数据</Text>
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
          <Text style={{fontSize:12,color:"gray",paddingTop:5}}>身体数据</Text>
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
            <Text style={{color:"gray",fontSize:15}}>成就勋章</Text>
          </View>
          <View style={{marginTop:10,width:"95%",flexDirection:"row",alignItems: 'center',marginLeft:10}}>
            <Svg icon="首次运动" size="45" color="salmon"/>
            <Svg icon="首次运动" size="45"/>
            <Svg icon="首次运动" size="45"/>
            <Svg icon="首次运动" size="45"/>
            <Svg icon="首次运动" size="45"/>
            <Svg icon="首次运动" size="45"/>
            <Svg icon="首次运动" size="45"/>
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
              <Tab title="身体评估" />
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
  totalTime:{
    height:80,
    width:200,
    backgroundColor: "white",
    borderRadius: 40,
    marginTop:20,
    marginLeft:20,
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
    alignItems: 'center'
  },
  figureData:{
    alignItems: 'flex-start',
    width:"100%",
    paddingLeft:30,
    paddingBottom:5,
    borderBottomWidth:1,
    borderColor:"#BDFCC9",
    borderRadius: 50
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
    height: 300, 
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
