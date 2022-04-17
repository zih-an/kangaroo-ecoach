import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Modal,
    TouchableOpacity,
    Dimensions,
    ToastAndroid,
    ActivityIndicator
} from 'react-native';
import PropTypes from 'prop-types';
import CameraModule from"../../KotlinStream"
import {getData,postData} from "./FetchData";
import * as actions from "../screens/store/actions"
import { connect } from 'react-redux'; 

const {width} = Dimensions.get('window');
 
const url = "http://81.68.226.132:80/exercise/begin";

class ActionSheetComp extends Component{
    constructor(props){
        super(props);
    }
    // 入参类型
    static propTypes={
        items:PropTypes.array,
        modalTitle:PropTypes.string,
        visible: PropTypes.bool,
    }
 
    // 默认值
    static defaultProps={
        items:[
            {
                title: '直接开始',
                click: () => {
                    Alert.alert('你点击了接口1');
                }
            },
            {
                title: '远程摄像头',
                click: () => {
                    Alert.alert('你点击了接口2');
                }
            },
            {
                title: '运动投屏',
                click: () => {
                    Alert.alert('你点击了接口3');
                }
            }
        ],
        modalTitle:'请选择运动方式',
        visible: false,
    }
 
   state = {
        modalVisible: this.props.visible,
        progressFir:false,
        progressSec:false
    };
    
    // 该钩子函数表示当父组件的props入参改变时调用，常用于父组件入参变化影响子组件渲染
    UNSAFE_componentWillReceiveProps(newProps){
        this.setState({modalVisible:newProps.visible});
    }
    handleClick(index){
        switch(index){
            case 0:
                if(this.props.modalTitle==="设置设备"){
                    // if(timer !== null) clearTimeout(timer);
                        // setTimeout(()=>{
                        this.props.setStatus(true);
                        this.toSlave();
                        this.cancelModal();
                }
                else if(this.props.modalTitle==="查找附近设备"){
                    this.toExercise(index);
                }
                break;
            case 1:
                if(this.props.modalTitle==="设置设备"){
                        this.props.setStatus(true);
                        this.toSlave();
                        this.cancelModal();
                        
                }
                else if(this.props.modalTitle==="查找附近设备"){
                    this.toExercise(index);
                }
                break;
        }
    }
    toExercise = async(index)=>{
        if(index===0)//摄像头
        this.setState({progressFir:true});
        else this.setState({progressSec:true});

        let resSchedual = await getData(url,this.props.token);
        if(resSchedual["code"]===0) Alert.alert("连接失败！");
        else {
            if(index === 0)
            this.setState({progressFir:false});
            else this.setState({progressSec:false});
            this.props.setStatus(true);
            resSchedual=JSON.stringify(resSchedual);
            let response;
            if(index===0)
            {
                response = await CameraModule.startremoteActivity(resSchedual);
            }
            else{
                response = await CameraModule.startscreenprojectionActivity(resSchedual);
            }
            if(response===0)
            {
                this.cancelModal();   
            }else{
                let finishurl = "http://81.68.226.132:80/exercise/finish"
                let resObj = JSON.parse(response);
                let id = resObj["id"];
                let resPost = await postData(finishurl,{"information":response,"id":id},this.props.login.token);
                if(resPost["code"]==="1"||resPost["code"]===1){
                    ToastAndroid.show("上传成功，可点击历史记录查看",500);
                }else{
                    ToastAndroid.show("上传失败!",500);
                }
                this.props.addReport(resObj);
                this.cancelModal();
                this.props.nav.navigate("SportOverviewPage");
            }
            
        }
    };
    toSlave = async()=>{
        let response =await CameraModule.startclintActivity();
    };
    cancelModal(){
        this.setState({modalVisible:false});
        this.props.setVisible(false);
    }
    render(){
        let actionSheets = this.props.items.map((item,index)=>{
           return(
               <TouchableOpacity
                   key={index}
                   style={styles.actionItem}
                   onPress={()=>this.handleClick(index)}>
                       {((index===0)&&(this.state.progressFir))||((index===1)&&(this.state.progressSec))? <ActivityIndicator color="orange"/>
                        : <Text style={styles.actionItemTitle}>
                        {item.title}
                          </Text>}
               </TouchableOpacity>
               );
        });
 
        return (
            <Modal 
                animationType="slide"
                visible={this.state.modalVisible}
                transparent={true}
                onRequestClose={()=>this.cancelModal()}
            >
                <View style={styles.modalStyle}>
                    <View style={styles.subView}>
                        <View style={styles.itemContainer}>
                            <Text style={styles.actionTitle}>
                                {this.props.modalTitle}
                            </Text>
                            {actionSheets}
                        </View>
                        <View style={[styles.itemContainer]}>
                            <TouchableOpacity
                                style={[styles.actionItem, {borderTopWidth:0}]}
                                onPress={()=>this.cancelModal()}>
                                <Text style={{fontSize:16,color:'#666666',textAlign:'center'}}>取消</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}
const styles = StyleSheet.create({
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
});

const mapStateToProps = state =>{
    return {
        login:state.login,
    };
  };
  
export default connect(mapStateToProps,actions)(ActionSheetComp);