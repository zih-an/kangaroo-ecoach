import React,{useState} from 'react';
import {StyleSheet, View, Alert, ActivityIndicator} from 'react-native';
import {Layout, Card, Text, Button} from '@ui-kitten/components';
import {Icon} from '@ui-kitten/components';
import {default as theme} from '../custom-theme.json';
import TodayTrainPlanCard from './TodayTrainPlanCard';
import {getData} from './FetchData';
import {connect} from 'react-redux';
import MyNativeModule from './KotlinCameraStream';
const BulbIcon = props => <Icon {...props} name="bulb-outline" />;
const ArrorDownIcon = props => (
  <Icon {...props} name="arrowhead-down-outline" />
);
const url = "http://81.68.226.132:80/exercise/begin";
const HistoryTrainCard = () => {
  return (
    <Card style={styles.historyTrainCard}>
      <Text category="s1" style={{color: theme['color-info-100']}}>
        距上次运动已经过去...
      </Text>
      <Layout style={styles.cardMsgContainer}>
        <BulbIcon
          style={{width: 80, height: 80}}
          fill={theme['color-primary-100']}
        />
        <Text
          category="h1"
          style={{color: '#fff', fontWeight: 'bold', fontSize: 40}}>
          3天
        </Text>
      </Layout>
    </Card>
  );
};

function HomeSportTab(props) {
  let [loginProgress,setLoading] = useState(false);
  const toExercising = async () => {
    // props.nav2exercising.navigate('Exercising');
    setLoading(true);
    let res = await getData(url,props.login.token);
    setLoading(false);
    if(res["code"]===0) {
      Alert.alert(res["message"]);
    }
    else {
      console.log(res)
      res=JSON.stringify(res)
      MyNativeModule.startcameraActivity(res)
    }
  };
  return (
    <Layout style={styles.tabContainer}>
      <TodayTrainPlanCard />
      {/* <ArrorDownIcon
        style={{width: 100, height: 50}}
        fill={theme['color-primary-600']}
      /> */}
      <Layout style={styles.btnContainer}>
        <Button style={btnStyle.btn}>连接你的设备</Button>
        <Button style={btnStyle.btn} onPress={toExercising}>
          {loginProgress
          ? <ActivityIndicator color="white"/>
          : <Text>开始运动</Text>}
        </Button>
      </Layout>
      <HistoryTrainCard />
    </Layout>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    height: '93%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  btnContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyTrainCard: {
    width: '90%',
    backgroundColor: theme['color-info-900'],
  },
  cardMsgContainer: {
    width: '90%',
    backgroundColor: theme['color-info-900'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 8,
  },
});

const btnStyle = StyleSheet.create({
  btn: {
    width: '80%',
    margin: 5,
    borderRadius: 30,
  },
});

const mapStateToProps = state =>{
  return {
      login:state.login,
  };
};

export default connect(mapStateToProps)(HomeSportTab);
