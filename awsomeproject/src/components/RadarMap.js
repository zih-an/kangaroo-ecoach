import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';

import { Shape, Surface, Path, Text as TextArt, Group } from '@react-native-community/art';

const { width, height } = Dimensions.get('window');
//链接https://blog.csdn.net/chunlv01/article/details/107369944/
export default (props) => {
  let baseWid = 80;
  let angle = ((2 * Math.PI) / 360) * 72; // 五边形内角弧度
  let angle1 = ((2 * Math.PI) / 360) * 18; // 90 - 72

  // 外层路径参数
  let path1 = Path();
  path1.moveTo(baseWid * Math.cos(angle1), baseWid);
  path1.lineTo(baseWid * Math.cos(angle1), 1);
  path1.close();

  let path2 = Path();
  path2.moveTo(baseWid * Math.cos(angle1), baseWid);
  path2.lineTo(1, baseWid - baseWid * Math.sin(angle1));
  path2.close();

  let path3 = Path();
  path3.moveTo(baseWid * Math.cos(angle1), baseWid);
  path3.lineTo(baseWid * Math.cos(angle1) * 2, baseWid - baseWid * Math.sin(angle1));
  path3.close();

  let path4 = Path();
  path4.moveTo(baseWid * Math.cos(angle1), baseWid);
  path4.lineTo(baseWid * Math.cos(angle1) - baseWid * Math.sin(angle / 2), baseWid + baseWid * Math.cos(angle / 2));
  path4.close();

  let path5 = Path();
  path5.moveTo(baseWid * Math.cos(angle1), baseWid);
  path5.lineTo(baseWid * Math.cos(angle1) + baseWid * Math.sin(angle / 2), baseWid + baseWid * Math.cos(angle / 2));
  path5.close();

  // 外层五边形路径
  let leiDaTu_path = Path()
    .moveTo(baseWid * Math.cos(angle1), 1)
    .lineTo(1, baseWid - baseWid * Math.sin(angle1))
    .lineTo(baseWid * Math.cos(angle1) - baseWid * Math.sin(angle / 2), baseWid + baseWid * Math.cos(angle / 2))
    .lineTo(baseWid * Math.cos(angle1) + baseWid * Math.sin(angle / 2), baseWid + baseWid * Math.cos(angle / 2))
    .lineTo(baseWid * Math.cos(angle1) * 2, baseWid - baseWid * Math.sin(angle1))
    .lineTo(baseWid * Math.cos(angle1), 1)
    .close();

  // let path1Text = Path();
  // path1Text.moveTo(baseWid * Math.cos(angle1) - 20, 1);
  // path1Text.lineTo(baseWid * Math.cos(angle1) + 20, 20);
  // path1Text.close();

  // let path2Text = Path();
  // path2Text.moveTo(baseWid * Math.cos(angle1), baseWid);
  // path2Text.lineTo(1, baseWid - baseWid * Math.sin(angle1));
  // path2Text.close();

  // let path3Text = Path();
  // path3Text.moveTo(baseWid * Math.cos(angle1), baseWid);
  // path3Text.lineTo(baseWid * Math.cos(angle1) * 2, baseWid - baseWid * Math.sin(angle1));
  // path3Text.close();

  // let path4Text = Path();
  // path4Text.moveTo(baseWid * Math.cos(angle1), baseWid);
  // path4Text.lineTo(baseWid * Math.cos(angle1) - baseWid * Math.sin(angle / 2), baseWid + baseWid * Math.cos(angle / 2));
  // path4Text.close();

  // let path5Text = Path();
  // path5Text.moveTo(baseWid * Math.cos(angle1), baseWid);
  // path5Text.lineTo(baseWid * Math.cos(angle1) + baseWid * Math.sin(angle / 2), baseWid + baseWid * Math.cos(angle / 2));
  // path5Text.close();

  // 内层直线长度百分比处理
  let items = props.items;
  let baseWid1 = 80 * items[0].percent;
  let baseWid2 = 80 * items[1].percent;
  let baseWid3 = 80 * items[2].percent;
  let baseWid4 = 80 * items[3].percent;
  let baseWid5 = 80 * items[4].percent;

  // 内层路径参数
  let path11 = Path();
  path11.moveTo(baseWid * Math.cos(angle1), baseWid);
  path11.lineTo(baseWid * Math.cos(angle1), baseWid - baseWid1);
  path11.close();

  let path22 = Path();
  path22.moveTo(baseWid * Math.cos(angle1), baseWid);
  path22.lineTo(baseWid * Math.cos(angle1) - baseWid2 * Math.cos(angle1), baseWid - baseWid2 * Math.sin(angle1));
  path22.close();

  let path33 = Path();
  path33.moveTo(baseWid * Math.cos(angle1), baseWid);
  path33.lineTo(baseWid * Math.cos(angle1) + baseWid3 * Math.cos(angle1), baseWid - baseWid3 * Math.sin(angle1));
  path33.close();

  let path44 = Path();
  path44.moveTo(baseWid * Math.cos(angle1), baseWid);
  path44.lineTo(baseWid * Math.cos(angle1) - baseWid4 * Math.sin(angle / 2), baseWid + baseWid4 * Math.cos(angle / 2));
  path44.close();

  let path55 = Path();
  path55.moveTo(baseWid * Math.cos(angle1), baseWid);
  path55.lineTo(baseWid * Math.cos(angle1) + baseWid5 * Math.sin(angle / 2), baseWid + baseWid5 * Math.cos(angle / 2));
  path55.close();

  // 内层五边形路径
  let leiDaTu_path1 = Path()
    .moveTo(baseWid * Math.cos(angle1), baseWid - baseWid1)
    .lineTo(baseWid * Math.cos(angle1) - baseWid2 * Math.cos(angle1), baseWid - baseWid2 * Math.sin(angle1))
    .lineTo(baseWid * Math.cos(angle1) - baseWid4 * Math.sin(angle / 2), baseWid + baseWid4 * Math.cos(angle / 2))
    .lineTo(baseWid * Math.cos(angle1) + baseWid5 * Math.sin(angle / 2), baseWid + baseWid5 * Math.cos(angle / 2))
    .lineTo(baseWid * Math.cos(angle1) + baseWid3 * Math.cos(angle1), baseWid - baseWid3 * Math.sin(angle1))
    .lineTo(baseWid * Math.cos(angle1), baseWid - baseWid1)
    .close();

  return (
    <View style={{ flex: 1, marginVertical: 20 }}>
      <Surface width={baseWid * Math.cos(angle1) * 2} height={baseWid * Math.cos(angle1) + baseWid}>
        <Group>
          <Shape d={leiDaTu_path} stroke="#FEBF5C" fill="#FEBF5C" strokeWidth={1} />
          <Shape d={path1} stroke="#FF952960" strokeWidth={1} />
          <Shape d={path2} stroke="#FF952960" strokeWidth={1} />
          <Shape d={path3} stroke="#FF952960" strokeWidth={1} />
          <Shape d={path4} stroke="#FF952960" strokeWidth={1} />
          <Shape d={path5} stroke="#FF952960" strokeWidth={1} />

          <Shape d={leiDaTu_path1} stroke="#FF9529" fill="#FF952990" strokeWidth={1} />
          <Shape d={path11} stroke="#FF9529" strokeWidth={1} />
          <Shape d={path22} stroke="#FF9529" strokeWidth={1} />
          <Shape d={path33} stroke="#FF9529" strokeWidth={1} />
          <Shape d={path44} stroke="#FF9529" strokeWidth={1} />
          <Shape d={path55} stroke="#FF9529" strokeWidth={1} />

          {/* <TextArt strokeWidth={1} stroke="#000" font="bold 14px Heiti SC" path={path1Text}>
            认知
          </TextArt>
          <TextArt strokeWidth={1} stroke="#000" font="bold 14px Heiti SC" path={path2Text}>
            健康
          </TextArt>
          <TextArt strokeWidth={1} stroke="#000" font="bold 14px Heiti SC" path={path3Text}>
            心理
          </TextArt>
          <TextArt strokeWidth={1} stroke="#000" font="bold 14px Heiti SC" path={path4Text}>
            沟通
          </TextArt>
          <TextArt strokeWidth={1} stroke="#000" font="bold 14px Heiti SC" path={path5Text}>
            信用
          </TextArt> */}
        </Group>
      </Surface>
      <Text style={[styles.outsideText, { top: -20, left: baseWid - 17 }]}>{items[0].content}</Text>
      <Text style={[styles.outsideText, { top: baseWid - 36, left: -32 }]}>{items[1].content}</Text>
      <Text style={[styles.outsideText, { top: baseWid - 36, left: baseWid + 75 }]}>{items[2].content}</Text>
      <Text style={[styles.outsideText, { top: baseWid * 2 - 20, left: baseWid - 86 }]}>{items[3].content}</Text>
      <Text style={[styles.outsideText, { top: baseWid * 2 - 20, left: baseWid + 50 }]}>{items[4].content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  outsideText: {
    fontSize: 15,
    color: '#333333',
    position: 'absolute',
  },
});

