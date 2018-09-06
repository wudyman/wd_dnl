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
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../../components/Button';
import ImageButton from '../../components/ImageButtonWithText';
import RequestUtil from '../../utils/RequestUtil';
import ItemList from '../../components/ItemList';
import ItemSearchContent from './ItemSearchContent';
import ItemSearchPeople from './ItemSearchPeople';
import ItemSearchTopic from './ItemSearchTopic';
import ItemSearchHotWord from './ItemSearchHotWord';
import ToastUtil from '../../utils/ToastUtil';
import { formatUrlWithSiteUrl } from '../../utils/FormatUtil';
import { SITE_URL, SEARCH_URL, HOTWORD_URL } from '../../constants/Urls';
import { DATA_STEP_DOUBLE } from '../../constants/Constants';

const propTypes = {
};

const SEARCH_TYPE = [['0','content','内容',0],['1','people','用户',0],['2','topic','栏目',0]];
const INDEX_ID =0;
const INDEX_TYPE =1;
const INDEX_NAME =2;
const INDEX_DATAINDEX =3;

let currentTabIndex=0;
let currentSearchType=SEARCH_TYPE[0][INDEX_NAME];
let currentDataIndex=0;
let resultDatas=[[],[],[]];

let keywordText='';

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        hotwords: [],
        keywordText: '',
        results: [],
        showResult: false,
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        }),
    }
  }

  _searchCallback(ret,callbackarg){
    if('fail'!=ret)
    {
      let contents=resultDatas[0];
      let users=resultDatas[1];
      let topics=resultDatas[2];
      ret[0].map((item)=>{
        let question={};
        question.id=item[0];
        question.title=item[1];
        question.url=SITE_URL+"/question/"+question.id+"/";
        contents.push(question);
      });
      ret[1].map((item)=>{
        let article={};
        article.id=item[0];
        article.title=item[1];
        article.url=SITE_URL+"/article/"+article.id+"/";
        contents.push(article);
      });
      ret[2].map((item)=>{
        let user={};
        user.id=item[0];
        user.name=item[1];
        user.avatar=formatUrlWithSiteUrl(item[2]);
        user.mood=item[3];
        user.url=SITE_URL+"/er/"+user.id+"/";
        users.push(user);
      });
      ret[3].map((item)=>{
        let topic={};
        topic.id=item[0];
        topic.name=item[1];
        topic.avatar=formatUrlWithSiteUrl(item[2]);
        topic.detail=item[3];
        topic.url=SITE_URL+"/topic/"+topic.id+"/";
        topics.push(topic);
      });
      /*
      resultDatas=[];
      resultDatas.push(contents);
      resultDatas.push(users);
      resultDatas.push(topics);
      */
      SEARCH_TYPE[callbackarg][INDEX_DATAINDEX]+=DATA_STEP_DOUBLE;
    }
    else{
      ToastUtil.showShort('没有更多内容了');
    }
    this.setState({results:resultDatas,showResult:true});
  }

  _search(start) {
    let keyword=keywordText.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,"");
    if(keyword)
    {
      let type=currentSearchType;
      let order=1;
      let end=start+DATA_STEP_DOUBLE;
      let url=SEARCH_URL+type+'/'+order+'/'+start+'/'+end+'/';
      let formData=new FormData();
      formData.append("keyword",keyword);
      RequestUtil.requestWithCallback(url,'POST',formData,this._searchCallback.bind(this),callbackarg=currentTabIndex);
    }
    else
    {
      ToastUtil.showShort("请输入有效关键字");
    }
  }

  _pressSearch() {
    currentTabIndex=0;
    currentSearchType=SEARCH_TYPE[0][INDEX_TYPE];
    currentDataIndex=0;
    resultDatas=[[],[],[]];
    SEARCH_TYPE[0][INDEX_DATAINDEX]=0;
    SEARCH_TYPE[1][INDEX_DATAINDEX]=0;
    SEARCH_TYPE[2][INDEX_DATAINDEX]=0;
    this.setState({results:resultDatas,showResult:false});
    this._search(currentDataIndex);
  }

  _getHotWordsCallback(ret)
  {
    let hotwords=[];
    if('fail'!=ret)
    {
      ret.map((item)=>{
        hotwords.push(item);
      });
      if(ret.length<10)
      {
        for (i=0;i<10-ret.length;i++)
          hotwords.push(['',0]);
      }
    }
    else{
      for (i=0;i<10;i++)
      hotwords.push(['',0]);
    }
    this.setState({hotwords:hotwords});
    console.log(this.state.hotwords);
  }
  _getHotWords(){
    let url=HOTWORD_URL;
    RequestUtil.requestWithCallback(url,'POST','',this._getHotWordsCallback.bind(this));
  }

  componentWillMount() {
    this._getHotWords();
  }

  onPress = (itemData) => {
    const { navigate } = this.props.navigation;
    navigate('Web', { itemData });
  };

  onRefresh = () => {
    console.log('**************onRefresh*********');
    this._pressSearch();
  };

  onEndReached = () => {
    console.log('**************onEndReached*********');
    currentDataIndex=SEARCH_TYPE[currentTabIndex][INDEX_DATAINDEX];
    this._search(currentDataIndex);
  };

  _selectKeyWord = (keyword) => {
    keywordText=keyword;
    this.setState({placeholderText:keywordText,keywordText:keywordText});
    this._pressSearch();
  };

  _renderFooter = () => {
    return <View />;
  };

  _renderItem = resultData => {
    if(0==currentTabIndex)
      return <ItemSearchContent resultData={resultData} onPressHandler={this.onPress}/>
    else if(1==currentTabIndex)
      return <ItemSearchPeople resultData={resultData} onPressHandler={this.onPress}/>
    else if(2==currentTabIndex)
      return <ItemSearchTopic resultData={resultData} onPressHandler={this.onPress}/>
  };

  _renderResult(typeId) {
    let dataSource=this.state.dataSource.cloneWithRows(this.state.results[parseInt(typeId)]);
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

  _renderHotWord() {
    if(this.state.hotwords.length>0)
      return (
        <View>
          <ItemSearchHotWord index='1' indexColor={{color:'#ff7243'}} keyword={this.state.hotwords[0][0]} onPressHandler={this._selectKeyWord}/>
          <ItemSearchHotWord index='2' indexColor={{color:'#ff923f'}} keyword={this.state.hotwords[1][0]} onPressHandler={this._selectKeyWord}/>
          <ItemSearchHotWord index='3' indexColor={{color:'#ffc639'}} keyword={this.state.hotwords[2][0]} onPressHandler={this._selectKeyWord}/>
          <ItemSearchHotWord index='4' keyword={this.state.hotwords[3][0]} onPressHandler={this._selectKeyWord}/>
          <ItemSearchHotWord index='5' keyword={this.state.hotwords[4][0]} onPressHandler={this._selectKeyWord}/>
          <ItemSearchHotWord index='6' keyword={this.state.hotwords[5][0]} onPressHandler={this._selectKeyWord}/>
          <ItemSearchHotWord index='7' keyword={this.state.hotwords[6][0]} onPressHandler={this._selectKeyWord}/>
          <ItemSearchHotWord index='8' keyword={this.state.hotwords[7][0]} onPressHandler={this._selectKeyWord}/>
          <ItemSearchHotWord index='9' keyword={this.state.hotwords[8][0]} onPressHandler={this._selectKeyWord}/>
          <ItemSearchHotWord index='10' keyword={this.state.hotwords[9][0]} onPressHandler={this._selectKeyWord}/>
        </View>
      );
  }

  _renderContent() {
    if(this.state.showResult)
    {
      const content = SEARCH_TYPE.map((type) => {
        const typeView = (
          <View key={type[INDEX_ID]} tabLabel={type[INDEX_NAME]} style={styles.base}>
            {(currentSearchType==type[INDEX_TYPE])? 
              this._renderResult(
                type[INDEX_ID]
            )
            :
            <View/>
            }
          </View>
        );
        return typeView;
      });
      return (      
          <ScrollableTabView
            ref="myScrollableTabView"
            renderTabBar={() => (
              <DefaultTabBar
                style={{borderWidth:1,borderColor:'#f8f8f8'}}
                tabStyle={styles.tab}
                textStyle={styles.tabText}
              />
            )}
            initialPage={0}
            locked={false}
            scrollWithoutAnimation={false}
            onChangeTab={(obj) => {
                console.log('**************searchPage onChangeTab*********');
                currentTabIndex=obj.i;
                currentSearchType=SEARCH_TYPE[currentTabIndex][INDEX_TYPE];
                currentDataIndex=SEARCH_TYPE[currentTabIndex][INDEX_DATAINDEX];
                this._search(currentDataIndex);
              }
            }
            tabBarBackgroundColor="#ffffff"
            tabBarUnderlineStyle={styles.tabBarUnderline}
            tabBarActiveTextColor="#228b22"
            tabBarInactiveTextColor="#888"
          >
            {content}
          </ScrollableTabView>
          );
    }
    else{
        if(this.state.keywordText)
          return (<View />);
        else
          return (
              <View style={styles.recommend}>
                <View style={styles.hot}>
                    <Text style={{paddingBottom:10,fontSize:15,color:"#aaaaaa"}}>热门搜索</Text>
                    <View style={{height: 1, backgroundColor:'#f0f0f0'}}/>
                    {this._renderHotWord()}
                </View>
              </View>
          );
    }
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
                ref="myTextInput"
                style={{width:200,padding:2,fontSize:14,textAlign:'left'}}
                autoFocus= {true}
                selectionColor='#228b22'
                placeholder= '请输入关键字'
                placeholderTextColor='#aaaaaa'
                defaultValue={this.state.keywordText}
                onChangeText={
                    (text) => {
                        resultDatas=[[],[],[]];
                        keywordText=text;
                        this.setState({keywordText:keywordText,results:resultDatas,showResult:false});
                    }
                  }
                underlineColorAndroid='transparent' />
            </View>
            <View style={{}}>
                <Button
                    btnStyle={{padding:10}}
                    textStyle={{color:'black',fontSize:16}}
                    text='搜索'
                    onPress={this._pressSearch.bind(this)}
                    activeOpacity={0.2}
                />
            </View>
        </View>
        <View style={{marginBottom:20}}></View>
        {this._renderContent()}
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
  recommend: {
    margin:10,
    justifyContent: 'center',
    paddingBottom: 10
  },
  tabBarUnderline: {
    backgroundColor: 'transparent',
  },
  hot: {

  },
});
SearchPage.propTypes = propTypes;
export default SearchPage;
