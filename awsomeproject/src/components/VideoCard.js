import React,{useEffect, useState} from 'react';
import {StyleSheet, View , Image , TouchableOpacity ,ScrollView,Modal,ToastAndroid} from 'react-native';
import {Layout, Text, CheckBox,Button,TopNavigationAction,Icon} from '@ui-kitten/components';
import {default as theme} from '../custom-theme.json';
import Video from 'react-native-video';
import StarGroup from "./StarGroup";
import * as actions from "../screens/store/actions";
import { connect } from "react-redux";
import { postData } from './FetchData';

const url = "http://120.46.128.131:8000/";

const BackIcon = props => <Icon {...props} name="arrow-back" />;
const CollectIconY = props => 
  <Icon
    style={{width:25,height:25}}
    fill={(!props.checked&&'#dddddd'||(props.checked)&&theme["color-primary-500"])}
    name='heart'
  />
;


const ModalContainerForVd = (props) => {
  const navigateBack = () => {props.setVisible(false)};

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );
  return (
    <Modal
      style={styles.modalContainer}
      visible={props.visible}
      backdropStyle={styles.backdrop}
      onBackdropPress={() => props.setVisible(false)}
      animationType='slide'
      // transparent={true}
    >
      <View>
      <View style={{height:"5%",width:"80%",alignItems:"center",marginTop:20,flexDirection:"row",justifyContent:"flex-start"}}>
          <BackAction/>
          <View style={{justifyContent:"center",alignItems:"center",width:"95%"}}>
            <Text style={{fontSize:17,color:'#454545'}}>{props.name}</Text>
          </View>
      </View>
        <Video
              source={{uri: props.uri}}//设置视频源  
              style={{marginRight: 5 ,marginLeft: 5,height:"60%", width:"97%",marginBottom:0}}//组件样式
              resizeMode='contain'//缩放模式
              repeat={true}//确定在到达结尾时是否重复播放视频。
        />
        {/* <Text style={{fontSize:20,color:'#454545',marginLeft:30,marginBottom:5}}>{props.name}</Text> */}
        <ScrollView style={{ marginRight: 30 ,marginLeft: 30 ,height:"30%",borderTopWidth:1,borderTopColor:"lightgrey",paddingTop:10}}>
          <Text>步骤</Text>
          <Text style={{fontSize:12,color:'gray',marginLeft:10,fontFamily: 'PingFang SC',lineHeight: 20}} >
            {props.modalInfo}
          </Text>
        </ScrollView>
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
  const FooterCollect =()=>{
    // let urlCollect = "http://120.46.128.131:8000/standardV/collect"
    let activeCollect = props.choose;
    return (<View  style={styles.footerContainer}>
      {/* 这里Text用来撑开父元素 */}
      <Text category="h6" style={styles.fontHidden}>lallalalaasl</Text>
      <TouchableOpacity onPress={()=>{
        activeCollect = !activeCollect;
        if(activeCollect) props.addCollect(props.id);
        else props.deleteCollect(props.id);
      }}
      style={{height:32,width:32,marginRight:30,marginTop:-10}}>
        <CollectIconY checked={activeCollect}/>
      </TouchableOpacity>
    </View>)
  }
  
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
        <View style={{justifyContent:"flex-start",marginLeft:10}}>
          <Text style={styles.font}>{props.title}</Text>
          <StarGroup rate={props.A_intensity} />
        </View>
      </View>

      <View>
          {(props.type==="modify")&&<Footer/>}
          {(props.type==="collect")&&<FooterCollect/>}

      </View>
      {/* Modal用于显示点击图片后弹出的动作详情 */}
      <ModalContainerForVd
            visible={modalVisibleForVd}
            setVisible={setModalVisibleFV}
            modalInfo={props.introduction}
            uri={url+props.sv_path}
            name={props.title}
      />
    </Layout>
  );
}



const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    // height:"60%",
    width: "60%",
    top:30
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  Container: {
    flexDirection: "row",
    width:"74%",
    marginBottom:10,
    marginLeft:10,
    marginRight:0,
    borderTopWidth:1,
    borderColor:"#dfdfe4"
    
  },
  footerContainer: {
    flexDirection: "column",
    alignItems:"flex-end",
    marginBottom:10,
    borderTopWidth:1,
    borderColor:"#dfdfe4",
  },
  font:{
    marginTop:20,
    color:'#454545',
    fontSize:12,
    marginBottom:10
    },
  fontHidden:{
    marginTop:10,
    color:"transparent",
    fontSize:15,
    },
});

const mapStateToProps = state =>{
  return {
      login:state.login,
      todayPlans:state.todayPlans,
      todayPlansB:state.todayPlansB,
      collect:state.collect
  };
};
export default connect ( mapStateToProps,actions)(VideoCard);