import React, {Component} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';

export default class WelcomePage extends Component {
  componentDidMount() {
    this.timer = setTimeout(() => {
      this.props.navigation.navigate('Login');
    }, 2000);
  }
  componentWillUnMount() {
    this.timer !== undefined ? this.clearTimeout(this.timer) : null;
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.wecomeText}>Welcome</Text>
        <View style={styles.mainContainer}>
          <View style={styles.mainContainer}>
            <View style={styles.oval}></View>
            <Image
              source={require('../assets/logo-final.png')}
              style={styles.logo}
            />
          </View>
          <View style={styles.mainTextContainer}>
            <Text style={styles.headText}>袋鼠教练</Text>
            <Text style={styles.headText}>E-Coach</Text>
          </View>
        </View>
        <Text style={styles.sloganText}>您的专属私人教练</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  // main logo
  mainContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    top: -25,
  },
  mainTextContainer: {
    position: 'relative',
    top: 30,
  },
  oval: {
    position: 'relative',
    bottom: 20,
    opacity: 0.14,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FF9B70',
    zIndex: 0,
  },
  logo: {
    position: 'absolute',
    top: 55,
    width: 140,
    height: 140,
  },
  // text
  wecomeText: {
    color: '#FF9B70',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headText: {
    color: '#707070',
    fontSize: 24,
    fontWeight: 'bold',
    position: 'relative',
    bottom: 40,
  },
  sloganText: {
    color: '#707070',
    fontSize: 24,
  },
});
