import React from "react";
import { StyleSheet, View } from "react-native";
import { Layout, Card, Text, CheckBox } from "@ui-kitten/components";
import { default as theme } from "../custom-theme.json";
// import VideoPlayer from "react-native-video-player";

export default function VideoCard() {
  const Header = (props) => (
    <View {...props}>
      <Text category="h6">仰卧起坐</Text>
    </View>
  );
  const Footer = (props) => {
    const [activeChecked, setActiveChecked] = React.useState(false);
    return (
      <View {...props} style={[props.style, styles.footerContainer]}>
        <CheckBox
          checked={activeChecked}
          onChange={(nextChecked) => setActiveChecked(nextChecked)}
        >
          选择该项目
        </CheckBox>
      </View>
    );
  };

  return (
    <React.Fragment>
      <Card style={styles.card} header={Header} footer={Footer}>
        {/* <VideoPlayer
          video={{
            uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          }}
          videoWidth={1600}
          videoHeight={900}
          thumbnail={{ uri: "https://i.picsum.photos/id/866/1600/900.jpg" }}
        /> */}
        <Text>
          The Maldives, officially the Republic of Maldives, is a small country
          in South Asia, located in the Arabian Sea of the Indian Ocean. It lies
          southwest of Sri Lanka and India, about 1,000 kilometres (620 mi) from
          the Asian continent
        </Text>
      </Card>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    margin: 2,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  footerControl: {
    marginHorizontal: 2,
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
