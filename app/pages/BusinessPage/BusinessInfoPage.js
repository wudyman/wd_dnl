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
import RequestUtil from '../../utils/RequestUtil';
import ToastUtil from '../../utils/ToastUtil';
import Button from '../../components/Button';
import { formatStringWithHtml,formatUrlWithSiteUrl } from '../../utils/FormatUtil';
import { SITE_URL, SITE_NAME, UPDATE_BUSINESS_URL } from '../../constants/Urls';
import moment from 'moment';

let canGoBack = false;
let lastCanGoBack = false;
const shareIconWechat = require('../../img/share_icon_wechat.png');
const shareIconMoments = require('../../img/share_icon_moments.png');
let businessInfoData={};

class BusinessInfoPage extends React.Component {
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
      haveUpdate:false,
      showRevise:false,
      isShareModal: false,
      url:'',
      title:'',
      content:'',
      thumbImage:''
    };
  }

  componentWillMount() {
    console.log('***********BusinessInfoPage componentWillMount***************');
    isMainPage=true;
    const { params } = this.props.navigation.state;
    businessInfoData.id=params.itemData.id;
    businessInfoData.type=params.itemData.type;
    businessInfoData.title=params.itemData.title;
    businessInfoData.detail=params.itemData.detail;
    businessInfoData.addr=params.itemData.addr;
    businessInfoData.addr_value=params.itemData.addr_value;
    businessInfoData.contact=params.itemData.contact;
    businessInfoData.pictures=params.itemData.pictures;
    businessInfoData.pub_date=params.itemData.pub_date;
    businessInfoData.update_date=params.itemData.update_date;
    businessInfoData.poster_id=params.itemData.poster_id;
    businessInfoData.poster_name=params.itemData.poster_name;

    businessInfoData.url=params.itemData.url;
    businessInfoData.pictures_array=params.itemData.pictures_array;

    if(businessInfoData.poster_id==gUserInfo.id)
      this.setState({showRevise:true})

  }

  componentDidMount() {
    console.log('***********BusinessInfoPage componentDidMount***************');
    this.props.navigation.setParams({ handleShare: this.onActionSelected });
    //BackHandler.addEventListener('hardwareBackPress', this.goBack);
    const { params } = this.props.navigation.state;
    this.setState({
      url:businessInfoData.url,
      title:businessInfoData.title,
      content:businessInfoData.detail,
      thumbImage:businessInfoData.pictures_array[0]
    });
  }


  componentWillUnmount() {
    console.log('***********BusinessInfoPage componentWillUnmount***************');
    isMainPage=true;
  }

  onActionSelected = () => {
    this.setState({
      isShareModal: true
    });
  };

  _updateTimeCallback(ret){
    if('fail'!=ret){
      businessInfoData.update_date=ret;
      this.setState({haveUpdate:true});
    }
  }

  _updateTime(){

    let url=UPDATE_BUSINESS_URL+'time/';
    let formData=new FormData();
    formData.append("business_id",businessInfoData.id);
    RequestUtil.requestWithCallback(url,'POST',formData,this._updateTimeCallback.bind(this));
  }

  _reviseBusiness(){
    this.props.navigation.navigate('Misc',{pageType:'businessPost',isSignIn:gUserInfo.isSignIn,isRevise:true,businessInfoData:businessInfoData});
  }

  _openHomePage(){
    const { navigate } = this.props.navigation;
    let itemData={};
    itemData.url=SITE_URL+"/er/"+businessInfoData.poster_id+"/";;
    itemData.title=businessInfoData.poster_name;
    navigate('Web', { itemData });
  }

  _renderPictures(){
    console.log('***********BusinessInfoPage _renderPictures***************');
    if(businessInfoData.pictures){
      const picturesContent = businessInfoData.pictures_array.map((picture,index) => {
        const pictureItem = (
          <View key={index} style={{padding:3}}>
            <Image  style={styles.picture} source={{ uri: picture }} />
          </View>
        );
        return pictureItem;
      });
      return picturesContent;
    }
  }

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
    console.log('***********BusinessInfoPage render***************');
    //const { params } = this.props.navigation.state;
    return (
      <ScrollView style={styles.container}>
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
        <View style={styles.title}>
          <Text style={styles.titleText}>{formatStringWithHtml(businessInfoData.title)}</Text>
        </View>
        <View style={styles.time}>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.timeText}>发布时间  </Text>
            <Text style={styles.timeText}>{moment(businessInfoData.pub_date).fromNow()}</Text>
          </View>
            <View style={{flexDirection:'row'}}>
            <Text style={styles.timeText}>更新时间  </Text>
            <Text style={styles.timeText}>{moment(businessInfoData.update_date).fromNow()}</Text>
          </View>
        </View>
        {this.state.showRevise?
        <View style={styles.revise}>
          <Button text={this.state.haveUpdate?"已更新":"更新时间"} btnStyle={styles.updateBtnStyle} textStyle={{color:'#228b22'}} onPress={() => this._updateTime()}></Button>
          <Button text="修改信息" btnStyle={styles.reviseBtnStyle} textStyle={{color:'white'}} onPress={() => this._reviseBusiness()}></Button>
        </View>
        :
        <View/>
        }
        <View style={{height: 10, backgroundColor:'#f4f4f4'}}/>
        <View style={styles.addr}>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.addrTint}>地        点  </Text>
            <Text style={styles.addrText}>{formatStringWithHtml(businessInfoData.addr)}</Text>
          </View>
          <View style={{height: 1, backgroundColor:'#f4f4f4',marginVertical:10}}/>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.addrTint}>发  布  者  </Text>
            <TouchableOpacity onPress={() => this._openHomePage()}>
            <Text style={{fontSize:15,color: '#609060'}}>{formatStringWithHtml(businessInfoData.poster_name)}</Text>
            </TouchableOpacity>
          </View>
          <View style={{height: 1, backgroundColor:'#f4f4f4',marginVertical:10}}/>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.addrTint}>联系方式  </Text>
            <Text style={styles.addrText}>{formatStringWithHtml(businessInfoData.contact)}</Text>
          </View>
        </View>
        <View style={{height: 10, backgroundColor:'#f4f4f4'}}/>
        <View style={styles.detail}>
          <Text style={styles.detailTint}>详细信息</Text>
          <View style={{height: 1, backgroundColor:'#f4f4f4',marginVertical:10}}/>
          <Text style={styles.detailText}>{formatStringWithHtml(businessInfoData.detail)}</Text>
          {this._renderPictures()}
          <Text style={{color:'red',marginTop:10}}>联系我时，请说是在大农令上看到的，谢谢！</Text>
        </View>
        <View style={styles.bottom}>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFF',
  },
  title: {
    //alignItems:'center',
    //paddingHorizontal:10,
    padding:10,
  },
  titleText: {
    fontSize: 18,
    color: '#1a1a1a',
    fontWeight:'700',
  },
  time: {
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal:10,
    paddingBottom:20
  },
  timeText: {
    fontSize: 13,
    color: '#aaa'
  },
  revise: {
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal:10,
    paddingBottom:20
  },
  updateBtnStyle: {
    paddingVertical:5,
    paddingHorizontal:20,
    borderColor:'#228b22',
    borderWidth:1
  },
  reviseBtnStyle: {
    paddingVertical:5,
    paddingHorizontal:20,
    backgroundColor:'#228b22'
  },
  addr: {
    padding:10
  },
  addrTint: {
    fontSize: 15,
    color:'#aaa'
  },
  addrText: {
    fontSize: 15,
    color:'#333'
  },
  detail: {
    padding:10
  },
  detailTint: {
    color:'#333',
    fontSize: 15,
  },
  detailText: {
    fontSize: 15,
  },
  picture: {
    width: Dimensions.get('window').width-30,
    height: (Dimensions.get('window').width-30),
    resizeMode:'contain'
  },
  bottom: {
    marginBottom:30,
  },
  base: {
    flex: 1
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