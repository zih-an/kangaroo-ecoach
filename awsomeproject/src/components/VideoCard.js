import React,{useState} from 'react';
import {StyleSheet, View , Image , TouchableOpacity ,ScrollView,Modal} from 'react-native';
import {Layout, Text, CheckBox,Button} from '@ui-kitten/components';
import {default as theme} from '../custom-theme.json';
import Video from 'react-native-video';
import StarGroup from "./StarGroup";
import * as actions from "../screens/store/actions";
import { connect } from "react-redux";

const url = "http://81.68.226.132:80/";

const ModalContainerForVd = (props) => {
  return (
    <Modal
      style={styles.modalContainer}
      visible={props.visible}
      backdropStyle={styles.backdrop}
      onBackdropPress={() => props.setVisible(false)}
    >
      <View>
        <Video
              // source={{ uri:"http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4", type: 'mpd' }} 
              source={{uri: props.uri}}//设置视频源  
              // source={require('../assets/videos/手臂/跪姿释手俯卧撑.mp4')}
              style={{marginRight: 30 ,marginLeft: 30,height:"55%", width:"80%"}}//组件样式
              // rate={1}//播放速率
              // paused={true}//暂停
              // volume={1}//调节音量
              // muted={false}//控制音频是否静音
              resizeMode='contain'//缩放模式
              // onLoad={this.onLoad}//加载媒体并准备播放时调用的回调函数。
              // onProgress={this.onProgress}//视频播放过程中每个间隔进度单位调用的回调函数
              // onEnd={this.onEnd}//视频播放结束时的回调函数
              // onAudioBecomingNoisy={this.onAudioBecomingNoisy}//音频变得嘈杂时的回调 - 应暂停视频
              // onAudioFocusChanged={this.onAudioFocusChanged}//音频焦点丢失时的回调 - 如果焦点丢失则暂停
              repeat={true}//确定在到达结尾时是否重复播放视频。
        />
        <ScrollView style={{ marginRight: 20 ,marginLeft: 20 ,height:"30%"}}>
          <Text category="h6" >
            {props.modalInfo}
          </Text>
        </ScrollView>
        <View style={{height:"10%",width:"30%",alignItems:"center",marginLeft:125,marginTop:15}}>
            <Button size="medium" onPress={() => props.setVisible(false)}>
             确定
            </Button>
        </View>
      </View>
    </Modal>
  );
};

function VideoCard(props) {
  let [modalVisibleForVd,setModalVisibleFV]=useState(false);
  const handleClick=()=>{
    setModalVisibleFV(true);
  }
  const Footer = ()=> {
    const [activeChecked, setActiveChecked] = React.useState(props.choose);
    return (
      <View  style={styles.footerContainer}>
        {/* 这里Text用来撑开父元素 */}
        <Text category="h6" style={styles.fontHidden}>lallalalaasl</Text>
        <CheckBox
          style={{marginRight:15}}
          checked={activeChecked}
          onChange={(nextChecked) => {
            setActiveChecked(nextChecked);
            if(nextChecked) props.addToday(props.id);
            else props.deleteToday(props.id);
          }}
        >
        </CheckBox>
      </View>
    );
  };
  return (
    <Layout style={{width:"100%",flexDirection:"row"}}>

      <View style={styles.Container}>
        <TouchableOpacity onPress={handleClick}>
          <Image
          style={{ width: 80,height: 80,marginLeft:0,marginTop:10,marginRight:10}}
          source={{uri: props.sketch_sv_path}}
          resizeMode='stretch'
          />
        </TouchableOpacity >
        <View style={{justifyContent:"flex-start",marginLeft:0}}>
          <Text category="h6" style={styles.font}>{props.title}</Text>
          <StarGroup rate={props.A_intensity} />
        </View>
      </View>

      <View>
          <Footer/>
      </View>
      {/* Modal用于显示点击图片后弹出的动作详情 */}
      <ModalContainerForVd
            visible={modalVisibleForVd}
            setVisible={setModalVisibleFV}
            modalInfo={props.introduction}
            uri={url+props.sv_path}
      />
    </Layout>
  );
}



const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    width: "80%",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  Container: {
    flexDirection: "row",
    width:"74%",
    marginBottom:10,
    marginLeft:5,
    marginRight:0,
    borderTopWidth:1,
    borderColor:"gray"
    
  },
  footerContainer: {
    flexDirection: "column",
    alignItems:"flex-end",
    marginBottom:10,
    marginLeft:0,
    borderTopWidth:1,
    borderColor:"gray",
  },
  font:{
    marginTop:10,
    color:'#FF7700',
    fontSize:15,
    },
  fontHidden:{
    marginTop:10,
    color:"white",
    fontSize:15,
    },
});


export default connect ( null,actions)(VideoCard);