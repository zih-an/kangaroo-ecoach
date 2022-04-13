import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  processColor
} from 'react-native';

import _ from 'lodash';
import {ScatterChart,LineChart} from 'react-native-charts-wrapper';

let scatterData = {
    "头部":[76,76,100,76,76,100,76,100,100,100,100,100,76,76,76,76,100,100,100,100,100,100,100,100,39,76,100,76,76,100,100,76,76,76,76,76,76,76,100,100,76,100,100,100,100,100,76,76,76,76,76,76,76,76,76,76,76,76,76,76,100,76,100,100,100,100,76,100,100,100,100,76,76,76,76,76,100,100,100,100,76,76,100,100,100,100,100,100,100,100,100,100,76,76,76,76,76,76,76,100,100,100,100,100,100,76,76,76,100,100,100,100,100,100,100,76,76,76,76,76,76,76,76,76,76,76,100,100,76,76,76,76,100,100,100,100,100,100,100,100,76,76,76,76,76,76,76,76,76,100,100,100,76,100,76,100,100,100,100,100,76,76,76,100,76,76,76,100,100,100,100,100,100,100,100,100,76,76,100,76,100,100,100,100,100,100,100,76,100,76,100,100,100,100,100,100,100,100,100,100,76,100,100,100,100,100,100,100,100,100,100,76,100,76,76,76,100,100,100,100,100,100,76,76,76,76,76,76,100,100,100,100,56,76,76,39,39,76,76,100,100,100,100,100,100,100,76,76,76,56,76,76,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,76,76,76,56,100,100,76,76,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,56,76,100,76,56,56,56,56,76,100,76,76,76,100,100,76,76,100,100,76,76,100,76,76,76,76,100,100,76,76,76,100,100,100,76,100,100,76,100,100,100,100,100,100,100,100,100,76,100,76,100,100,100,76,100,100,100,100,100,76,100,76,100,100,100,100,100,76,76,76,76,76,76,76,76,76,100,100,76,76,76,100,100,76,76,76,100,100,100,100,100,76,76,76,76,39,100,76,100,100,100,76,76,76,76,100,76,56,100,100,100,100,100,100,100,76,39,56,100,100,76,56,76,76,100,100,76,100],
    "左臂":[100,100,100,100,100,100,56,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,56,56,100,100,100,100,56,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,56,56,56,56,56,56,56,100,100,100,100,100,100,100,100,100,100,100,100,100,100,25,25,56,56,56,56,56,56,56,56,100,100,100,100,100,100,100,100,100,100,100,100,100,100,25,25,56,56,56,56,56,56,56,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,56,56,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,56,56,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,56,100,100,56,100,56,25,0,0,6,100,100,100,100,100,100,100,100,100,25,25,6,0,0,0,0,0,6,25,25,56,100,100,100,100,100,100,100,100,100,100,100,100,25,25,25,6,6,6,6,25,25,25,25,56,100,100,100,100,100,100,100,100,100,100,100,25,25,25,0,0,0,0,0,6,25,56,100,100,100,100,100,100,100,100,100,100,100,100,100,25,25,6,0,0,0,6,25,25,100,100,100,100,6,0,0,0,56,100,100,100,100,100,100,56,6,6,56,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,56,25,0,0,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,56,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
    "右臂":[100,25,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,56,25,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,56,25,25,56,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,56,25,0,6,100,100,100,100,100,100,100,100,100,56,25,6,0,0,0,0,0,0,6,25,100,100,100,100,100,100,100,100,100,100,100,100,100,56,6,0,0,0,0,0,6,25,25,56,100,100,100,100,100,100,100,100,100,100,100,100,6,25,0,0,0,0,0,0,6,25,56,100,100,100,100,100,100,100,100,100,100,100,100,100,56,6,0,0,0,0,0,6,56,100,100,100,100,0,0,0,0,56,100,100,100,100,100,100,25,0,0,25,100,56,25,25,56,100,100,100,100,100,100,100,100,100,100,100,100,100,100,25,25,25,25,25,25,25,25,6,6,25,25,25,25,25,25,25,25,25,25,25,25,25,100,100,100,100,100,100,100,100,100,100,100,0,0,0,56,100,100,100,100,100,100,100,100,100,100,100,100,100,56,100,100,100,100,56,56,56,100,100,100,100,100,100,100,100,100,100,100,100,100,100,56,56,100,56,56,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
    "左腿":[25,56,6,25,0,6,0,0,0,0,0,6,100,6,25,25,25,25,25,25,25,25,25,25,25,6,56,6,6,0,6,25,6,6,6,25,100,25,25,0,0,25,25,25,25,25,6,0,0,56,0,6,6,0,6,0,6,0,25,56,100,100,56,25,25,25,25,25,25,25,100,6,0,6,6,6,6,6,6,6,0,25,100,25,25,25,25,25,25,25,25,25,100,100,25,6,6,6,6,6,6,6,6,6,6,56,100,56,25,25,25,25,25,25,25,6,6,6,6,6,0,6,6,6,6,0,0,6,25,56,25,25,25,25,25,25,25,25,25,25,0,0,0,0,6,6,6,6,6,6,6,0,25,0,6,25,25,56,25,6,25,25,6,0,0,25,6,0,6,6,0,0,6,6,6,0,6,6,0,25,25,25,25,25,25,25,25,25,0,0,25,0,0,0,0,0,0,0,0,6,25,0,6,25,25,25,25,25,25,25,25,25,0,25,0,6,6,6,0,0,6,0,0,0,25,6,56,6,25,25,25,25,25,25,6,0,25,6,6,6,6,6,0,0,6,0,6,6,6,25,0,56,6,25,25,25,25,25,56,56,25,25,25,6,25,25,6,6,25,56,25,25,25,25,6,25,25,100,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,6,25,25,6,25,0,6,6,6,25,6,6,6,25,6,25,6,6,25,25,25,6,6,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,0,25,25,56,56,25,25,6,100,0,25,0,25,25,25,25,6,6,0,6,0,0,25,0,0,25,56,56,6,25,25,6,25,25,25,25,25,25,6,56,56,25,0,25,6,6,25,25,6,25,25,25,56,25,25,25,100,0,25,25,25,25,0,6,25,0,6,6,25,25,6,6,6,0,25,25,100,25,25,25,25,25,25,25,25,25,25,100,100,0,0,6,0,0,6,0,0,100,100,25,25,25,25,25,25,25,25,25,100,100,25,6,0,0,0,0,0,0,100,25,0,25,25,25,25,25,25,25,25,25,25],
    "右腿":[25,0,0,0,0,25,0,25,25,25,25,25,0,0,25,0,6,25,25,25,6,0,25,6,25,6,6,6,6,6,6,6,6,6,6,0,0,25,6,25,56,25,56,56,0,25,25,0,6,6,6,6,6,6,6,6,6,6,0,0,0,6,25,25,25,25,56,56,25,25,25,0,6,6,6,6,6,6,6,6,25,0,56,0,25,25,25,25,25,25,25,0,6,0,6,6,6,6,6,6,6,6,6,6,6,0,0,6,25,0,0,25,25,0,0,25,0,0,6,0,6,6,6,6,6,6,6,6,6,0,0,25,25,25,25,25,25,25,25,25,25,0,6,6,6,6,6,6,6,6,6,6,6,25,6,25,25,25,25,25,25,56,0,100,0,0,6,6,6,6,6,6,6,6,6,25,0,0,0,0,25,25,25,25,25,25,25,0,100,0,6,6,6,6,6,6,6,6,6,6,0,0,6,25,25,25,25,25,25,25,25,0,0,0,6,6,6,6,6,6,6,6,6,6,0,0,6,25,25,0,25,0,0,56,25,25,6,6,6,6,6,6,6,6,6,6,6,6,6,25,6,0,100,25,6,6,6,100,25,25,25,25,25,25,25,25,25,25,25,25,25,25,6,6,25,56,56,56,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,100,25,100,25,6,0,0,6,6,6,0,0,0,0,0,0,0,0,0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,0,25,0,25,25,0,6,25,25,25,6,25,25,6,25,25,25,25,100,0,56,56,56,25,25,25,0,0,6,25,25,0,0,25,6,0,0,25,25,25,56,6,6,25,56,56,6,100,25,25,100,25,100,100,100,25,100,25,25,100,100,6,25,6,6,25,6,25,25,6,6,25,0,0,25,6,6,6,6,6,6,6,25,25,25,0,0,25,56,25,25,0,25,25,6,0,6,6,25,25,25,25,25,6,25,25,6,0,100,25,56,25,25,56,56,56,0,100,6,25,25,25,25,25,25,25,25,0,0,25,25,56,56,25,0,25,25,56,25,100],
    "跨部":[25,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,25,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,25,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,25,25,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,25,100,25,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,25,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,25,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,25,25,25,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,25,100,100,100,100,100,100,100],
    "双肩":[25,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,25,100,25,25,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,25,25,25,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,0,25,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,25,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,25,100,25,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,25,25,25,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,25,25,25,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,25,100,100,100,100,100,100,100],
    "左脖子":[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
    "右脖子":[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
    "躯干左侧":[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],    
    "躯干右侧":[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100]
};

function chooseColor(color){
  switch (color){
    case "头部" : return 'skyblue';
    case "左臂" : return 'red';
    case "右臂" : return 'green';
    case "左腿" : return 'blue';
    case "右腿" : return 'pink';
    case "跨部" : return 'yellow';
    case "双肩" : return 'orange';
    case "左脖子" : return 'gray';
    case "右脖子" : return 'darkslateblue';
    case "躯干左侧": return 'maroon';
    case "躯干右侧":return 'peru';
  }
}

class ScatterChartScreen extends React.Component {

  constructor(props) {
    super(props);
    let tmpData=[];
    let keys = Object.keys(this.props.scatterData);
    scatterData = this.props.scatterData;
    for(let i of keys){
      let obj ={};
      obj.label = i;
      obj.values = scatterData[i].map((item,index)=>{
        return {x:(index+1)*0.2,y:item}
      });
      obj.config = {
        color: processColor(chooseColor(i)),
        scatterShape: 'CIRCLE',
        scatterShapeSize: 11,
        drawValues:false,
      }
      tmpData.push(obj);
    }
    this.state = {
      xAxis:{
        gridColor:processColor('white'),
        textColor:processColor('rgba(0, 0, 0, 0.3)')
      },
      yAxis:{
        left:{
          gridColor:processColor('white'),
          textColor:processColor('rgba(0, 0, 0, 0.3)')
        },
        right:{
          enabled:false,
        }
      },
      animation:{
        durationX:700,
        easingX:'Linear'
      },
      legend: {
        enabled: true,
        // xEntrySpace:3,
        textSize: 8,
        form: 'CIRCLE',
        wordWrapEnabled: true,
        textColor:processColor("rgba(0, 0, 0, 0.6)")
      },
      marker: {
        enabled: false,
      },
      data: {
        dataSets: tmpData    
      }
    };
  }

  componentDidMount() {
    const size = 30;
    const range = 20;
  }

  _randomYValues(range, size) {
    return _.times(size, () => {
      return {y: Math.random() * range}
    });
  }

  handleSelect(event) {
    let entry = event.nativeEvent;
    if (entry == null) {
      this.setState({...this.state, selectedEntry: null})
    } else {
      this.setState({...this.state, selectedEntry: JSON.stringify(entry)})
    }
  }

  render() {
    return (

      <View style={{width: "100%"}}>
        <View style={styles.container}>
          {/* <LineChart style={styles.chart}
              data={{dataSets:[{label: "demo", values: [{y: 1}, {y: 2}, {y: 1}]}]}}
            /> */}
          <ScatterChart
            style={styles.chart}
            data={this.state.data}
            legend={this.state.legend}
            marker={this.state.marker}
            touchEnabled={true}
            doubleTapToZoomEnabled={true}
            animation={this.state.animation}
            yAxis={this.state.yAxis}
            xAxis={this.state.xAxis}
            drawBorders={false}
            borderColor={processColor('darksalmon')}
            borderWidth={0}
            chartDescription={{
              text:"",
            }}
           />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: 'white'
  },
  chart: {
    width: "100%",
    height: 220,
  }
});
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5FCFF'
//   },
//   chart: {
//     flex: 1
//   }
// });
export default ScatterChartScreen;