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
import {
  StyleSheet,
  BackHandler,
  Dimensions,
  Text,
  Image,
  DeviceEventEmitter,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Modal
} from 'react-native';

import * as WeChat from 'react-native-wechat';
import Icon from 'react-native-vector-icons/Ionicons';
import ToastUtil from '../../utils/ToastUtil';
import LoadingView from '../../components/LoadingView';
import { formatStringWithHtml,formatUrlWithSiteUrl } from '../../utils/FormatUtil';
import WebView2 from '../../components/WebView2';
import { SITE_NAME } from '../../constants/Urls';

let canGoBack = false;
let lastCanGoBack = false;
const shareIconWechat = require('../../img/share_icon_wechat.png');
const shareIconMoments = require('../../img/share_icon_moments.png');

class WebViewPage extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <Icon.Button
        name="md-share"
        backgroundColor="transparent"
        underlayColor="transparent"
        color="#555"
        activeOpacity={0.8}
        onPress={() => {
          navigation.state.params.handleShare();
        }}
      />
    )
  });

  constructor(props) {
    super(props);
    this.state = {
      isShareModal: false,
      url:'',
      title:'',
      content:'',
      thumbImage:''
    };
  }

  componentDidMount() {
    console.log('***********WebViewPage componentDidMount***************');
    isMainPage=false;
    canGoBack = false;
    lastCanGoBack = false;
    this.props.navigation.setParams({ handleShare: this.onActionSelected });
    BackHandler.addEventListener('hardwareBackPress', this.goBack);
    const { params } = this.props.navigation.state;
    this.setState({
      url:params.itemData.url,
      title:params.itemData.title,
      content:params.itemData.format_content,
      thumbImage:params.itemData.contentImg
    });
  }

  componentWillUnmount() {
    console.log('***********WebViewPage componentWillUnmount***************');
    isMainPage=true;
    BackHandler.removeEventListener('hardwareBackPress', this.goBack);
  }

  onActionSelected = () => {
    this.setState({
      isShareModal: true
    });
  };

  onNavigationStateChange = (navState) => {
    canGoBack = navState.canGoBack;
    if((lastCanGoBack)&&(!canGoBack))
      this.props.navigation.pop();
    lastCanGoBack=canGoBack;
  };

  onMessage = (event) => {
    const message = JSON.parse(event.nativeEvent.data);
    if('login'==message.command)
    {
      if('false'==message.payload.status)
      {
        ToastUtil.showShort("此功能需要先登录");
        this.props.navigation.navigate('Misc',{pageType:'sign',isSignIn:'false'});
      }
    }
    else if('page'==message.command)
    {
      this.setState({
        url:message.payload.url,
        title:message.payload.title,
        content:message.payload.content,
        thumbImage:message.payload.thumbImage,
      });
    }
    else if('user'==message.command)
    {
      if(gUserInfo.id==message.payload.id)
      {
        gUserInfo.name=message.payload.name;
        gUserInfo.avatar=formatUrlWithSiteUrl(message.payload.avatar);
        gUserInfo.mood=message.payload.mood;
        DeviceEventEmitter.emit('changeUserInfo', gUserInfo);
      }
    }

  }

  goBack = () => {
    if (this.state.isShareModal) {
      this.setState({
        isShareModal: false
      });
      return true;
    } else if (canGoBack) {
      this.webview.goBack();
      return true;
    }
    return false;
  };

  renderLoading = () => <LoadingView />;

  renderSpinner = () => {
    //const { params } = this.props.navigation.state;
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.setState({
            isShareModal: false
          });
        }}
      >
        <View key="spinner" style={styles.spinner}>
          <View style={styles.spinnerContent}>
            <Text
              style={[styles.spinnerTitle, { fontSize: 20, color: 'black' }]}
            >
              分享到
            </Text>
            <View style={styles.shareParent}>
              <TouchableOpacity
                style={styles.base}
                onPress={() => {
                  WeChat.isWXAppInstalled().then((isInstalled) => {
                    if (isInstalled) {
                      WeChat.shareToSession({
                        title: formatStringWithHtml(this.state.title),
                        description: formatStringWithHtml(this.state.content),
                        thumbImage: this.state.thumbImage,
                        type: 'news',
                        webpageUrl: this.state.url
                      }).catch((error) => {
                        ToastUtil.showShort(error.message, true);
                      });
                    } else {
                      ToastUtil.showShort('没有安装微信软件，请您安装微信之后再试', true);
                    }
                  });
                }}
              >
                <View style={styles.shareContent}>
                  <Image style={styles.shareIcon} source={shareIconWechat} />
                  <Text style={styles.spinnerTitle}>微信</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.base}
                onPress={() => {
                  WeChat.isWXAppInstalled().then((isInstalled) => {
                    if (isInstalled) {
                      WeChat.shareToTimeline({
                        title: formatStringWithHtml(`[@${SITE_NAME}]${this.state.title}`),
                        description: formatStringWithHtml(this.state.content),
                        thumbImage: this.state.thumbImage,
                        type: 'news',
                        webpageUrl: this.state.url
                      }).catch((error) => {
                        ToastUtil.showShort(error.message, true);
                      });
                    } else {
                      ToastUtil.showShort('没有安装微信软件，请您安装微信之后再试', true);
                    }
                  });
                }}
              >
                <View style={styles.shareContent}>
                  <Image style={styles.shareIcon} source={shareIconMoments} />
                  <Text style={styles.spinnerTitle}>朋友圈</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    //const { params } = this.props.navigation.state;
    return (
      <View style={styles.container}>
        <Modal
          animationType="fade"
          visible={this.state.isShareModal}
          transparent
          onRequestClose={() => {
            this.setState({
              isShareModal: false
            });
          }}
        >
          {this.renderSpinner()}
        </Modal>
        <WebView2
          ref={(ref) => {
            this.webview = ref;
          }}
          style={styles.base}
          onMessage={this.onMessage}
          source={{ uri: this.state.url }}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          scalesPageToFit
          decelerationRate="normal"
          injectedJavaScript={`g_is_app="true";$(".Mobile-header").addClass("is-hide");`}
          onShouldStartLoadWithRequest={() => {
            const shouldStartLoad = true;
            return shouldStartLoad;
          }}
          onNavigationStateChange={this.onNavigationStateChange}
          renderLoading={this.renderLoading}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  base: {
    flex: 1
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFF'
  },
  spinner: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)'
  },
  spinnerContent: {
    justifyContent: 'center',
    width: Dimensions.get('window').width * (7 / 10),
    height: Dimensions.get('window').width * (7 / 10) * 0.68,
    backgroundColor: '#fcfcfc',
    padding: 20,
    borderRadius: 5
  },
  spinnerTitle: {
    fontSize: 18,
    color: '#313131',
    textAlign: 'center',
    marginTop: 5
  },
  shareParent: {
    flexDirection: 'row',
    marginTop: 20
  },
  shareContent: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  shareIcon: {
    width: 40,
    height: 40
  }
});

export default WebViewPage;
