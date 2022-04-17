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
  Icon,
} from "@ui-kitten/components";
import { Image, StyleSheet, Dimensions, View,ToastAndroid,TouchableWithoutFeedback,ActivityIndicator} from "react-native";
import {postData, getData} from '../components/FetchData';
import { connect } from "react-redux";
import * as actions from "./store/actions";
import {default as theme} from '../custom-theme.json';


const AlertIcon = (props) => (
  <Icon {...props} name='alert-circle-outline'/>
);

export default class Register extends React.Component {
  preferList = [0];
  state = {
    email:'',
    password:'',
    pwdY:false,
    passwordDouble:'',
    check:'',
    modalVisible: false,
    modalInfo: "",
    selectedIndex:[new IndexPath(0),],
    tyepsName : [{title:"胸部"},{title:"背部"},{title:"肩部"},{title:"手臂"},{title:"腹部"},{title:"腰部"},{title:"臀部"},{title:"腿部"},{title:"全身耐力"},],
    displayValue:"请选择您的运动偏好",
    passwordCheck:"",
    secureTextEntry:true,
    timerCount:120,
    timerTitle:"获取验证码",
    counting:false,
    selfEnable:true,
    loginProgress:false,
  };
  setLoading = (value) => {
    this.setState({loginProgress:value});
  }
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

  setSelectedIndex = (index) =>{
    this.setState({selectedIndex:index});
    let str = "";
    for(let i of index){
      str = str + this.state.tyepsName[parseInt(i.row)].title+",";
    }
    if(str==="") this.setState({displayValue:"请选择您的运动偏好"})
    else this.setState({displayValue:str});

    let arr = index.map(item => item.row);
    this.preferList = arr.sort(function(a, b){return a - b});
  }
  handleEmail=(text)=>{
    this.setState({email:text})
  }
  handlePassword=(text)=>{
    this.setState({password:text})
    if(this.state.password.length<7) this.setState({pwdY:false});
    else this.setState({pwdY:true});
  }
  _countDownAction(){
    const codeTime = this.state.timerCount;
    const now = Date.now()
    const overTimeStamp = now + codeTime * 1000 + 100/*过期时间戳（毫秒） +100 毫秒容错*/
    this.interval = setInterval(() =>{
        /* 切换到后台不受影响*/
        const nowStamp = Date.now()
        if (nowStamp >= overTimeStamp) {
            /* 倒计时结束*/
            this.interval&&clearInterval(this.interval);
            this.setState({
                timerCount: codeTime,
                timerTitle: '获取验证码',
                counting: false,
                selfEnable: true
            })
        }else{
            const leftTime = parseInt((overTimeStamp - nowStamp)/1000, 10)
            this.setState({
                timerCount: leftTime,
                timerTitle: `重新获取(${leftTime}s)`,
            })
        }
    },1000)
  }
  _shouldStartCountting(shouldStart=true){
      if (this.state.counting) {return}
      if (shouldStart) {
          this._countDownAction()
          this.setState({counting: true,selfEnable:false})
      }else{
          this.setState({selfEnable:true})
      }
  }
  componentWillUnmount(){
      clearInterval(this.interval)
  }
  RegisterCallback = async () => {
    // 注册
    this.setLoading(true);
    let urlReg = "http://81.68.226.132:80/account/register/";  
    if(this.state.pwdY){
      let res = await postData(urlReg,{
        "email":this.state.email,
        "password":this.state.password,
        "check_code":this.state.check,
        "preferList":this.preferList});
        if (res["code"]==="1") {
        this.setLoading(false);
        //注册成功跳转登录页面
        ToastAndroid.show("注册成功！",500)
        this.props.navigation.navigate("Login");
        } else {
        ToastAndroid.show(res["message"],500)
        this.setLoading(false);

        }
    }
    else{
      ToastAndroid.show("请检查您的密码！",500)
    this.setLoading(false);

    }
    
  };

  handleCheck = (text) => {
    this.setState({ check: text });
  }
 
  handleCheckClick = async () =>{
    if (!this.state.counting  && this.state.selfEnable){
      this.setState({selfEnable:false})
      let urlCheck = "http://81.68.226.132:80/account/get-code/";
      let res = await postData(urlCheck,{"email":this.state.email});

      if(res["code"]===1||res["code"]==="1"){
        ToastAndroid.show(res["message"],500);
        this._shouldStartCountting(true);
      }
      else{
        ToastAndroid.show(res["message"],500);
        this._shouldStartCountting(false);
      }
    }
  }

  handlePasswordDouble = (text) =>{
    this.setState({passwordDouble:text});
    if(text !== this.state.password) this.setState({passwordCheck:"**两次密码不一致！请检查您的密码**"});
    else {
      this.setState({passwordCheck:""});
    }
  }
  renderCaption = () => {
    return (
      <View style={styles.captionContainer}>
        {AlertIcon(styles.captionIcon)}
        <Text style={styles.captionText}>{!this.state.pwdY&&"请输入至少8位密码"}</Text>
      </View>
    )
  }
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
            <Input 
              style={styles.input} 
              placeholder="请输入密码"
              caption={this.renderCaption}
              onChangeText={this.handlePassword} 
              secureTextEntry={this.state.secureTextEntry} 
              accessoryRight={this.renderIcon}
              />
            <Input style={styles.input} placeholder="请再次输入密码" onChangeText={this.handlePasswordDouble} secureTextEntry={this.state.secureTextEntry} accessoryRight={this.renderIcon}/>
            <Text style={{color:theme["color-primary-500"],fontSize:8}}>{this.state.passwordCheck}</Text>

            
            <Select style={{height:40,width:250,marginBottom:40}}
                multiSelect={true}
                selectedIndex={this.state.selectedIndex}
                value={this.state.displayValue}
                onSelect={(index) => this.setSelectedIndex(index)}
                caption='建议选择1-3项'
                >
                {this.state.tyepsName.map((item,index)=>{return <SelectItem title={item.title}/>}) }

            </Select>
            <View style={{width:"80%",flexDirection: 'row',}}>
              <Input style={{width:"60%",borderRadius:20}} placeholder="请输入验证码" onChangeText={this.handleCheck} />
              <View style={{width:"35%",height:30,marginTop:0,marginLeft:10,
              borderRadius: 20,
              justifyContent: 'flex-end',alignItems: 'center',}}>
                <Text style={{color:(!this.state.selfEnable&&"gray") || (this.state.selfEnable&&theme["color-primary-500"]),
                fontSize:12,
                
              }} onPress={
                  ()=>this.handleCheckClick()}>
                    {this.state.timerTitle}</Text>
              </View>
            </View>
          </Layout>
          <Button
              style={styles.btn}
              appearance="ghost"
              onPress={this.RegisterCallback}
            >
              {this.state.loginProgress
                    ? <ActivityIndicator color={theme["color-primary-500"]}/>:<Text style={{color:theme["color-primary-500"]}}>注册</Text>}
            </Button>
          
        </Layout>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    marginTop: "20%",
    marginBottom:40,
  },
  inputsContainer: {
    width: "100%",
    height: "45%",
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
    borderRadius: 30,
    marginTop:25
  },
  input: {
    width: "80%",
    borderRadius: 30,
  },
  captionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  captionIcon: {
    width: 10,
    height: 10,
    marginRight: 5
  },
  captionText: {
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "opensans-regular",
    color: theme["color-primary-500"],
  }
});