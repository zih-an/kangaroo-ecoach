import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MineOverview from "../screens/MineOverview";
import TrainHistoryRec from "../screens/TrainHistoryRec";
import ReportOverview from "../screens/ReportOverview";

const { Navigator, Screen } = createNativeStackNavigator();

const MineNavigator = () => (
  <Navigator
    headerMode="none"
    defaultScreenOptions="MineOverview"
    screenOptions={{ headerShown: false }}
  >
    <Screen name="MineOverview" component={MineOverview} />
    <Screen name="TrainHistoryRec" component={TrainHistoryRec} />
    <Screen name="ReportOverview" component={ReportOverview} />
  </Navigator>
);

export default function Mine() {
  return <MineNavigator />;
}
