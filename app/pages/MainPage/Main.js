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
import {
  DeviceEventEmitter,
  InteractionManager,
  ListView,
  StyleSheet,
  View
} from 'react-native';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import store from 'react-native-simple-store';

import LoadingView from '../../components/LoadingView';
import ToastUtil from '../../utils/ToastUtil';
import { getArticleList } from '../../utils/ItemsUtil';
import ItemCell from './ItemCell';
import Footer from './Footer';
import EmptyView from './EmptyView';
import ItemListView from './ItemListView';
import { DATA_STEP } from '../../constants/Constants';
import { HEAD_TOPIC_ID, ANSWER_TOPIC_ID } from '../../constants/Constants';


const propTypes = {
  readActions: PropTypes.object,
  read: PropTypes.object.isRequired
};

const preTopic1={'id':HEAD_TOPIC_ID,'name':'头条','dataIndex':0};
const preTopic2={'id':ANSWER_TOPIC_ID,'name':'待回答','dataIndex':0};
let myTopics=[];

let loadMoreTime = 0;
let currentLoadMoreTopicId;
let currentTabIndex=0;
let currentTopicId;
let initDataIndex=0;
let dataIndex=0;

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex:0,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
    };
  }

  componentWillMount() {
    console.log('**************MainPage componentWillMount*********');
  }



  componentDidMount() {
    console.log('**************MainPage componentDidMount*********');
    const { readActions } = this.props;
    DeviceEventEmitter.removeAllListeners('changeCategory');
    DeviceEventEmitter.addListener('changeCategory', (followTopics) => {
      console.log('**************MainPage componentDidMount changeCategory*********');
      myTopics = new Array(Object.assign({},preTopic1),Object.assign({},preTopic2));
      myTopics=myTopics.concat(followTopics);
      this.refs.myScrollableTabView.goToPage(0);
    });

    InteractionManager.runAfterInteractions(() => {
      console.log('*MainPage componentDidMount runAfterInteractions*');
      store.get('followTopics').then((followTopics) => {
        myTopics = new Array(Object.assign({},preTopic1),Object.assign({},preTopic2));
        if(null!=followTopics)
        {
          myTopics=myTopics.concat(followTopics);
        }
        currentTopicId=myTopics[0].id;
        currentTabIndex=0;
        dataIndex=myTopics[0].dataIndex;
        readActions.requestArticleList(currentTopicId, currentTabIndex, dataIndex, false, true);
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    const { read } = this.props;
    if (
      read.isLoadMore &&
      !nextProps.read.isLoadMore &&
      !nextProps.read.isRefreshing
    ) {
      if (nextProps.read.noMore) {
        ToastUtil.showShort('没有更多数据了');
        //const index = this.state.typeIds.indexOf(currentLoadMoreTypeId);
      }
    }

    if((read.loading && !nextProps.read.loading)||(read.isRefreshing && !nextProps.read.isRefreshing)||(read.isLoadMore && !nextProps.read.isLoadMore))
    {
      let topicId=nextProps.read.topicId;
      if(topicId==currentTopicId)
      {
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
      }
    }
  }
  

  componentWillUnmount() {
    console.log('**************MainPage componentWillUnmount*********');
    //DeviceEventEmitter.removeAllListeners('changeCategory');
  }

  onRefresh = (topicId) => {
    console.log('**************MainPage onRefresh*********');
    const { readActions } = this.props;
    dataIndex=0;
    readActions.requestArticleList(topicId, currentTabIndex, dataIndex, true, false);
    //dataIndex=dataIndex+DATA_STEP;
    myTopics[currentTabIndex].dataIndex=dataIndex;
  };

  onPress = (type,itemData) => {
    const { navigate } = this.props.navigation;
    if('PEOPLE'==type)
    {
        itemData.url=itemData.erUrl;
        itemData.title=itemData.author_name;
        navigate('Web', { itemData });
    }
    else
    {
        itemData.url=itemData.questionUrl;
        itemData.title=itemData.questionTitle;
        navigate('Web', { itemData });
    }
  };

  onIconClicked = () => {
    this.drawer.openDrawer();
  };

  onEndReached = (topicId) => {
    currentLoadMoreTopicId = topicId;
    const time = Date.parse(new Date()) / 1000;
    //const index = this.state.typeIds.indexOf(topicId);
    //if (index < 0) {
    //  return;
    //}
    if (time - loadMoreTime > 1) {
      const { readActions } = this.props;
      dataIndex=myTopics[currentTabIndex].dataIndex;
      dataIndex=dataIndex+DATA_STEP;
      myTopics[currentTabIndex].dataIndex=dataIndex;
      console.log('**************MainPage onEndReached*********');
      readActions.requestArticleList(currentTopicId, currentTabIndex, dataIndex, false, false, true);
      loadMoreTime = Date.parse(new Date()) / 1000;
    }
  };
  renderFooter = () => {
    const { read } = this.props;
    return read.isLoadMore ? <Footer /> : <View />;
  };

  renderItem = article => (
    <ItemCell article={article} onPressHandler={this.onPress} />
  );

  renderContent = (topic) => {
    const { read } = this.props;
    if (read.loading) {
      return <LoadingView />;
    }
    const isEmpty =
      read.articleList[currentTabIndex] === undefined ||
      read.articleList[currentTabIndex].length === 0;
    if (isEmpty) {
      return (
        <EmptyView read={read} topicId={topic.id} onRefresh={this.onRefresh} />
      );
    }
    let dataSource=this.state.dataSource.cloneWithRows(getArticleList(read.articleList[currentTabIndex]));
    return (
      <ItemListView
        dataSource={dataSource}
        topicId={topic.id}
        isRefreshing={read.isRefreshing}
        onEndReached={this.onEndReached}
        onRefresh={this.onRefresh}
        renderFooter={this.renderFooter}
        renderItem={this.renderItem}
      />
    );
  };

  render() {
    const content = myTopics.map((topic) => {
      const typeView = (
        <View key={topic.id} tabLabel={topic.name} style={styles.base}>
          {(currentTopicId==topic.id)? 
            this.renderContent(
            topic
          )
          :
          <View/>
          }
        </View>
      );
      return typeView;
    });
    return (
      <View style={styles.container}>
        <ScrollableTabView
          ref="myScrollableTabView"
          renderTabBar={() => (
            <ScrollableTabBar
              style={{borderWidth:1,borderColor:'#f8f8f8'}}
              tabStyle={styles.tab}
              textStyle={styles.tabText}
            />
          )}
          initialPage={0}
          locked={false}
          scrollWithoutAnimation={false}
          onChangeTab={(obj) => {
              console.log('**************MainPage onChangeTab*********');
              currentTabIndex=obj.i;
              this.setState({tabIndex:currentTabIndex});
              const { read } = this.props;
              currentTopicId=myTopics[currentTabIndex].id;
              dataIndex=myTopics[currentTabIndex].dataIndex;
              if(0==dataIndex)
              {
                console.log('**************MainPage onChangeTab need refresh*********');
                const { readActions } = this.props;
                readActions.requestArticleList(currentTopicId, currentTabIndex, dataIndex, true, false);
                dataIndex=dataIndex+DATA_STEP;
                myTopics[currentTabIndex].dataIndex=dataIndex;
              }
            }
          }
          tabBarBackgroundColor="#ffffff"
          tabBarUnderlineStyle={styles.tabBarUnderline}
          tabBarActiveTextColor="#228b22"
          tabBarInactiveTextColor="#888"
        >
          {content}
        </ScrollableTabView>
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
    backgroundColor: '#fff'
  },
  drawerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8'
  },
  drawerTitleContent: {
    height: 120,
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: '#228b22'
  },
  drawerIcon: {
    width: 30,
    height: 30,
    marginLeft: 5
  },
  drawerTitle: {
    fontSize: 20,
    textAlign: 'left',
    color: '#fcfcfc'
  },
  drawerText: {
    fontSize: 18,
    marginLeft: 15,
    textAlign: 'center',
    color: 'black'
  },
  timeAgo: {
    fontSize: 14,
    color: '#aaaaaa',
    marginTop: 5
  },
  refreshControlBase: {
    backgroundColor: 'transparent'
  },
  tab: {
    paddingBottom: 0
  },
  tabText: {
    fontSize: 16
  },
  tabBarUnderline: {
    //backgroundColor: '#228b22',
    //height: 2
    backgroundColor: 'transparent',
  }
});

Main.propTypes = propTypes;

export default Main;
