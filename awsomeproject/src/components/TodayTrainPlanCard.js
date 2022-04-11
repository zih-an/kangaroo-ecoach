import React from 'react';
import {StyleSheet, Image} from 'react-native';
import {
  Card,
  Text,
  Divider,
  List,
  ListItem,
  Layout,
} from '@ui-kitten/components';
import {Icon} from '@ui-kitten/components';
import {default as theme} from '../custom-theme.json';
import { useState,useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../screens/store/actions";

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
      <Text category="h5" style={styles.dateStyle}>
        {date}
      </Text>
      <Card style={{height:props.height}}>
        <Text category="s1" style={{ color: theme["color-primary-800"] }}>
          今日训练计划
        </Text>
        <List
          style={{ maxHeight: "100%", marginBottom: 8 }}
          data={props.todayPlanDetail}
          ItemSeparatorComponent={Divider}
          renderItem={renderItem}
        />
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

