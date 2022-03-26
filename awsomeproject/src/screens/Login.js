import React from 'react';
import {Input, Button, Layout, Text, Modal, Card} from '@ui-kitten/components';
import {View, Image, StyleSheet, Dimensions,ActivityIndicator} from 'react-native';
import CookieManager from '@react-native-cookies/cookies';
import {postData, getData} from '../components/FetchData';
import { connect } from "react-redux";
import * as actions from "./store/actions";

const urlAll =  "http://81.68.226.132:80/standardV/index";
const urlChoosen = "http://81.68.226.132:80/plan/index";
const urlShop="http://81.68.226.132:80/shop/";

let theToken;

const ModalContainer = props => {
  return (
    <Modal
      style={styles.modalContainer}
      visible={props.visible}
      backdropStyle={styles.backdrop}
      onBackdropPress={() => props.setVisible(false)}>
      <Card disabled={true}>
        <Text category="h6" style={{margin: 20}}>
          {props.modalInfo}
        </Text>
        <Button size="medium" onPress={() => props.setVisible(false)}>
          确定
        </Button>
      </Card>
    </Modal>
  );
};

class Login extends React.Component {
  constructor(props){
    super(props);
  }
  infos = ["无网络！请检查您的网络设置", "注册成功！","注册失败！","登录成功！"];
  state = {
    loginProgress:false,
    modalVisible: false,
    modalInfo: '',
  };
  handleEmail=(text)=>{
    this.props.addEmail(text);
  }
  handlePassword=(text)=>{
    this.props.addPwd(text);
  }
  setModalVisible = (shown) => {
    this.setState({ modalVisible: shown });
  };
  setModalInfo = (index) => {
    this.setState({ modalInfo: this.infos[index] });
  };
  setLoading = (value) => {
    this.setState({loginProgress:value});
  }

  pressCallback = async () => {
    this.setLoading(true);
    // 1. 发送请求验证密码正确
    let url = "http://81.68.226.132:80/account/login/";    
    let res = await postData(url,{email:this.props.login.email,password:this.props.login.pwd});
    let correct = res["code"]; 
    this.infos[0] =res["message"]
    theToken=res["token"];
    this.props.addToken(theToken);
    CookieManager.set(url, {
      name: 'myCookie',
      value: theToken,
      domain: '',
      path: '/',
      version: '1',
      expires: ''
    });
    if (correct==="1") {
      //成功登录跳转页面前，一次请求今日计划、所有计划、商城商品信息并加入全局state
      let resAll = await getData(urlAll,this.props.login.token);
      let resToday = await getData(urlChoosen,this.props.login.token);
      let resShop= await getData(urlShop,this.props.login.token);
      let flagAll = true;
      let flagShop = true;
      let flagToday = true;
      if(resAll["code"]!=="1") {
        this.infos[1] = resAll["message"];
        flagAll = false;
        this.setModalInfo(1);
        this.setModalVisible(true);
      } 
      if(resShop["code"]!=="1") {
        this.infos[2] = resShop["message"];
        flagShop = false;
        this.setModalInfo(2);
        this.setModalVisible(true);
      } 
      if(resToday["code"]!==1) {
        this.infos[3] = resToday["message"];
        flagToday = false;
        this.setModalInfo(3);
        this.setModalVisible(true);
      }
      if(flagAll&&flagShop&&flagToday){
        this.props.addPlan(resAll["data"]);
        this.props.addTodayDetail(resToday["data"]);
        this.props.addToday(resToday["data"].map(item => item.id));
        this.props.addShop(resShop["data"]);
        this.setLoading(false);
        this.props.navigation.navigate("MainPage");
      } 
    } else {
      // 账号密码不正确，提示
      this.setLoading(false);
      this.setModalInfo(0);
      this.setModalVisible(true);
    }
  };

  RegisterCallback =  () => {
    // 注册
    this.props.navigation.navigate("Register");
  };

  render() {
    return (
      <View>
        <Layout style={styles.vertical}>
          <Layout style={styles.headerContainer}>
            <Image
              source={require('../assets/logo-final.png')}
              style={styles.logo}
            />
            <Text category="h4">袋鼠教练</Text>
          </Layout>
          <Layout style={styles.inputsContainer}>
            <Input style={styles.input} placeholder="请输入邮箱" onChangeText={this.handleEmail} />
            <Input style={styles.input} placeholder="请输入密码" onChangeText={this.handlePassword} />
            <Button style={styles.btn} onPress={this.pressCallback}>
                    {this.state.loginProgress
                    ? <ActivityIndicator color="white"/>
                    : <Text>登录</Text>}
            </Button>
            <Button
              style={styles.btn}
              appearance="ghost"
              onPress={this.RegisterCallback}>
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
    position: 'absolute',
    width: '80%',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  // containers
  vertical: {
    height: Dimensions.get('window').height,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerContainer: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: '35%',
    marginBottom: 30,
  },
  inputsContainer: {
    width: '100%',
    height: '27%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  // details
  logo: {
    width: 80,
    height: 80,
  },
  btn: {
    width: '80%',
    textAlign: 'center',
    borderRadius: 30,
  },
  input: {
    width: '80%',
    borderRadius: 30,
  },
});
const mapStateToProps = state =>{
  return {
      login:state.login,
      todayPlan:state.todayPlans,
      plan:state.allPlans,
  };

};

export default connect(mapStateToProps,actions)(Login);
export {theToken}