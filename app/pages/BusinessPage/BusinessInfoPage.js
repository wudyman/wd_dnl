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
  ScrollView,
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
let itemData={};

class BusinessInfoPage extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <Icon.Button
        name="md-share"
        backgroundColor="transparent"
        underlayColor="transparent"
        color="#555"
        activeOpacity={0.8}
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
    const { params } = this.props.navigation.state;
    //itemData=params.itemData;
    this.setState({
      url:params.itemData.id,
      title:params.itemData.title,
      content:params.itemData.detail,
      thumbImage:params.itemData.pictures
    });
  }

  componentWillUnmount() {
    console.log('***********WebViewPage componentWillUnmount***************');
  }



  render() {
    //const { params } = this.props.navigation.state;
    return (
      <ScrollView style={styles.container}>
        <View>
          <Text>{this.state.title}</Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
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

export default BusinessInfoPage;