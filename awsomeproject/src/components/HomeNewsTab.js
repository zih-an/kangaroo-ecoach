import React, { useEffect,useState } from 'react';
import { StyleSheet,View,Text,Image } from 'react-native';
import { IndexPath, Layout, Select, SelectItem } from '@ui-kitten/components';
import { Card } from "react-native-shadow-cards";
import { default as theme } from "../custom-theme.json";
import Swiper from 'react-native-swiper';
import Svg from './Svg';
import {getData,postData} from './FetchData';
import {connect} from 'react-redux';
import * as actions from "../screens/store/actions";

function HomeNewsTab(props){
  let types = ["运动天数","运动时长"];
  const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
  const [value,setValue] = useState("运动天数");
  const [dayRank,setDayRank] = useState([]);
  const [timeRank,setTimeRank] = useState([]);
  const [day,setDay] = useState([]);
  const [time,setTime] = useState([]);

  handleselect = (index) =>{
    setSelectedIndex(index);
    setValue(types[index.row]);
  }
  const _gets = async () =>{
    let urlDay = "http://120.46.128.131:8000/account/rankByDay";
    let urlTime = "http://120.46.128.131:8000/account/rankByTime";
    let resDay = await getData(urlDay,props.login.token);
    let resTime = await getData(urlTime,props.login.token);
    setDayRank(resDay["data"]);
    setTimeRank(resTime["data"]);
    setDay(resDay["person"]);
    setTime(resTime["person"]);
  }
  useEffect(()=>{
    _gets();
  },[])
  return (
    <Layout style={styles.container} level='1'>

      <View style={{height: 150,width:"95%",marginBottom:20,flexDirection: 'row',}}>
          <View style={{height: "100%",width:"50%",}}>
            <Swiper
              removeClippedSubviews={false}
              showsButtons={false}         //显示控制按钮
              loop={true}                    //如果设置为false，那么滑动到最后一张时，再次滑动将不会滑到第一张图片。
              autoplay={true}                //自动轮播
              autoplayTimeout={3}          //每隔2秒切换

              dot={<View style={{           //未选中的圆点样式
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  width: 10,
                  height: 10,
                  borderRadius: 4,
                  marginLeft: 10,
                  marginRight: 9,
                  // marginTop: 9,
                  marginBottom: -30,
              }}/>}
              activeDot={<View style={{    //选中的圆点样式
                  backgroundColor: theme["color-primary-500"],
                  width: 13,
                  height: 13,
                  borderRadius: 4,
                  marginLeft: 10,
                  marginRight: 9,
                  // marginTop: 9,
                  marginBottom: -30,
              }}/>}
            >
                <View>
                    <Svg icon="运动女孩1" size="150"/>
                </View>
                <View>
                    <Svg icon="运动女孩2" size="150"/>
                </View>
                <View>
                    <Svg icon="运动女孩4" size="150"/>
                </View>
            </Swiper>
          </View>
          <View style={{height: "100%",width:"50%",}}>
            <Card style={{height: "100%",width:"100%",overflow:"hidden"}}>
              <Text style={{color:theme["color-primary-500"],fontSize:12,alignSelf: 'center',}}>动作库上新爆火毽子操!</Text>
              <Image 
                style={{width:"100%",height:"85%"}}
                source={require('../assets/liu.png')}
                resizeMode='contain'
              ></Image>
              </Card>
          </View>
      </View>

      <View style={{height: 410,width: "95%",}}>

        <View style={{height:40,width:"100%",marginBottom:10,
            flexDirection: 'row',justifyContent:"flex-start",alignItems: 'center',paddingLeft: 10,}}>
          <Svg icon="notice" size="30"/>
          <Text style={{color:"gray",marginLeft:10}}>排行榜实时更新！看看你的名次吧...</Text>
        </View>

        <Card style={{justifyContent: 'center',alignItems: 'center',width: "100%",}}>
        <View style={{justifyContent: 'center',alignItems: 'center',
          flexDirection: 'row',width:"100%",height:50,borderBottomWidth: 2,
          borderColor:"#dddddd",borderRadius:25,
          marginBottom:20}}>

          <View style={{height:50,width:"50%",flexDirection: 'row',justifyContent: 'flex-start',alignItems: 'center',
        paddingLeft:20}}>
            <Svg icon="级别" size="20" color={theme["color-primary-500"]}/>
            <Text style={{marginLeft:"5%",fontSize:20}}>排行榜</Text>
          </View>

          <View style={{height:50,width:"44%",justifyContent: 'center'}}>
            <Select
            selectedIndex={selectedIndex}
            onSelect={index => handleselect(index)}
            value={value}
            >
            {types.map((item,index)=>{
              return <SelectItem title={item} key={index}/>
            })}
            </Select>
          </View>

        </View>

        <View style={{height:300,width:"100%",justifyContent: 'flex-start',alignItems: 'center',}}>
           <View style={{height:250,width:"100%",justifyContent: 'flex-start',alignItems: 'center'}}>
            {(value==="运动时长")&&timeRank.slice(0,5).map((item,index)=>{
                return <Card style={{flexDirection:"row",width:"90%",height: 25,marginBottom:5,marginTop:5,backgroundColor: (time[0]===index+1?"#ecdde6":"white"),}}>
                <View style={styles.rank}><Text style={{color:"gray"}}>{index+1}</Text></View>
                <View style={styles.name}><Text style={{color:theme["color-primary-500"]}}>{item[0]}</Text></View>
                <View style={styles.name}><Text style={{color:"gray"}}>{item[1]} 分钟</Text></View>
                </Card>
              })}
              {(value==="运动天数")&&dayRank.slice(0,5).map((item,index)=>{
                return <Card style={{flexDirection:"row",width:"90%",height: 25,marginBottom:5,marginTop:5,backgroundColor: (day[0]===index+1?"#ecdde6":"white")}}>
                <View style={styles.rank}><Text style={{color:"gray"}}>{index+1}</Text></View>
                <View style={styles.name}><Text style={{color:theme["color-primary-500"]}}>{item[0]}</Text></View>
                <View style={styles.name}><Text style={{color:"gray"}}>{item[1]} 天</Text></View>
                </Card>
              })}
              <View><Text style={{color:"#aaaaaa"}}>. . .</Text></View>
           </View>
           <View style={{height:50,width:"100%",justifyContent: 'flex-start',alignItems: 'center'}}>
              {(value==="运动时长")&&<Card style={{flexDirection:"row",width:"90%",height: 25,marginBottom:5,marginTop:5}}>
                <View style={styles.rankBottom}><Text style={{color:"gray"}}>当前排名</Text></View>
                <View style={styles.nameBottom}><Text style={{color:theme["color-primary-500"]}}>{time[0]}</Text></View>
                <View style={styles.nameBottom}><Text style={{color:"gray"}}>共运动{time[1]}分钟</Text></View>
                </Card>
              }
              {(value==="运动天数")&&<Card style={{flexDirection:"row",width:"90%",height: 25,marginBottom:5,marginTop:5}}>
                <View style={styles.rankBottom}><Text style={{color:"gray"}}>当前排名</Text></View>
                <View style={styles.nameBottom}><Text style={{color:theme["color-primary-500"]}}>{day[0]}</Text></View>
                <View style={styles.nameBottom}><Text style={{color:"gray"}}>共运动{day[1]}天</Text></View>
                </Card>
              }
           </View>
          </View>
        </Card>

      </View>
    </Layout>
  );
};



const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxHeight: "93%",
    padding: 5,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  rank:{
    width:"6%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  name:{
    width:"47%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankBottom:{width:"30%",justifyContent: 'center',alignItems: 'center',},
  nameBottom:{width:"35%",justifyContent: 'center',alignItems: 'center',}
});
const mapStateToProps = state =>{
  return {
      login:state.login,
  };
};

export default connect(mapStateToProps,actions)(HomeNewsTab);