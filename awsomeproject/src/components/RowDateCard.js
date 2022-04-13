import React from 'react';
import {StyleSheet, Image,View,Alert} from 'react-native';
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

const calendarData = [
    {key: '首次运动'},{key: '运动7次'}, {key: '运动30次'},{key: '运动60次'},
    {key: '运动180次'},{key: '运动300次'},
    ];

function RowDataCard(props) {
    let dates = new Date();
    let month = (dates.getMonth()+1).toString();
    let day = dates.getDate().toString();
    let [date,setDate]=useState(month+"月"+day+"日");
    
    const renderItem = ({ item, index }) => (
    // <ListItem
    //   title={item.key}
    //   description={(day===index+1)&&("今日")}
    // />
    <View style={{height:"70%",width:50,justifyContent: 'center',alignItems: 'center',backgroundColor: "rgba(52, 52, 52, 0)",}}>
        <View>
            <Text>{index+1}</Text>
        </View>
    </View>
  );

  return (
    <Layout style={styles.cardPlanContainer}>
      <Card style={{height:props.height,borderRadius: 25,width:"75%",shadowColor: theme["color-primary-800"],marginLeft: 15,}}>
        <View style={{flexDirection: 'row',
        alignItems: 'center',
        paddingBottom:5,
        borderColor:"#ff721f"
        }}>
        </View>
        <List
          style={{ maxHeight: "100%",backgroundColor: "rgba(52, 52, 52, 0)",marginTop:10}}
          conttentContainerStyle={{justifyContent: 'center',alignItems: 'center',}}
          data={calendarData}
          ItemSeparatorComponent={Divider}
          scrollToIndex={[{index:3}]}
          horizontal={props.horizontal}
          showsHorizontalScrollIndicator={props.showIndicator}
          renderItem={renderItem}
        />
      </Card>
      <View style={{width:"20%",alignSelf: 'center',paddingLeft: 10,}}>
          <Svg icon="运动女孩1" size="50"/>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  cardPlanContainer: {
    marginTop: 10,
    width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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

export default connect(mapStateToProps,actions)(RowDataCard);

