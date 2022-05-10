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

  return (
    <Layout style={styles.cardPlanContainer}>
      <Card style={{height:props.height,borderRadius: 10,width:"100%",shadowColor: theme["color-primary-800"],}}>
        <View style={{flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingBottom:5,
        marginTop:10,
        borderBottomWidth:1,
        borderRadius:50,
        borderColor:"#ff721f"
        }}>
          <Svg icon="todoList" size="17"/>
          <Text category="s1" style={{ color: theme["color-primary-800"] }}>
            今日推荐
          </Text>
        </View>
        {(props.todayPlansDetail.length>0)&&<List
          style={{ maxHeight: "100%", marginBottom: 8 }}
          data={props.todayPlansDetail}
          ItemSeparatorComponent={Divider}
          horizontal={props.horizontal}
          showsHorizontalScrollIndicator={props.showIndicator}
          renderItem={renderItem}
          onTouchStart={() => {props.onEnableScroll(false);}}
          onMomentumScrollEnd={() => {props.onEnableScroll(true);}}
          onTouchEnd={() => {props.onEnableScroll(true);}}

        />}
        {(props.todayPlansDetail.length===0)&&<View style={{width:"100%",height:"100%",justifyContent: 'center',alignItems: 'center',}}><Text style={{color:"#aaaaaa"}}>暂无计划，先逛逛吧~</Text></View>}
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
      todayPlansDetail:state.todayPlansDetail
  };
};

export default connect(mapStateToProps,actions)(TodayTrainPlanCard);

