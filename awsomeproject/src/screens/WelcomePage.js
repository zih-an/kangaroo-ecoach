import React, {Component} from 'react';
import {StyleSheet, Text, View, Image,ToastAndroid} from 'react-native';
import CookieManager from '@react-native-cookies/cookies';
import {postData, getData} from '../components/FetchData';
import { connect } from "react-redux";
import * as actions from "./store/actions";
const urlAll =  "http://120.46.128.131:8000/standardV/index";
const urlChoosen = "http://120.46.128.131:8000/plan/index";
const urlShop="http://120.46.128.131:8000/shop/";
const urlCollect = "http://120.46.128.131:8000/standardV/collect";
const urlAvatar = "http://120.46.128.131:8000/account/avatar";
 
class WelcomePage extends Component {
  state ={
    cookieCurrent:false
  }
  setCookie(value){
    this.setState({cookieCurrent:value});
  }
  componentDidMount() {
      let url = "http://120.46.128.131:8000/account/login/";  
      CookieManager.get(url)
          .then( async (cookies) => {
            let myCookie = cookies["myCookie"];
            if(myCookie){
              this.props.addToken(myCookie.value);console.log(myCookie.value);
              let resAll = await getData(urlAll,this.props.login.token);
              // let resAll = await getData(urlAll,'1');
              let resToday = await getData(urlChoosen,this.props.login.token);
              let resShop= await getData(urlShop,this.props.login.token);
              let resCollect= await getData(urlCollect,this.props.login.token);
              let flagAll = true;
              let flagShop = true;
              let flagToday = true;
              let flagCollect = true;

              if(resAll===403||resAll==='403'||resAll['code']!=='1') {
                flagAll = false;
              } 
              if(flagAll&&flagShop&&flagToday&&flagCollect){
                this.props.addPlan(resAll["data"]);
                this.props.addPlanIndex(resAll["data"]);
                this.props.addTodayDetail(resToday["data"]);
                this.props.addToday(resToday["data"].map(item => item.id));
                this.props.addTodayB(resToday["data"].map(item => item.id));
                this.props.addShop(resShop["data"]);
                this.props.changeCollect(JSON.parse(resCollect["data"]));
                this.setCookie(true);
              } 
            }
            this.timer = setTimeout(() => {
              // this.props.navigation.navigate('MainPage');
              if(this.state.cookieCurrent===true) {
                this.props.navigation.navigate('MainPage');
              }
              else{
                this.props.navigation.navigate('Login');
              }
            }, 1500);
          });
  }
  componentWillUnMount() {
    this.timer !== undefined ? this.clearTimeout(this.timer) : null;
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.wecomeText}>Welcome</Text>
        <View style={styles.mainContainer}>
          <View style={styles.mainContainer}>
            <View style={styles.oval}></View>
            <Image
              source={require('../../android/app/src/main/res/drawable-mdpi/src_assets_logofinal.png')}
              style={styles.logo}
            />
          </View>
          <View style={styles.mainTextContainer}>
            <Text style={styles.headText}>袋鼠教练</Text>
            <Text style={styles.headText}>E-Coach</Text>
          </View>
        </View>
        <Text style={styles.sloganText}>您的专属私人教练</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  // main logo
  mainContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    top: -25,
  },
  mainTextContainer: {
    position: 'relative',
    top: 30,
  },
  oval: {
    position: 'relative',
    bottom: 20,
    opacity: 0.14,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FF9B70',
    zIndex: 0,
  },
  logo: {
    position: 'absolute',
    top: 55,
    width: 140,
    height: 140,
  },
  // text
  wecomeText: {
    color: '#FF9B70',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headText: {
    color: '#707070',
    fontSize: 24,
    fontWeight: 'bold',
    position: 'relative',
    bottom: 40,
  },
  sloganText: {
    color: '#707070',
    fontSize: 24,
  },
});
const mapStateToProps = state =>{
  return {
      login:state.login,
      todayPlan:state.todayPlans,
      plan:state.allPlans,
      planIndex:state.allPlansIndex,
      collect:state.collect
  };

};

export default connect(mapStateToProps,actions)(WelcomePage);