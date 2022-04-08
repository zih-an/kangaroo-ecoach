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

const completeness = [
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

  constructor() {
    super();
    let counts=[];
    counts.push(3);
    let myCount = 1;
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
    let theColor = counts.map((item,index)=>{
                if(index===0) return processColor('darkgreen');
                else if(index%2===1) return processColor('lightgreen');
                // else return processColor('#F5FCFF')}
                else return processColor('rgba(0, 0, 0, 0.05)')}
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
            // xValuePosition: "OUTSIDE_SLICE",
            // yValuePosition: "OUTSIDE_SLICE",
            // valueFormatter: "#.#'%'"
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
          {/* <View style={{
            // backgroundColor:"rgba(178,178,178,0.5)",
            height:300,width:300,
            borderWidth: 0,borderRadius: 125,
            position:'absolute',zIndex:99,
            left:-13,top:-50,
            }}>
              <Image
                style  = {{width:280,height:280}}
                source = {require('../assets/圆环.png')} 
                resizeMode = {"contain"}
              />
          </View> */}
          <PieChart
            touchEnabled={false}
            style={styles.chart}
            logEnabled={false}
            chartBackgroundColor={processColor('#F5FCFF')}
            chartDescription={this.state.description}
            data={this.state.data}
            legend={this.state.legend}
            highlights={this.state.highlights}
            animation={this.state.animation}
            // extraOffsets={{left: 5, top: 5, right: 5, bottom: 5}}
            drawEntryLabels={false}
            rotationEnabled={false}
            rotationAngle={-90}
            usePercentValues={true}
            // styledCenterText={{text:'Pie center text!', color: processColor('pink'), fontFamily: 'HelveticaNeue-Medium', size: 20}}
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
      },
      chart: {
        width: 400,
        height: 180,
        
      }
});

export default PieChartScreen;
