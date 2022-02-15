import React from "react";
import {
  Input,
  Button,
  Layout,
  Text,
  Modal,
  Card,
} from "@ui-kitten/components";
import { Image, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ModalContainer = (props) => {
  return (
    <Modal
      style={styles.modalContainer}
      visible={props.visible}
      backdropStyle={styles.backdrop}
      onBackdropPress={() => props.setVisible(false)}
    >
      <Card disabled={true}>
        <Text category="h6" style={{ margin: 20 }}>
          {props.modalInfo}
        </Text>
        <Button size="medium" onPress={() => props.setVisible(false)}>
          确定
        </Button>
      </Card>
    </Modal>
  );
};

export default class Login extends React.Component {
  infos = ["账号未注册或密码错误！", "注册成功！"];
  state = {
    modalVisible: false,
    modalInfo: "",
  };
  setModalVisible = (shown) => {
    this.setState({ modalVisible: shown });
  };
  setModalInfo = (index) => {
    this.setState({ modalInfo: this.infos[index] });
  };

  pressCallback = () => {
    // 1. 发送请求验证密码正确
    // let correct = ... (请求结果)
    let correct = true; // for test
    if (correct === true) {
      this.props.navigation.navigate("MainPage");
    } else {
      // 账号密码不正确，提示
      this.setModalInfo(0);
      this.setModalVisible(true);
    }
  };

  RegisterCallback = () => {
    // 注册
    this.setModalInfo(1);
    this.setModalVisible(true);
  };

  render() {
    return (
      <SafeAreaView>
        <Layout style={styles.vertical}>
          <Layout style={styles.headerContainer}>
            <Image
              source={require("../assets/logo-final.png")}
              style={styles.logo}
            />
            <Text category="h4">袋鼠教练</Text>
          </Layout>
          <Layout style={styles.inputsContainer}>
            <Input style={styles.input} placeholder="请输入邮箱" />
            <Input style={styles.input} placeholder="请输入密码" />
            <Button style={styles.btn} onPress={this.pressCallback}>
              登录
            </Button>
            <Button
              style={styles.btn}
              appearance="ghost"
              onPress={this.RegisterCallback}
            >
              注册
            </Button>
          </Layout>
          <ModalContainer
            visible={this.state.modalVisible}
            setVisible={this.setModalVisible}
            modalInfo={this.state.modalInfo}
          />
        </Layout>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  // modal
  modalContainer: {
    position: "absolute",
    width: "80%",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  // containers
  vertical: {
    height: Dimensions.get("window").height,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  headerContainer: {
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: "35%",
    marginBottom: 30,
  },
  inputsContainer: {
    width: "100%",
    height: "27%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  // details
  logo: {
    width: 80,
    height: 80,
  },
  btn: {
    width: "80%",
    textAlign: "center",
    borderRadius: 30,
  },
  input: {
    width: "80%",
    borderRadius: 30,
  },
});
