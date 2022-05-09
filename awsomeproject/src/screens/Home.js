import React from 'react';
import {Layout, Tab, TabBar} from '@ui-kitten/components';
import HomeSportTab from '../components/HomeSportTab';
import HomeNewsTab from '../components/HomeNewsTab';

export default class Home extends React.Component {
  state = {selectedIndex: 0};
  showTab = index => {
    switch (index) {
      case 0:
        return <HomeSportTab nav2exercising={this.props.navigation} />;
      case 1:
        return <HomeNewsTab />;
    }
  };
  render() {
    return (
      <Layout style={{height: '100%'}}>
        <Layout>
          <TabBar
            selectedIndex={this.state.selectedIndex}
            onSelect={selectedIndex => this.setState({selectedIndex})}>
            <Tab title="运动" />
            <Tab title="广场" />
          </TabBar>
          {this.showTab(this.state.selectedIndex)}
        </Layout>
      </Layout>
    );
  }
}
