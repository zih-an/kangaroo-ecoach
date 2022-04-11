import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Button,
  View, processColor
} from 'react-native';
import update from 'immutability-helper';

import {LineChart} from 'react-native-charts-wrapper';

class LineChartScreen extends React.Component {

  constructor(props) {
    super(props);
    let lineData = this.props.lineData;
    let tmpData = lineData.map((item,index)=>{
        return {x:index*0.2,y:item};
    });
    this.state = {
        yAxis:{
            left:{
              gridColor:processColor('white'),
              textColor:processColor('rgba(0, 0, 0, 0.3)')
            },
            right:{
              enabled:false,
            }
          },
      data: {
          dataSets: [
              {
                values: tmpData,
                label: '',
                config: {
                    lineColor:processColor("lightgreen"),
                    drawValues:false,
                    drawCircleHole:false,
                    drawCircles:false,
                    mode:"CUBIC_BEZIER",
                    drawFilled:true,
                    fillColor:processColor("lightgreen")
                }
                }, 
            ]
        },
      legend: {
        enabled: false,
      },
      xAxis: {
        gridColor:processColor('white'),
        textColor:processColor('rgba(0, 0, 0, 0.3)')
      },
      animation:{
        durationY:700,
        easingX:'Linear'
      },
      visibleRange: {y:{min:0,max:14}}
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
      <View style={{width:"100%"}}>

        <View style={styles.container}>
          <LineChart
            style={styles.chart}
            data={this.state.data}
            chartDescription={{text: ''}}
            legend={this.state.legend}
            marker={this.state.marker}
            xAxis={this.state.xAxis} 
            yAxis={this.state.yAxis}           
            drawGridBackground={false}
            drawBorders={false}
            autoScaleMinMaxEnabled={false}
            touchEnabled={true}
            dragEnabled={true}
            scaleEnabled={true}
            scaleXEnabled={true}
            scaleYEnabled={true}
            pinchZoom={true}
            doubleTapToZoomEnabled={true}
            highlightPerTapEnabled={true}
            highlightPerDragEnabled={false}
            visibleRange={this.state.visibleRange}
            dragDecelerationEnabled={true}
            dragDecelerationFrictionCoef={0.99}
            ref="chart"
            animation={this.state.animation}
            keepPositionOnRotation={false}
            onSelect={this.handleSelect.bind(this)}
            // onChange={(event) => console.log(event.nativeEvent)}
            bezier
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

export default LineChartScreen;