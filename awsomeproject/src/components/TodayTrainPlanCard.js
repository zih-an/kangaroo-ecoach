import React from 'react';
import {StyleSheet, Image,View} from 'react-native';
import {
  // Card,
  Text,
  Divider,
  List,
  ListItem,
  Layout,
} from '@ui-kitten/components';
import {Card} from "react-native-shadow-cards"
import {Icon} from '@ui-kitten/components';
import {default as theme} from '../custom-theme.json';
import { useState,useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../screens/store/actions";
import Svg from './Svg';

function TodayTrainPlanCard(props) {
  const renderItem = ({ item, index }) => (
    <ListItem
      title={`${item.title}`}
      description={
        ((parseInt(`${item.num}`)!==0)&&("一组"+(`${item.num}`*`${item.cycles}`)+"个"+",共"+`${item.groups}`+"组"))||
        ((parseInt(`${item.num}`)===0)&&("共"+`${item.groups}`+"组"))

      }
      // 这里如果把renderItemIcon单独写的话参数传递会有问题，所以直接整合在属性accessoryLeft里面
      accessoryLeft={() => 
        <Image
          style={{ width: 70,height: 70}}
          source={{uri: `${item.sketch_sv_path}`}}
          resizeMode='stretch'
          />}
    />
  );
  let dates = new Date();
  let month = (dates.getMonth()+1).toString();
  let day = dates.getDate().toString();
  let [date,setDate]=useState(month+"月"+day+"日");

  return (
    <Layout style={styles.cardPlanContainer}>
      <View>
      </View>
      <Card style={{height:props.height,borderRadius: 10,width:"100%",shadowColor: theme["color-primary-800"],}}>
        <View style={{flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingBottom:5,
        marginTop:10,
        borderBottomWidth:1,
        borderRadius:50,
        // borderColor:theme["color-primary-800"]
        borderColor:"#ff721f"
        }}>
          <Svg icon="todoList" size="17"/>
          <Text category="s1" style={{ color: theme["color-primary-800"] }}>
            今日推荐
          </Text>
          {/* <View style={{position:"absolute",right:0,top:0,zIndex:99}}>
            <Svg icon="汗水" size="50"/>
          </View> */}
        </View>
        <List
          style={{ maxHeight: "100%", marginBottom: 8 }}
          data={props.todayPlanDetail}
          ItemSeparatorComponent={Divider}
          horizontal={props.horizontal}
          showsHorizontalScrollIndicator={props.showIndicator}
          renderItem={renderItem}
          onTouchStart={() => {props.onEnableScroll(false);}}
          onMomentumScrollEnd={() => {props.onEnableScroll(true);}}
        />
        <View style={{position:"absolute",right:0,top:0,zIndex:99}}>
            <Svg icon="汗水" size="50"/>
          </View>
      </Card>
    </Layout>
  );
}

const styles = StyleSheet.create({
  cardPlanContainer: {
    width: "90%",
  },
  dateStyle: {
    alignSelf: "center",
    marginBottom:10
  },
});


const mapStateToProps = state =>{
  return {
      login:state.login,
      todayPlan:state.todayPlans,
      todayPlanDetail:state.todayPlansDetail
  };
};

export default connect(mapStateToProps,actions)(TodayTrainPlanCard);

