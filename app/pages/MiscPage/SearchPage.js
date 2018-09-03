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
import { StyleSheet, Text, View,TextInput,Platform, ListView } from 'react-native';
import store from 'react-native-simple-store';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../../components/Button';
import ImageButton from '../../components/ImageButtonWithText';

import RequestUtil from '../../utils/RequestUtil';
import ItemList from '../../components/ItemList';
import ItemSearch from './ItemSearch';
import { concatFilterDuplicate, removeItemById } from '../../utils/ItemsUtil';
import { SITE_URL, SEARCH_URL } from '../../constants/Urls';
import { DATA_STEP } from '../../constants/Constants';

const propTypes = {
};

class SettingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        userInfo: {},
        keywordText: '',
        results: [],
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        }),
    }
  }

  _searchCallback(ret){
    console.log(ret);
    let resultDatas=[];
    if('fail'!=ret)
    {
      ret.map((item)=>{
        let data={};
        data.id=item[0];
        data.title=item[1];
        data.answer_nums=item[2];
        resultDatas.push(data);
      });
    }
    this.setState({results:resultDatas});
  }

  _search() {
    let keyword=this.state.keywordText.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,"");
    let type='all';
    let order=1;
    let start=0;
    let end=start+DATA_STEP*2;
    let url=SEARCH_URL+type+'/'+order+'/'+start+'/'+end+'/';
    let formData=new FormData();
    formData.append("keyword",keyword);
    RequestUtil.requestWithCallback(url,'POST',formData,this._searchCallback.bind(this));
  }

  componentWillMount() {
    this.setState({userInfo:gUserInfo});
  }

  onPress = (itemData) => {
    const { navigate } = this.props.navigation;
    navigate('Web', { itemData });
  };

  onRefresh = () => {
    console.log('**************onRefresh*********');
  };

  onEndReached = () => {
    console.log('**************onEndReached*********');
  };

  _renderFooter = () => {
    return <View />;
  };

  _renderItem = resultData => (
    <ItemSearch resultData={resultData} onPressHandler={this.onPress}/>
  );

  _renderResult() {
    let dataSource=this.state.dataSource.cloneWithRows(this.state.results);
    return (
        <ItemList
            dataSource={dataSource}
            isRefreshing={false}
            onEndReached={this.onEndReached}
            onRefresh={this.onRefresh}
            renderFooter={this._renderFooter}
            renderItem={this._renderItem}
        />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flexDirection:'row',alignItems: 'center',justifyContent: 'space-between'}}>
            <View style={styles.closeButton}>
                    <ImageButton
                        onPress={this.props.closePage}
                        icon="ios-arrow-back"
                        iconColor="#555"
                        iconSize={25}
                        btnStyle={{width: 45, height: 45,padding:10}}
                        activeOpacity={0.2}
                    />
            </View>
            <View style={{flexDirection:'row',alignItems: 'center',marginTop:0,marginRight:20,paddingLeft:20,backgroundColor:'transparent',borderColor:'#f0f0f0',borderWidth:1,borderRadius: 20}}>
                <Icon name="md-search" size={20} color='#aaaaaa' />
                <TextInput
                style={{width:200,padding:2,fontSize:14,textAlign:'left'}}
                autoFocus= {true}
                selectionColor='#228b22'
                placeholder='请输入关键字'
                placeholderTextColor='#aaaaaa'
                onChangeText={
                    (text) => {
                      console.log(text);
                      this.setState({keywordText:text});
                    }
                  }
                underlineColorAndroid='transparent' />
            </View>
            <View style={{}}>
                <Button
                    btnStyle={{padding:10}}
                    textStyle={{color:'black',fontSize:16}}
                    text='搜索'
                    onPress={this._search.bind(this)}
                    activeOpacity={0.2}
                />
            </View>
        </View>
        <View style={styles.content}>
            {this.state.keywordText ?
            <View style={styles.result}>
            {this._renderResult()}
            </View>
            :
            <View style={styles.recommend}>
              <View style={styles.hot}>
                  <Text style={{paddingBottom:10,fontSize:15,color:"#aaaaaa"}}>热门搜索</Text>
                  <View style={{height: 1, backgroundColor:'#f0f0f0'}}/>
              </View>
            </View>
            }
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
  closeButton:{
    marginTop: (Platform.OS === 'ios') ? 10 : 0,
    backgroundColor: '#fff'
  },
  content: {
    //flex: 1,
    margin:10,
    justifyContent: 'center',
    paddingBottom: 10
  },
  hot: {

  },
});
SettingPage.propTypes = propTypes;
export default SettingPage;
