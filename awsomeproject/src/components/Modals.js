import React,{useEffect, useState} from "react";
import { 
    StyleSheet,
    Dimensions, 
    TouchableOpacity, 
    View,
    ToastAndroid,
    Image
} from "react-native";
import {
  Text,
  Modal,
  Input,
  Icon
} from "@ui-kitten/components";
import { default as theme } from "../custom-theme.json";
import { postData,getData} from "../components/FetchData";
import { Card } from "react-native-shadow-cards";
import Picker from 'react-native-picker';
import ImagePicker from 'react-native-image-crop-picker';
import CookieManager from '@react-native-cookies/cookies';
import RNFS from 'react-native-fs';

const {width} = Dimensions.get('window');
const AlertIcon = (props) => (
  <Icon {...props} name='alert-circle-outline'/>
);
export const ModalContainerFigure = (props) => {
    const _getCurrentDate = ()=>{
      var currDate = new Date()
      var year = currDate.getFullYear()
      var month = (currDate.getMonth()+1).toString()
      month = month.padStart(2,'0')
      var dateDay = currDate.getDate().toString()
      dateDay = dateDay.padStart(2,'0')
      let time = year+'.'+month+'.'+dateDay
      return time;
    }
  
    const [value, setValue] = React.useState('');
    let [currentDate,setCurrentdate] = React.useState(_getCurrentDate());
    let [number,setNumber] = React.useState("0");
    let [Sex,setSex] = React.useState("♂");
  
    const _createDateData = () =>{
        let date = [];
        var currDate = new Date()
        var year = currDate.getFullYear()
        var month = currDate.getMonth()+1
        for(let i=1970;i<=year;i++){
            let month = [];
            for(let j = 1;j<13;j++){
                let day = [];
                if(j === 2){
                    for(let k=1;k<29;k++){
                        day.push(k+'日');
                    }
                    //Leap day for years that are divisible by 4, such as 2000, 2004
                    if(i%4 === 0){
                        day.push(29+'日');
                    }
                }
                else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
                    for(let k=1;k<32;k++){
                        day.push(k+'日');
                    }
                }
                else{
                    for(let k=1;k<31;k++){
                        day.push(k+'日');
                    }
                }
                let _month = {};
                _month[j+'月'] = day;
                month.push(_month);
            }
            let _date = {};
            _date[i+'年'] = month;
            date.push(_date);
        }
        return date;
      }
  
    const _createNumberData = () =>{
      let data = [];
      for(let i = 30;i<351;i++){
        data.push(i);
      }
      return data;
    }
  
    const _createSexData = () =>{
      return ['♂(男)','♀(女)']
    }
  
    //打开日期选择视图
    const _showDatePicker = () =>{
      var year = ''
      var month = ''
      var day = ''
      var dateStr = currentDate
      year = dateStr.substring(0,4)
      month = parseInt(dateStr.substring(5,7))
      day = parseInt(dateStr.substring(8,10))
      Picker.init({
        pickerTitleText:'时间选择',
        pickerCancelBtnText:'取消',
        pickerConfirmBtnText:'确定',
        selectedValue:[year+'年',month+'月',day+'日'],
        pickerBg:[255,255,255,1],
        pickerData: _createDateData(),
        pickerFontColor: [33, 33 ,33, 1],
        onPickerConfirm: (pickedValue, pickedIndex) => {
            var year = pickedValue[0].substring(0,pickedValue[0].length-1)
            var month = pickedValue[1].substring(0,pickedValue[1].length-1)
            month = month.padStart(2,'0')
            var day = pickedValue[2].substring(0,pickedValue[2].length-1)
            day = day.padStart(2,'0')
            let str = year+'.'+month+'.'+day
            setCurrentdate(str)
            setValue(str)
        },
        onPickerCancel: (pickedValue, pickedIndex) => {
        },
        onPickerSelect: (pickedValue, pickedIndex) => {
        }
      });
      Picker.show();
    }
    //打开数字选择视图
    const _showNumberPicker = () =>{
      var dateStr = "0"
      Picker.init({
        pickerTitleText:'选择',
        pickerCancelBtnText:'取消',
        pickerConfirmBtnText:'确定',
        selectedValue:[dateStr],
        pickerBg:[255,255,255,1],
        pickerData: _createNumberData(),
        pickerFontColor: [33, 33 ,33, 1],
        onPickerConfirm: (pickedValue, pickedIndex) => {
          let str = pickedValue[0]
            setNumber(str);
            if(props.title==="身高") setValue(str+'cm');
            else if(props.title==="体重") setValue(str+'Kg');
        },
        onPickerCancel: (pickedValue, pickedIndex) => {
        },
        onPickerSelect: (pickedValue, pickedIndex) => {
        }
      });
      Picker.show();
    }
    const _showSexPicker = () =>{
      var dateStr = "♂"
      Picker.init({
        pickerTitleText:'选择',
        pickerCancelBtnText:'取消',
        pickerConfirmBtnText:'确定',
        selectedValue:[dateStr],
        pickerBg:[255,255,255,1],
        pickerData: _createSexData(),
        pickerFontColor: [33, 33 ,33, 1],
        onPickerConfirm: (pickedValue, pickedIndex) => {
          let str = pickedValue[0]
            setSex(str[0]);
            setValue(str[0]);
        },
        onPickerCancel: (pickedValue, pickedIndex) => {
        },
        onPickerSelect: (pickedValue, pickedIndex) => {
        }
      });
      Picker.show();
    }
    return (
      <Modal
        style={styles.modalContainer}
        visible={props.visible}
        backdropStyle={styles.backdrop}
      >
        <Card disabled={true} style={styles.modalTitle}>
          <Text style={{height:20,color:"gray"}}>设置您的{props.title}:</Text>
          
          {(props.title==="生日")&&
          (<TouchableOpacity onPress={()=>_showDatePicker()} style={styles.modalTxt}>
              <Text style={{color:"white"}}>{currentDate}</Text>
          </TouchableOpacity>)}
  
          {(props.title==="身高")&&
          (<TouchableOpacity onPress={()=>_showNumberPicker()} style={styles.modalTxt}>
              <Text style={{color:"white"}}>{number}</Text>
              <Text style={{color:"white"}}>cm</Text>
          </TouchableOpacity>)}
  
          {(props.title==="体重")&&
          (<TouchableOpacity onPress={()=>_showNumberPicker()} style={styles.modalTxt}>
              <Text style={{color:"white"}}>{number}</Text>
              <Text style={{color:"white"}}>Kg</Text>
          </TouchableOpacity>)}
  
          {(props.title==="级别")&&
          (<Text style={{color:"gray",alignSelf: 'center',}}>无法修改</Text>)}
  
          {(props.title==="性别")&&
          (<TouchableOpacity onPress={()=>_showSexPicker()} style={styles.modalTxt}>
              <Text style={{color:"white"}}>{Sex}</Text>
          </TouchableOpacity>)}
  
          <View style={styles.modalBtn}>
          <Text onPress={() => {
            props.setMessage(value,props.index);
            props.setVisible(false);setValue('');setNumber("0");setSex("♂");
          }}
            style={{color:"white"}}
          >确定</Text>
          </View>
        </Card>
      </Modal>
    );
  };

