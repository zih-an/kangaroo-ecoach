import React from "react";
import { Layout, Tab, TabBar } from "@ui-kitten/components";
import AnalysisTab from "../components/AnalysisTab";
import PostTab from "../components/PostTab";
import HLMomentTab from "../components/HLMomentTab";

export default class ReportOverview extends React.Component {
  constructor(props){
    super(props);
  }
  state = { selectedIndex: 0 };
  showTab = (index) => {
    switch (index) {
      case 0:
        return <AnalysisTab navigation={this.props.navigation}/>;
      case 1:
        return <PostTab navigation={this.props.navigation}/>;
      case 2:
        return <HLMomentTab navigation={this.props.navigation}/>;
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
            <Tab title="专业报告" />
            <Tab title="数据海报" />
            <Tab title="高光时刻" />
          </TabBar>
          {this.showTab(this.state.selectedIndex)}
        </Layout>
      </Layout>
    );
  }
}
