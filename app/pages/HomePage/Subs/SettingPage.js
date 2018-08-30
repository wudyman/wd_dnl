/**
 *
 * Copyright 2016-present wd_dnl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import store from 'react-native-simple-store';
import NavigationUtil from '../../../utils/NavigationUtil';
import RequestUtil from '../../../utils/RequestUtil';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../../../components/Button';
import ImageButton from '../../../components/ImageButtonWithText';
import ArrowButton from '../../../components/ArrowButton';
import { LOG_OUT_URL } from '../../../constants/Urls';

const propTypes = {
};

class SettingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        userInfo: {}
    }
  }

  _about() {
    this.props.navigation.navigate('Sub',{subPage:'about'});
  }

  _feedBack() {
    this.props.navigation.navigate('Sub',{subPage:'feedback'});
  }

  _checkUpdate(){
    
  }

  _doNothing(){
  }

  _logOutCallback(ret) {

  }

  _logOut(){
    let url=LOG_OUT_URL;
    RequestUtil.requestWithCallback(url,'POST','',this._logOutCallback.bind(this));
    
    gUserInfo={};
    gUserInfo.isSignIn='false';
    this.setState({userInfo: gUserInfo});
    store.save('userInfo',gUserInfo)
    .then(
      NavigationUtil.reset(this.props.navigation, 'Home')
    );
  
  }

  componentWillMount() {
    this.setState({userInfo:gUserInfo});
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>


          <View style={{height: 5, backgroundColor:'#f0f4f4'}}/>

          <View style={styles.midContainer}>
            <View style={styles.midContent}>
              <ArrowButton text="意见反馈" textStyle={styles.arrowButtonTextStyle}
              icon='ios-arrow-forward-outline'
              iconSize={14}
              iconColor='#aaa'
              onPress={() => this._feedBack()}
              />
              <View style={{height: 1, backgroundColor:'#f0f4f4'}}/>
              <ArrowButton text="检查更新" textStyle={styles.arrowButtonTextStyle}
              tips={`V${DeviceInfo.getVersion()}`} tipsStyle={styles.arrowButtonTipsStyle}
              icon='ios-arrow-forward-outline'
              iconSize={14}
              iconColor='#aaa'
              onPress={() => this._checkUpdate()}
              />
              <View style={{height: 1, backgroundColor:'#f0f4f4'}}/>
              <ArrowButton text="关于" textStyle={styles.arrowButtonTextStyle}
              icon='ios-arrow-forward-outline'
              iconSize={14}
              iconColor='#aaa'
              onPress={() => this._about()}
              />
              <View style={{height: 1, backgroundColor:'#f0f4f4'}}/>
            </View>
          </View>

          <View>
            {this.state.userInfo.isSignIn=='true'?
            <Button
              btnStyle={styles.logOutBtn}
              textStyle={styles.logOutBtnText}
              text="退出账号"
              onPress={() => this._logOut()}
            />
            :
            <View />
            }
          </View>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff'
  },
  content: {
    //flex: 1,
    justifyContent: 'center',
    paddingBottom: 10
  },
  login: {
    //flex: 1,
    padding:10,
    alignItems: 'center'
  },
  loginButton: {
    margin: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 50,
    backgroundColor: '#228b22'
  },
  logo: {
    width: 110,
    height: 110,
    marginTop: 50
  },
  userInfo: {
    alignItems: 'center'
  },
  userInfoAvatar: {
    width: 70,
    height: 70,
    borderRadius:35
  },
  userInfoName: {
    fontSize:20,
    fontWeight: 'bold',
    alignItems: 'center'
  },
  userInfoMood: {
    alignItems: 'center'
  },
  version: {
    fontSize: 16,
    textAlign: 'center',
    color: '#aaaaaa',
    marginTop: 5
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    color: '#313131',
    marginTop: 10
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#4e4e4e'
  },
  midContainer: {
    //alignItems: 'flex-start'
    padding:20
  },
  midContent: {
    //flexDirection: 'column'
  },
  arrowButtonTextStyle: {
    fontSize: 16,
    color:'#555',
    textAlign: 'left'
  },
  arrowButtonTipsStyle: {
    fontSize: 14,
    color:'#aaa',
    marginRight:5
  },
  logOutBtn: {
    margin: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#dc143c'
  },
  logOutBtnText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff'
  },
});
SettingPage.propTypes = propTypes;
export default SettingPage;
