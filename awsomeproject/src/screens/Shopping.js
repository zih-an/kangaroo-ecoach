import React from "react";
import { StyleSheet } from "react-native";
import { Layout, Text, Tab, TabBar, Icon } from "@ui-kitten/components";
import  ShoppingCardViewer  from "../components/ShoppingCardViewer";

export default class Shopping extends React.Component {
  state = { selectedIndex: 0, sloganText: "生命在于运动。——袋鼠教练" };
  showTab = (index) => {
    switch (index) {
      case 0:
      //请求运动器械数据
      
      case 1:
      //请求其他的数据
      // let url = "";
    }
    return <ShoppingCardViewer></ShoppingCardViewer>;
  };
  render() {
    return (
      <Layout style={{ height: "100%" }}>
        <Layout>
          <TabBar
            selectedIndex={this.state.selectedIndex}
            onSelect={(selectedIndex) => this.setState({ selectedIndex })}
          >
            <Tab title="运动器械" />
            <Tab title="其他" />
          </TabBar>
          <Text category="s1" style={styles.sloganStyle}>
            {this.state.sloganText}
          </Text>
        </Layout>
        {this.showTab(this.state.selectedIndex)}
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  sloganStyle: {
    alignSelf: "center",
    margin: 7,
  },
});
