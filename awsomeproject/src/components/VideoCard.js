import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Layout, Card, Text, CheckBox} from '@ui-kitten/components';
import {default as theme} from '../custom-theme.json';
import Video from 'react-native-video';

export default function VideoCard() {
  const Header = props => (
    <View {...props}>
      <Text category="h6">仰卧起坐</Text>
    </View>
  );
  const Footer = props => {
    const [activeChecked, setActiveChecked] = React.useState(false);
    return (
      <View {...props} style={[props.style, styles.footerContainer]}>
        <CheckBox
          checked={activeChecked}
          onChange={nextChecked => setActiveChecked(nextChecked)}>
          选择该项目
        </CheckBox>
      </View>
    );
  };

  return (
    <React.Fragment>
      <Card style={styles.card} header={Header} footer={Footer}>
        <Video
          source={{
            uri: 'http://81.68.226.132/statics/video/%E5%85%A8%E8%BA%AB/%E6%AD%A3%E8%B8%A2%E8%85%BF.mp4',
          }}
          ref={ref => {
            this.player = ref;
          }}
          resizeMode="cover"
          repeat={true}
          style={styles.backgroundVideo}
        />
      </Card>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    width: '100%',
    margin: 2,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footerControl: {
    marginHorizontal: 2,
  },
  backgroundVideo: {
    width: '100%',
    height: 200,
  },
});