export const ModalContainerAvatar = (props) => {
    _fetchImage = async(image)=> {
        let url = "http://120.46.128.131:8000/account/avatar"; // 接口地址
        let file = {img:"", name:'avatar.jpg' } ;
        await RNFS.readFile(image.path, 'base64')
         .then((content) => {
            file.img = 'data:image/jpg;base64,'+content;
            props.setAvatarPath('data:image/jpg;base64,'+content);
            CookieManager.set(url, {
                name: 'avatar',
                value: 'data:image/jpg;base64,'+content,
                domain: '',
                path: '/',
                version: '1',
                expires: ''
              });
         })
         .catch((err) => {
            ToastAndroid.show("图片读取失败",500)
         });
        let formData = new FormData();
        formData.append('avatar', file); // 这里要与后台名字对应。
        let res = await postData(url,formData,props.token);
        ToastAndroid.show(res["message"],500);
    }
    _openCamera = () =>ImagePicker.openCamera({
        height:80,
        width:80,
        cropping:true
        }).then(image => {
        _fetchImage(image);
        props.setVisible(false);
    });

     // 调用相册 
     _openPicker=()=>ImagePicker.openPicker({
        height:80,
        width:80,
        cropping: true
        }).then(image => {
        _fetchImage(image);
        props.setVisible(false);
    });
    _closeModal=()=>{
        props.setVisible(false);
    }
    return (<Modal 
                animationType="slide"
                visible={props.visible}
                transparent={true}
                onRequestClose={()=>_closeModal()}
            >
                <View style={avatarStyles.modalStyle}>
                    <View style={avatarStyles.subView}>
                        <View style={avatarStyles.itemContainer}>
                            <Text style={avatarStyles.actionTitle}>
                                请选择获取图片方式...
                            </Text>
                            <TouchableOpacity   onPress={()=>_openCamera()} style={avatarStyles.actionItem}>
                                <Text style={avatarStyles.actionItemTitle}>打开相机</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>_openPicker()} style={avatarStyles.actionItem}>
                                <Text style={avatarStyles.actionItemTitle}>打开相册</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[avatarStyles.itemContainer]}>
                            <TouchableOpacity
                                style={[avatarStyles.actionItem, {borderTopWidth:0}]}
                                onPress={()=>_closeModal()}>
                                <Text style={{fontSize:16,color:'#666666',textAlign:'center'}}>取消</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>)
}

