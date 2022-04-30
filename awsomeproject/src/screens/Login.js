import React from 'react';
import {Input, Button, Layout, Text, Card,Icon,} from '@ui-kitten/components';
import {View, Image, StyleSheet, Dimensions,ActivityIndicator,TouchableWithoutFeedback,ToastAndroid} from 'react-native';
import CookieManager from '@react-native-cookies/cookies';
import {postData, getData} from '../components/FetchData';
import { connect } from "react-redux";
import * as actions from "./store/actions";

const urlAll =  "http://120.46.128.131:8000/standardV/index";
const urlChoosen = "http://120.46.128.131:8000/plan/index";
const urlShop="http://120.46.128.131:8000/shop/";
const urlCollect = "http://120.46.128.131:8000/standardV/collect";

let theToken;

class Login extends React.Component {
  constructor(props){
    super(props);
  }
  state = {
    loginProgress:false,
    secureTextEntry:true,
  };
  handleEmail=(text)=>{
    this.props.addEmail(text);
  }
  handlePassword=(text)=>{
    this.props.addPwd(text);
  }
  setLoading = (value) => {
    this.setState({loginProgress:value});
  }

  pressCallback = async () => {
    this.setLoading(true);
    // 1. 发送请求验证密码正确
    let url = "http://120.46.128.131:8000/account/login/";    
    let res = await postData(url,{email:this.props.login.email,password:this.props.login.pwd});
    let correct = res["code"]; 
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
    if (correct==="1"||correct===1) {
      //成功登录跳转页面前，一次请求今日计划、所有计划、商城商品信息并加入全局state
      let resAll = await getData(urlAll,this.props.login.token);
      let resToday = await getData(urlChoosen,this.props.login.token);
      let resShop= await getData(urlShop,this.props.login.token);
      let resCollect= await getData(urlCollect,this.props.login.token);

      let flagAll = true;
      let flagShop = true;
      let flagToday = true;
      let flagCollect = true;
      // let flagAvatar = true;
      // if(resAvatar["code"])
      if(resAll["code"]!=="1") {
        // flagAll = false;
        ToastAndroid.show(resAll["message"],500);
      } 
      if(resShop["code"]!=="1") {
        // flagShop = false;
        ToastAndroid.show(resShop["message"],500);
      } 
      if(resToday["code"]!==1) {
        // flagToday = false;
        ToastAndroid.show(resToday["message"],500);
      }
      if(resCollect["code"]!==1||resCollect["code"]!=="1"){
        // flagCollect = false;
        ToastAndroid.show(resCollect["message"],500);
      }
      if(flagAll&&flagShop&&flagToday&&flagCollect){

        if(Array.isArray(resAll["data"])) 
          {
            this.props.addPlan(resAll["data"]);
            this.props.addPlanIndex(resAll["data"]);
          }
        else ToastAndroid.show("数据库错误！运动详情获取失败",500);

        if(Array.isArray(resToday["data"])) 
          {
            this.props.addTodayDetail(resToday["data"]);
            this.props.addToday(resToday["data"].map(item => item.id));
            this.props.addTodayB(resToday["data"].map(item => item.id));
          }
        else ToastAndroid.show("数据库错误！计划获取失败",500);
        
        if(Array.isArray(resShop["data"])) 
          {
            this.props.addShop(resShop["data"]);
          }
        else ToastAndroid.show("数据库错误！商城信息获取失败",500);
        
        if(Array.isArray(JSON.parse(resCollect["data"]))) 
          {
            this.props.changeCollect(JSON.parse(resCollect["data"]));
          }

        else ToastAndroid.show("数据库错误！收藏信息获取失败",500);
      
        this.setLoading(false);
        ToastAndroid.show("登录成功！",500);
        this.props.navigation.navigate("MainPage");
      } 
    } else {
      // 账号密码不正确，提示
      this.setLoading(false);
      ToastAndroid.show("登陆失败！用户名或密码不正确",500);

    }
  };

  RegisterCallback =  () => {
    // 注册
    this.props.navigation.navigate("Register");
  };
  setSecureTextEntry = (value) =>{
    this.setState({secureTextEntry:value})
  }
  toggleSecureEntry = () => {
    this.setSecureTextEntry(!this.state.secureTextEntry);
  };
  renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={()=>this.toggleSecureEntry()}>
      <Icon {...props} name={this.state.secureTextEntry ? 'eye-off' : 'eye'}/>
    </TouchableWithoutFeedback>
  );

  render() {
    return (
      <View>
        <Layout style={styles.vertical}>
          <Layout style={styles.headerContainer}>
            <Image
              source={require('../../android/app/src/main/res/drawable-mdpi/src_assets_logofinal.png')}
              style={styles.logo}
            />
            <Text category="h4">袋鼠教练</Text>
          </Layout>
          <Layout style={styles.inputsContainer}>
            <Input style={styles.input} placeholder="请输入邮箱" onChangeText={this.handleEmail} />
            <Input 
              style={styles.input} placeholder="请输入密码" 
              onChangeText={this.handlePassword} 
              secureTextEntry={this.state.secureTextEntry} 
              accessoryRight={this.renderIcon}/>
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
        </Layout>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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