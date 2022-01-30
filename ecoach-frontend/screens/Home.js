import React from "react";
import { Layout, Tab, TabBar } from "@ui-kitten/components";
import HomeSportTab from "../components/HomeSportTab";
import HomeNewsTab from "../components/HomeNewsTab";

export default class Home extends React.Component {
  state = { selectedIndex: 0 };
  showTab = (index) => {
    switch (index) {
      case 0:
        return <HomeSportTab />;
      case 1:
        return <HomeNewsTab />;
    }
  };
  render() {
    return (
      <Layout style={{ height: "100%" }}>
        <Layout>
          <TabBar
            selectedIndex={this.state.selectedIndex}
            onSelect={(selectedIndex) => this.setState({ selectedIndex })}
          >
            <Tab title="运动" />
            <Tab title="资讯" />
          </TabBar>
          {this.showTab(this.state.selectedIndex)}
        </Layout>
      </Layout>
    );
  }
}
