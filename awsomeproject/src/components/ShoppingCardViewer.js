import React from "react";
import { StyleSheet } from "react-native";
import { Layout, Text, ViewPager, Icon } from "@ui-kitten/components";
import ShoppingCard from "./ShoppingCard";
import { default as theme } from "../custom-theme.json";
import { connect } from "react-redux";

const ForwardIcon = (props) => (
  <Icon
    {...props}
    name="arrow-ios-forward-outline"
    fill={theme["color-primary-500"]}
    style={styles.iconStyle}
  />
);
const BackIcon = (props) => (
  <Icon
    {...props}
    name="arrow-ios-back-outline"
    fill={theme["color-primary-500"]}
    style={styles.iconStyle}
  />
);
class ShoppingCardViewer extends React.Component {
  constructor(props){
    super(props);
  }
  state={
    selectedIndex:0,
    theData:[{name:"admin",price:399,pic_path:"http://playerz.plus/images/fun-emotion.jpg"}]
  };
  setSelectedIndex(text){
    this.setState(selectedIndex,text);
  }
  render(){
  return (
    <Layout>
      <Layout style={styles.headerContainer}>
        <BackIcon />
        <Text category="h6">{String(this.state.selectedIndex + 1)} / {this.props.shop.length}</Text>
        <ForwardIcon />
      </Layout>
      <ViewPager
        selectedIndex={this.state.selectedIndex}
        onSelect={(index) => this.setState({selectedIndex:index})}
      >
        {/* 这里直接读取全局state中商品信息生成购物卡片 */}
        {this.props.shop.map((myData,index)=>{
          return <ShoppingCard
          imageUrl={myData.pic_path}
          key={index}
          name={myData.name}
          price={myData.price}
          data={myData.introduction}
          /> 
        })}
      </ViewPager>
    </Layout>
  );
};
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    margin: 5,
  },
  tab: {
    height: 192,
    alignItems: "center",
    justifyContent: "center",
  },
  iconStyle: {
    width: 50,
    height: 50,
  },
});

const mapStateToProps = state =>{
  return {
      login:state.login,
      shop:state.shop
  };
};

export default connect(mapStateToProps)(ShoppingCardViewer);
