import React from "react";
import { StyleSheet } from "react-native";
import {
  Layout,
  List,
  ListItem,
  Divider,
  Text,
  Icon,
} from "@ui-kitten/components";
import { default as theme } from "../custom-theme.json";

const HomeIcon = (props) => (
  <Icon
    {...props}
    name="arrow-ios-forward-outline"
    fill={theme["color-primary-500"]}
    style={{ width: 20, height: 20 }}
  />
);

export default class Mine extends React.Component {
  state = {
    msg: [
      {
        title: "生日",
        description: "2022年1月29日",
      },
      {
        title: "身高",
        description: "177cm",
      },
      {
        title: "体重",
        description: "60kg",
      },
      {
        title: "性别",
        description: "male",
      },
      {
        title: "我的级别",
        description: "初学者",
      },
      {
        title: "身高",
        description: "177cm",
      },
      {
        title: "查看历史训练记录",
        description: "运动情况",
      },
      {
        title: "清空所有数据",
      },
    ],
  };
  navigateTrainHistoryRec = () => {
    this.props.navigation.navigate("TrainHistoryRec");
  };

  renderItem = ({ item, index }) => {
    if (index === this.state.msg.length - 2) {
      // 查看历史训练记录
      return (
        <ListItem
          title={(evaProps) => (
            <Text
              {...evaProps}
              style={[evaProps.style, { color: theme["color-primary-500"] }]}
            >
              {item.title}
            </Text>
          )}
          description={item.description}
          onPress={this.navigateTrainHistoryRec}
        />
      );
    } else if (index === this.state.msg.length - 1) {
      // 清空数据
      return (
        <ListItem
          style={{ backgroundColor: "transparent" }}
          title={(evaProps) => (
            <Text
              {...evaProps}
              style={[
                evaProps.style,
                {
                  color: theme["color-primary-500"],
                  alignSelf: "flex-end",
                },
              ]}
            >
              {item.title}
            </Text>
          )}
        />
      );
    } else {
      return (
        <ListItem
          title={item.title}
          description={item.description}
          accessoryRight={<HomeIcon />}
        />
      );
    }
  };

  render() {
    return (
      <Layout style={styles.container}>
        <List
          data={this.state.msg}
          ItemSeparatorComponent={Divider}
          renderItem={this.renderItem}
        />
      </Layout>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});
