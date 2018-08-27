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
import { StyleSheet, Image, Text, Modal,TouchableOpacity, View } from 'react-native';
import store from 'react-native-simple-store';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../../components/Button';
import ImageButton from '../../components/ImageButtonWithText';
import ArrowButton from '../../components/ArrowButton';
import UserInfoPage from '../../pages/WebViewPage/UserInfoPageByWebView';
import WebViewPage from '../../pages/WebViewPage/WebViewPage';


const propTypes = {
};

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        userInfo: {},
        userInfoPageModal: false
    }
  }

  _openSignPage(){
    //const { signInUpActions } = this.props;
    //signInUpActions.initSignIn();
    //this.setState({signModal:true});
    this.props.navigation.navigate('Misc',{pageType:'sign',isSignIn:'false'});
  }

  _openUserInfoPage(){
    //this.setState({userInfoPageModal:true});
    let itemData={'url':this.state.userInfo.url,'title':this.state.userInfo.name,'content':this.state.userInfo.mood,'thumbImage':this.state.userInfo.avatar};
    this.props.navigation.navigate('Web',{itemData});
  }

  _closeUserInfoPage(){
    this.setState({userInfoPageModal:false});
  }

  _doNothing(){
  }

  _openSettingPage(){
    this.props.navigation.navigate('Sub',{subPage:'Setting'});
  }
  _openNotificationPage(){
    this.props.navigation.navigate('Sub',{subPage:'Notification'});
  }

  componentWillMount() {
    console.log('**************HomePage componentWillMount***************');
    store.get('userInfo').then((userInfo)=>{
      this.setState({userInfo:userInfo});
    });
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.login}>
          {this.state.userInfo.isSignIn=='true' ?
              <TouchableOpacity style={styles.userInfo} onPress={() => this._openUserInfoPage()}>
                <Image style={styles.userInfoAvatar} source={{ uri: this.state.userInfo.avatar }} />
                <Text style={styles.userInfoName}>{this.state.userInfo.name}</Text>
                <Text style={styles.userInfoMood}>{this.state.userInfo.mood}</Text>
              </TouchableOpacity>
            :
            <Button
                btnStyle={styles.loginButton}
                textStyle={{fontSize:20,textAlign: 'center',color: '#fff'}}
                text='登录/注册'
                onPress={() => this._openSignPage()}
            />
          }
          </View>

          <View style={{height: 5, backgroundColor:'#f0f4f4'}}/>

          <View style={styles.midContainer}>
            <View style={styles.midContent}>
              <ArrowButton text="我的消息" textStyle={styles.arrowButtonTextStyle}
              /* tips='评论/通知' tipsStyle={styles.arrowButtonTipsStyle} */
              icon='ios-arrow-forward'
              iconSize={14}
              iconColor='#aaa'
              onPress={() => this._openNotificationPage()}
              />
              <View style={{height: 1, backgroundColor:'#f0f4f4'}}/>
              <ArrowButton text="我的私信" textStyle={styles.arrowButtonTextStyle}
              icon='ios-arrow-forward-outline'
              iconSize={14}
              iconColor='#aaa'
              />
              <View style={{height: 1, backgroundColor:'#f0f4f4'}}/>
              <ArrowButton text="设置" textStyle={styles.arrowButtonTextStyle}
              icon='ios-arrow-forward-outline'
              iconSize={14}
              iconColor='#aaa'
              onPress={() => this._openSettingPage()}
              />
            </View>
          </View>

        </View>

        <View>
          <Modal
                animationType={'slide'}
                transparent={true}
                onRequestClose={() => this._closeUserInfoPage()}
                visible={this.state.userInfoPageModal}
          >
            <UserInfoPage userInfoUrl={this.state.userInfo.url} closePage={()=>this._closeUserInfoPage()}/>
          </Modal>
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
  }
});
HomePage.propTypes = propTypes;
export default HomePage;