export const ModalContainerName = (props) =>{
  const [nickname,setName] = useState("");
  const handleNickname = (text) =>{
    setName(text);
  }
  const renderCaptionName = () => {
    return (
      <View style={styles.captionContainer}>
        {AlertIcon(styles.captionIcon)}
        <Text style={styles.captionText}>{(nickname.length>7||nickname.length<2)&&"请输入2到7位昵称"}</Text>
      </View>
    )
  }
  return (<Modal 
      style={styles.modalContainer}
      animationType="slide"
      visible={props.visible}
      transparent={true}
      onRequestClose={()=>_closeModal()}
      backdropStyle={styles.backdrop}
  >
      <View style={styles.modalTitle}>
      <Text style={{height:20,color:"gray",margin: 5,}}>设置您的昵称:</Text>
        <Input style={styles.input} placeholder="请输入昵称" onChangeText={handleNickname} caption={renderCaptionName}/>
        <View style={styles.modalBtn}>
          <Text onPress={() => {
            if((nickname.length>7||nickname.length<2)) ToastAndroid.show("请输入2到7位昵称!",500);
            else{
              props.setVal(nickname);
              props.setVisible(false);
            }  
          }}
            style={{color:"white"}}
          >确定</Text>
          </View>
      </View>
  </Modal>)
}

export const ModalContainerCapture = (props) =>{
  _closeModal=()=>{
        props.setVisible(false);
    }
  useEffect(()=>{
    let timer = setInterval(()=>{_closeModal()},4000);
    return ()=>clearInterval(timer);
  },[])
  return (<Modal 
    style={{
      position: "absolute",
      width: "90%",
      height:"90%",
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      backgroundColor: "transparent",
    }}
    animationType="slide"
    visible={props.visible}
    transparent={true}
    onRequestClose={()=>_closeModal()}
    backdropStyle={styles.backdrop}
>
    <Image 
    style={{height:"100%",width:"100%",}} 
    source={{uri:props.uri}}
    resizeMode='contain'>
    </Image>
    </Modal>)
}

const styles = StyleSheet.create({
    modalTitle:{
      backgroundColor: "white",
      width:"100%",
      justifyContent:"center",
      alignItems:"center",
      borderRadius: 15,
      padding:20,
      backgroundColor:"white",
      borderWidth:1,
      borderColor:"salmon"
    },
    modalTxt:{
      height:40,
      width:"120%",
      justifyContent:"center",
      backgroundColor: "salmon",
      alignItems: 'center',
      marginTop:10,
      marginBottom:10,
      flexDirection:"row"
    },
    modalBtn:{
      width:60,
      height: 30,
      borderWidth:2,
      borderColor:"salmon",
      justifyContent:"center",
      alignItems:"center",
      backgroundColor: "salmon",
      borderRadius: 15,
      marginTop:5
    },
    modalContainer: {
      position: "absolute",
      width: "70%",
      height:200,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      backgroundColor: "rgba(255,255,255,0.5)",
    },
    backdrop: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    captionContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    captionIcon: {
      width: 10,
      height: 10,
      marginRight: 5
    },
    captionText: {
      fontSize: 12,
      fontWeight: "400",
      fontFamily: "opensans-regular",
      color: theme["color-primary-500"],
    }
  });

const avatarStyles = StyleSheet.create({
    modalStyle:{
        justifyContent:'flex-end',
        alignItems:'center',
        flex:1
    },
    subView:{
        justifyContent:'flex-end',
        alignItems:'center',
        alignSelf:'stretch',
        width:width,
    },
    itemContainer:{
        marginLeft:15,
        marginRight:15,
        marginBottom:15,
        borderRadius:20,
        backgroundColor:'#eeeeee',
        justifyContent:'center',
        alignItems:'center',
    },
    actionItem:{
        width:width*0.8,
        height:45,
        alignItems:'center',
        justifyContent:'center',
        borderTopColor:'lightgrey',
        borderTopWidth:0.5,
    },
    actionTitle:{
        fontSize:13,
        color:'#808080',
        textAlign:'center',
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:15,
        paddingRight:15,
    },
    actionItemTitle:{
        fontSize:16,
        color:'coral',
        textAlign:'center',
    },
    input: {
      width: "80%",
      borderRadius: 30,
    },
    
});