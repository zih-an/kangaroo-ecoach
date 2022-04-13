import React,{useState} from "react";
import { StyleSheet, TouchableOpacity, Alert,View,ScrollView } from "react-native";
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


const HomeIcon = (props) => (
  <Icon
    {...props}
    name="arrow-ios-forward-outline"
    fill={theme["color-primary-500"]}
    style={{ width: 20, height: 20 }}
  />
);

const ModalContainer = (props) => {
  const [value, setValue] = React.useState('');
  return (
    <Modal
      style={styles.modalContainer}
      visible={props.visible}
      backdropStyle={styles.backdrop}
      onBackdropPress={() => props.setVisible(false)}
    >
      <Card disabled={true}>
        <Text style={{height:20}}>设置您的{props.title}</Text>
        {(props.title==="生日")&&
        (<Input
          style={{height:50,width:250,marginTop:20}}
          placeholder='2020.1.29'
          value={value}
          onChangeText={nextValue => setValue(nextValue)}
        />)}
        {(props.title==="身高")&&
        (<Input
          style={{height:50,width:250,marginTop:20}}
          placeholder='177cm'
          value={value}
          onChangeText={nextValue => setValue(nextValue)}
        />)}
        {(props.title==="体重")&&
        (<Input
          style={{height:50,width:250,marginTop:20}}
          placeholder='60kg'
          value={value}
          onChangeText={nextValue => setValue(nextValue)}
        />)}
        {(props.title==="级别")&&
        (<Input
          style={{height:50,width:250,marginTop:20}}
          placeholder='鼠崽/鼠王'
          value={value}
          onChangeText={nextValue => setValue(nextValue)}
        />)}
        {(props.title==="性别")&&
        (<Input
          style={{height:50,width:250,marginTop:20}}
          placeholder='男鼠/女鼠'
          value={value}
          onChangeText={nextValue => setValue(nextValue)}
        />)}
        
        <Button onPress={() => {props.setVisible(false);props.setMessage(value,props.index);setValue('')}}>确定</Button>
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
        description: "女鼠",
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
  // state = { selectedIndex: 0 };
  showTab = (index) => {
    switch (index) {
      case 0:
        return <Card style={{margin:10,width:200}}><Text>1</Text></Card>;
      case 1:
        // return <PostTab navigation={this.props.navigation}/>;
        return <Card style={{margin:10,width:200}}><Text>2</Text></Card>;
      case 2:
        // return <HLMomentTab navigation={this.props.navigation}/>;
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
        <View style={{height:180,width:"100%", borderBottomRadius: 20,}}>
          <LinearGradinet
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            colors={['#FB8C6F' ,'#FF826C','pink','#F8D49B']}
            style={{width: "100%", height: "100%",borderRadius: 20}}
          >
            <View style={{flexDirection:"row"}}>
              <View style={{height:80,width:80,backgroundColor: "white",borderRadius: 40,marginTop:20,marginLeft:20}}>
              </View>
              <View style={{height:80,width:200,backgroundColor: "white",borderRadius: 40,marginTop:20,marginLeft:20,
              justifyContent:"center",alignItems:"center"}}>
                <Text style={{color:"pink"}}>运动总时长</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row',alignItems: 'center',justifyContent:"space-between",marginTop:35}}>
              <View  style={{width:"30%",justifyContent: 'center',alignItems:"center",}}>
              <Svg icon="历史记录" size="15" color={theme["color-primary-100"]}/>
              <Text style={{fontSize:12, color:"white"}} onPress={this.navigateTrainHistoryRec}>历史记录</Text></View>
              <View
                style={{width:"33%",paddingLeft:20}}
              ><Text style={{fontSize:12, color:"salmon"}} onPress={this.clickBtnClear}>清空所有数据</Text></View>
              <View
                style={{width:"30%",paddingLeft:20}}
              ><Text style={{fontSize:12, color:"salmon"}} onPress={this.clickBtnQuit}>退出登录</Text></View>
            </View>
          </LinearGradinet>
        </View>
        <Card style={{width:"100%",height:100,borderRadius:30,marginTop:30,justifyContent: 'center',alignItems: 'center',}}>
          <View style={{alignItems: 'flex-start',
          width:"100%",
          paddingLeft:30,
          paddingBottom:5,
          borderBottomWidth:1,
          borderColor:"#BDFCC9",
          borderRadius: 50,}}>
          <Text style={{fontSize:12,color:"gray",paddingTop:5,}}>身体数据</Text>
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
        <View style={{width:"100%",alignItems: 'flex-start',}}>
          <View style={{width:"100%",alignItems: 'center',
          justifyContent: 'center',marginTop:20,
          borderRadius:40,borderBottomWidth:1,
          borderColor:"salmon"}}>
            <Text style={{color:"gray",fontSize:12}}>成就勋章</Text>
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
        <View style={{ height: 300, width:"100%",marginTop:20,marginBottom:20,backgroundColor: "rgb(0,0,0,0)",}}>
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
    padding:10
  },
  scrollContainer: {
    flexGrow: 1,
    width: "100%",
    maxHeight: "98%",
    padding: 12,
  },
  scrollContent: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  modalContainer: {
    position: "absolute",
    width: "80%",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
