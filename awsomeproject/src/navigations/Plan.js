import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import PlanOverview from '../screens/PlanOverview';
import AddItem from '../screens/AddPlanItem';
import movementDetail from '../screens/movementDetail'
const {Navigator, Screen} = createNativeStackNavigator();

const PlanNavigator = () => (
  <Navigator
    headerMode="none"
    defaultScreenOptions="PlanOverview"
    screenOptions={{headerShown: false}}>
    <Screen name="PlanOverview" component={PlanOverview} />
    <Screen name="AddItem" component={AddItem} />
    <Screen name="movementDetail" component={movementDetail}/>
    {/* 评估身体、指定完整计划的 screen */}
  </Navigator>
);

export default function Plan() {
  return <PlanNavigator />;
}
