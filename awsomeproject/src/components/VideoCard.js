import React,{useState} from 'react';
import {StyleSheet, View , Image , TouchableOpacity ,ScrollView,Modal} from 'react-native';
import {Layout, Text, CheckBox,Button} from '@ui-kitten/components';
import {default as theme} from '../custom-theme.json';
import Video from 'react-native-video';
import StarGroup from "./StarGroup";
import * as actions from "../screens/store/actions";
import { connect } from "react-redux";

const ModalContainerForVd = (props) => {
  return (
    <Modal
      style={styles.modalContainer}
      visible={props.visible}
      backdropStyle={styles.backdrop}
      onBackdropPress={() => props.setVisible(false)}
    >
      <View>
        <Text category="h6" style={{ margin: 20 ,height:"50%"}}>
          这里是演示视频,视频地址：
          {props.uri}
        </Text>
        <ScrollView style={{ margin: 20 ,height:"30%"}}>
          <Text category="h6" >
            {props.modalInfo}
          </Text>
        </ScrollView>
        <Button size="medium" onPress={() => props.setVisible(false)}>
          确定
        </Button>
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
            uri={props.sv_path}
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
    borderColor:"gray"
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