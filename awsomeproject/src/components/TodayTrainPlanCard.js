import React from 'react';
import {StyleSheet} from 'react-native';
import {
  Card,
  Text,
  Divider,
  List,
  ListItem,
  Layout,
} from '@ui-kitten/components';
import {Icon} from '@ui-kitten/components';
import {default as theme} from '../custom-theme.json';

const data = new Array(8).fill({
  title: 'Item',
  description: 'Description for Item',
});
const renderItemIcon = props => <Icon {...props} name="person" />;

export default function TodayTrainPlanCard(props) {
  const renderItem = ({item, index}) => (
    <ListItem
      title={`${item.title} ${index + 1}`}
      description={`${item.description} ${index + 1}`}
      accessoryLeft={renderItemIcon}
    />
  );

  return (
    <Layout style={styles.cardPlanContainer}>
      <Text category="h5" style={styles.dateStyle}>
        xx年xx月xx日
      </Text>
      <Card>
        <Text category="s1" style={{color: theme['color-primary-800']}}>
          今日训练计划
        </Text>
        <List
          style={{maxHeight: 110, marginTop: 8}}
          data={data}
          ItemSeparatorComponent={Divider}
          renderItem={renderItem}
        />
      </Card>
    </Layout>
  );
}

const styles = StyleSheet.create({
  cardPlanContainer: {
    width: '90%',
  },
  dateStyle: {
    alignSelf: 'center',
  },
});
