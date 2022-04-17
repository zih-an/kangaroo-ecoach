import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  processColor,
  Image,
} from 'react-native';

import {PieChart} from 'react-native-charts-wrapper';

let completeness = [
    true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,
    true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,
    true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,
    true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,
    true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,
    true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,
    true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,
    true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,
    true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,
    true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,
    true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,
    true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,
    true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,
    true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,
    true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,
    true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,
    true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,
    true,true,true,true,true,true,true,true,true,true,true].map((item,index)=>{
      // if((index>=250&&index<=350)||(index>=50&&index<=150)) return !item;
      if((index>=50&&index<=150)||(index>=190&&index<=250)||(index>=300&&index<=350)||(index>=380&&index<=390)) return !item;
      else return item;
    })



class PieChartScreen extends React.Component {

  constructor(props) {
    super(props);
    let counts=[];
    counts.push(2);
    let myCount = 1;
    let completeness = this.props.completeness;
    for(let i = 1; i<completeness.length;i++){
        if(completeness[i]===completeness[i-1]){
            myCount++;
            if(i===completeness.length-1) {
                counts.push(myCount);
                myCount = 0;
            }
        }
        else{
            counts.push(myCount);
            myCount = 1;
        }
    }
    let theValue = counts.map((item,index)=>{return {value:item};});
    let begin = completeness[0];
    let theColor = counts.map((item,index)=>{
                if(index===0) return processColor('green');
                if(begin){
                  if(index%2!==0) return processColor('#C0FF8C');
                  // else return processColor('#F5FCFF')}
                  else return processColor('rgba(0, 0, 0, 0.05)')}
                else{
                  if(index%2===0) return processColor('#C0FF8C');
                  // else return processColor('#F5FCFF')}
                  else return processColor('rgba(0, 0, 0, 0.05)')
                }
              }
              );
    this.state = {
      animation:{
        durationX:1000,
        easingX:'Linear'
      },
      legend: {
        enabled: false,
        textSize: 15,
        form: 'CIRCLE',

        horizontalAlignment: "LEFT",
        verticalAlignment: "CENTER",
        orientation: "VERTICAL",
        wordWrapEnabled: false
      },
      data: {
        dataSets: [{
          values: theValue,
          label: '',
          config: {
            colors: theColor,
            drawValues:false,
            valueTextSize: 10,
            valueTextColor: processColor('green'),
            sliceSpace: 0.3,
            selectionShift: 0,
          }
        }],
      },
      highlights: [{x:0},{x:2},{x:3}],
      description: {
        text: '',
        textSize: 15,
        textColor: processColor('darkgray'),

      }
    };
  }

  render() {
    return (
      <View style={{width: "100%",height:200,margin:10}}>
        <View style={styles.container}>
          <PieChart
            touchEnabled={true}
            style={styles.chart}
            logEnabled={false}
            chartBackgroundColor={processColor('white')}
            chartDescription={this.state.description}
            data={this.state.data}
            legend={this.state.legend}
            highlights={this.state.highlights}
            animation={this.state.animation}
            drawEntryLabels={false}
            rotationEnabled={true}
            rotationAngle={-90}
            usePercentValues={true}
            centerTextRadiusPercent={100}
            holeRadius={80}
            transparentCircleRadius={0}
            maxAngle={360}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: '#F5FCFF',
        alignItems: 'center',
        overflow: 'hidden',
      },
      chart: {
        width: "100%",
        height: 180,
        
      }
});

export default PieChartScreen;
