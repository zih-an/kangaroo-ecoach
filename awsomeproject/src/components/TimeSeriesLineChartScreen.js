import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  processColor
} from 'react-native';
import update from 'immutability-helper';

import _ from 'lodash';
import {LineChart} from 'react-native-charts-wrapper';

class TimeSeriesLineChartScreen extends React.Component {

  constructor(props) {
    super(props);
    let dtwData = this.props.dtwData.path;
    let tmpData = dtwData.map((item,index)=>{
      return {x:item[0]*0.2,y:item[1]*0.2};
    })
    let len = dtwData.length;
    let legendData = dtwData.filter((item,index)=>{
      return index===0||index===len-1
    })
    let tmpDataLe = legendData.map((item,index)=>{
      return {x:item[0]*0.2,y:item[1]*0.2};
    })
    this.state = {
      data: {dataSets: [ {
        values: tmpData,
        label: '用户速度',
        config: {
          lineWidth: 1,
          drawValues: false,
          drawCircles:false,
          circleRadius: 5,
          highlightEnabled: true,
          drawHighlightIndicators: true,
          color: processColor('lightgreen'),
          drawFilled: false,
          fillColor: processColor('#C0FF8C'),
          fillAlpha: 75,
          // mode:"CUBIC_BEZIER",
        }
      },
      {
        values:tmpDataLe,
        label: '标准速度',
        config: {
          lineWidth: 1.5,
          drawValues: false,
          drawCircles:false,
          circleRadius: 5,
          highlightEnabled: false,
          drawHighlightIndicators: false,
          color: processColor('deeppink'),
          drawFilled: false,
          fillColor: processColor('#C0FF8C'),
          fillAlpha: 75,
          // mode:"CUBIC_BEZIER",
        }
      }
    
    ],},
      legend: {
        enabled: true,
        textColor: processColor('grey'),
        textSize: 12,
        form: 'circle',
        formSize: 4,
        xEntrySpace: 10,
        yEntrySpace: 5,
        formToTextSpace: 5,
        wordWrapEnabled: true,
        maxSizePercent: 0.5,
        custom: {
          colors: [processColor('deeppink'), processColor('lightgreen')],
          labels: ['标准速度', '用户速度',]
        }
      },
      marker: {
        enabled: false,
        markerColor: processColor('#F0C0FF8C'),
        textColor: processColor('white'),
        markerFontSize: 14,
      },

      selectedEntry: "",
      xAxis: {
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
      }
    }

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

    let borderColor = processColor("red");
    return (
      <View style={{width:"100%"}}>
        <View style={styles.container}>
          <LineChart
            style={styles.chart}
            data={this.state.data}
            chartDescription={{text: ''}}
            legend={this.state.legend}
            marker={this.state.marker}

            drawGridBackground={false}

            borderColor={borderColor}
            borderWidth={1}
            drawBorders={false}

            yAxis={this.state.yAxis}
            xAxis={this.state.xAxis}
            
            onSelect={this.handleSelect.bind(this)}
            // onChange={(event) => console.log(event.nativeEvent)}

            ref="chart"
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
    height: 200,
  }
});


export default TimeSeriesLineChartScreen;