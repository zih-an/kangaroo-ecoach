import React,{useState} from "react";
import { StyleSheet, TouchableOpacity, Alert,View } from "react-native";
import {
  Layout,
  List,
  ListItem,
  Divider,
  Text,
  Icon,
  Modal,
  Card,
  Button,
  Input,
} from "@ui-kitten/components";
import Svg from "../components/Svg";
import { default as theme } from "../custom-theme.json";
import CookieManager from '@react-native-cookies/cookies';
import RNRestart from 'react-native-restart'; 

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
      {
        title: "历史记录",
        description: "",
      },
      {
        title: "清空所有数据",
      },
      {
        title: "退出登录",
      },
    ],
    visible: false,
    currentIndex: 0,
    currentTitle:"身高",
  };
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
  clickBtn = () =>{
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
  renderItem = ({ item, index }) => {
    if (index === this.state.msg.length - 3) {
      // 查看历史训练记录
      return (
        <ListItem
          title={(evaProps) => (
            <View style={{flexDirection:"row",alignItems: 'center',justifyContent: 'flex-end',}}>
              <Svg icon={item.title} size="15" color={theme["color-primary-500"]}/>
              <Text
              {...evaProps}
              style={[evaProps.style, { color: theme["color-primary-500"],
              alignSelf: "flex-end", }]}
            >
              {item.title}
            </Text>
            </View>
          )}
          description={item.description}
          onPress={this.navigateTrainHistoryRec}
        />
      );
    } else if (index === this.state.msg.length - 2) {
      // 清空数据
      return (
        <ListItem
          style={{ backgroundColor: "transparent" }}
          title={(evaProps) => (
            <TouchableOpacity onPress={this.clickBtn}>
              <Text
              {...evaProps}
              style={[
                evaProps.style,
                {
                  color: theme["color-primary-500"],
                  alignSelf: "flex-end",
                },
              ]}
            >
              {item.title}
            </Text>
            </TouchableOpacity>
          )}
        />
      );
    }else if (index === this.state.msg.length - 1) {
      // 清空数据
      return (
        <ListItem
          style={{ backgroundColor: "transparent" }}
          title={(evaProps) => (
            <TouchableOpacity onPress={this.clickBtnQuit}>
              <Text
              {...evaProps}
              style={[
                evaProps.style,
                {
                  color: theme["color-primary-500"],
                  alignSelf: "flex-end",
                },
              ]}
            >
              {item.title}
            </Text>
            </TouchableOpacity>
          )}
        />
      );
    } 
    else {
      return (
        <ListItem
          style={{height:75}}
          title={item.title}
          description={item.description}
          accessoryLeft={<Svg icon={item.title} size="25" color={theme["color-primary-500"]} />}
          onPress={() => {this.setVisible(true);this.setCurrentIndex(index);this.setCurrentTitle(item.title)}}
        />
      );
    }
  };

  render() {
    return (
      <Layout style={styles.container}>
        <List
          data={this.state.msg}
          ItemSeparatorComponent={Divider}
          renderItem={this.renderItem}
        />
        <ModalContainer
          visible={this.state.visible}
          setVisible={this.setVisible}
          index={this.state.currentIndex}
          setMessage={this.setMessage}
          title={this.state.currentTitle}
        />
      </Layout>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  modalContainer: {
    position: "absolute",
    width: "80%",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
