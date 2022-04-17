import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  processColor
} from 'react-native';
import update from 'immutability-helper';

import {RadarChart} from 'react-native-charts-wrapper';


class RadarChartScreen extends React.Component {

  constructor(props) {
    super(props);
    let stanData = this.props.stanData;
    let rhythmData = this.props.rhythmData;
    let intensityData = this.props.intensityData;
    let completeData = this.props.completeData;
    this.state = {
        animation:{
            durationY:700,
            easingX:'Linear'
          },
        yAxis:{
            drawLabels:false,
            axisMinimum: 0,     //轴最小值
            axisMaximum: 89,     //轴最大值
            gridColor:processColor('white'),
        },
        xAxis: 
        {
            valueFormatter: ['标准度','节奏','运动强度','完成度','耐力'],
            textColor:processColor('rgba(0, 0, 0, 0.5)'),
            textSize:10
        },
        data: 
        {
            dataSets: 
            [
                {
                    values: [{value: stanData}, {value: rhythmData}, {value: intensityData}, {value: completeData}, {value: 100}],
                    label: 'DS 1',
                    config: {
                        color: processColor('white'),
                        drawFilled: true,
                        drawValues:false,
                        fillColor: processColor('#C0FF8C'),
                        fillAlpha: 150,
                        lineWidth: 2
                    }
                },
            ]
    },
      legend: {
        enabled: false,
        textSize: 8,
        textColor:processColor("rgba(0, 0, 0, 0.6)"),
        form: 'CIRCLE',
        wordWrapEnabled: true
      }
    };
  }

  handleSelect(event) {
    let entry = event.nativeEvent
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
          <RadarChart
            style={styles.chart}
            data={this.state.data}
            xAxis={this.state.xAxis}
            yAxis={this.state.yAxis}
            chartDescription={{text: ''}}
            legend={this.state.legend}
            drawWeb={true}
            webLineWidthInner={2}
            webColor={processColor("lightgray")}
            webColorInner={processColor("lavender")}
            animation={this.state.animation}
            skipWebLineCount={1}
            onSelect={this.handleSelect.bind(this)}
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
        height: 320,
      }
});

export default RadarChartScreen;