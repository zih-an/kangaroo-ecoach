import React from "react";
import {
  Input,
  Button,
  Layout,
  Text,
  Modal,
  Card,
  Select,
  IndexPath,
  SelectItem,
} from "@ui-kitten/components";
import { Image, StyleSheet, Dimensions,Alert, View} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {postData, getData} from '../components/FetchData';
import { connect } from "react-redux";
import * as actions from "./store/actions";


const ModalContainer = (props) => {
  return (
    <Modal
      style={styles.modalContainer}
      visible={props.visible}
      backdropStyle={styles.backdrop}
      onBackdropPress={() => props.setVisible(false)}
    >
      <Card disabled={true}>
        <Text category="h6" style={{ margin: 20 }}>
          {props.modalInfo}
        </Text>
        <Button size="medium" onPress={() => props.setVisible(false)}>
          确定
        </Button>
      </Card>
    </Modal>
  );
};

export default class Register extends React.Component {
  // infos = ["账号未注册或密码错误！", "注册成功！","注册失败！"];
  preferList = [0,1,2,3,4,5,6,7];
  state = {
    email:'',
    password:'',
    modalVisible: false,
    modalInfo: "",
    selectedIndex:[new IndexPath(0),]
  };
  setSelectedIndex = (index) =>{
    this.setState({selectedIndex:index})
    let arr = index.map(item => item.row);
    this.preferList = arr.sort(function(a, b){return a - b});
  }
  handleEmail=(text)=>{
    this.setState({email:text})
  }
  handlePassword=(text)=>{
    this.setState({password:text})
  }
  setModalVisible = (shown) => {
    this.setState({ modalVisible: shown });
  };
  setModalInfo = (text) => {
    this.setState({ modalInfo: text });
  };

  RegisterCallback = async () => {
    // 注册

    // let url = "http://81.68.226.132:80/account/register/";  
    // let correct = await postData(url,{email:"admin",password:"123"})
    let correct = '1';
    if (correct==="1") {
        //注册成功跳转登录页面
        this.props.navigation.navigate("Login");
      } else {
        // 账号密码不正确，提示
        this.setModalInfo("注册失败");
        this.setModalVisible(true);
      }
  };
 

  render() {
    return (
      <View>
        <Layout style={styles.vertical}>
          <Layout style={styles.headerContainer}>
            <Image
              source={require("../assets/logo-final.png")}
              style={styles.logo}
            />
            <Text category="h4">袋鼠教练</Text>
          </Layout>
          <Layout style={styles.inputsContainer}>
            <Input style={styles.input} placeholder="请输入邮箱" onChangeText={this.handleEmail} />
            <Input style={styles.input} placeholder="请输入密码" onChangeText={this.handlePassword} />
            <Select style={{height:40,width:250}}
                multiSelect={true}
                selectedIndex={this.state.selectedIndex}
                value='请选择您的运动偏好'
                onSelect={(index) => this.setSelectedIndex(index)}
                caption='建议选择1-3项'
                >
                <SelectItem title='背部'/>
                <SelectItem title='臂部'/>
                <SelectItem title='腹部'/>
                <SelectItem title='肩部'/>
                <SelectItem title='手臂'/>
                <SelectItem title='腿部'/>
                <SelectItem title='胸部'/>
                <SelectItem title='腰部'/>
                <SelectItem title='耐力训练'/>
            </Select>
            <Button
              style={styles.btn}
              appearance="ghost"
              onPress={this.RegisterCallback}
            >
              注册
            </Button>
          </Layout>
          <ModalContainer
            visible={this.state.modalVisible}
            setVisible={this.setModalVisible}
            modalInfo={this.state.modalInfo}
          />
          
        </Layout>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // modal
  modalContainer: {
    position: "absolute",
    width: "80%",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  // containers
  vertical: {
    height: Dimensions.get("window").height,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  headerContainer: {
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: "35%",
    marginBottom: 30,
  },
  inputsContainer: {
    width: "100%",
    height: "27%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  // details
  logo: {
    width: 80,
    height: 80,
  },
  btn: {
    width: "80%",
    textAlign: "center",
    borderRadius: 30
  },
  input: {
    width: "80%",
    borderRadius: 30,
  },
});