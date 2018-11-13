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
import { StyleSheet, View, ListView, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import store from 'react-native-simple-store';
import moment from 'moment';
import RequestUtil from '../../../utils/RequestUtil';
import Button from '../../../components/Button';
import NoDataView from '../../../components/NoDataView';
import ItemList from '../../../components/ItemList';
import ItemNotification from './ItemNotification';
import { concatFilterDuplicate } from '../../../utils/ItemsUtil';
import { SITE_URL, NOTIFICATIONS_URL } from '../../../constants/Urls';
import { DATA_STEP_DOUBLE } from '../../../constants/Constants';

const propTypes = {
};

let noMoreViewShow=false;
let dataRequesting=false;
let start=0;
class NotificationPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
        }
    }

    componentWillMount() {
        console.log('**************NotificationPage componentWillMount*********');
        if('true'==gUserInfo.isSignIn)
            this._getNotifications('refresh');
    }

    componentWillUnmount() {
        console.log('**************NotificationPage componentWillUnmount*********');
        if('true'==gUserInfo.isSignIn){
            gLastQueryTime.conversation=moment().format('YYYY-MM-DD HH:mm:ss.S');
            store.save('lastQueryTime',gLastQueryTime);
        }
    }

    _openSignPage(){
        this.props.navigation.navigate('Misc',{pageType:'sign',isSignIn:'false'});
    }

    _getNotificationsCallback(ret)
    {
        let notifications=[];
        if("fail"!=ret)
        {
            ret.map((item)=>{
                let notification={};
                notification.id=item[0];
                notification.type=item[1];
                notification.pub_date=item[2];
                notification.sender_id=item[3];
                notification.sender_first_name=item[4];
                notification.target_id=item[5];
                notification.target_title=item[6];
                notification.status=item[7];

                notification.questionUrl=SITE_URL+"/question/"+notification.target_id+"/";
                notification.erUrl=SITE_URL+"/er/"+notification.sender_id+"/";
                notification.url="";//SITE_URL+"/question/"+notification.target_id+"/";

                /*********for wechat share******** */
                notification.title="";//notification.target_title;
                //notification.format_content="";
                //notification.contentImg="";

                notifications.push(notification);
            });
            start+=DATA_STEP_DOUBLE;
        }
        else{
            noMoreViewShow=true;
        }
        this.setState({notifications:concatFilterDuplicate(this.state.notifications,notifications)});
        dataRequesting=false;
    }

    _getNotifications(type){
        if(dataRequesting)
            return;
        dataRequesting=true;
        noMoreViewShow=false;
        if('refresh'==type)
        {
            start=0;
            this.setState({notifications:[]});
        }
        let end=start+DATA_STEP_DOUBLE;
        let url=NOTIFICATIONS_URL+'1/'+start+'/'+end+'/';
        RequestUtil.requestWithCallback(url,'POST','',this._getNotificationsCallback.bind(this));
    }

    onPress = (type,itemData) => {
        const { navigate } = this.props.navigation;
        if('PEOPLE'==type)
        {
            itemData.url=itemData.erUrl;
            itemData.title=itemData.sender_first_name;
            navigate('Web', { itemData });
        }
        else
        {
            itemData.url=itemData.questionUrl;
            itemData.title=itemData.target_title;
            navigate('Web', { itemData });
        }
      };

    onRefresh = () => {
        console.log('**************NotificationPage onRefresh*********');
        this._getNotifications('refresh');
    };

    onEndReached = () => {
        console.log('**************NotificationPage onEndReached*********');
        if(!noMoreViewShow)
            this._getNotifications('more');
    };

    _renderFooter = () => {
        console.log('**************NotificationPage _renderFooter*********');
        if(noMoreViewShow)
            return <NoDataView />;
        else
            return <View />;
    };



    _renderItem = notification => (
        <ItemNotification notification={notification} onPressHandler={this.onPress}/>
    );

    _renderContent = () => {
        if('true'==gUserInfo.isSignIn){
            let dataSource=this.state.dataSource.cloneWithRows(this.state.notifications);
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
        else{
            return (
                <View style={styles.hint}>
                    <Icon name="ios-notifications-outline" size={100} color={"#999"}/>
                    <View style={{margin:5}}></View>
                    <Text style={styles.hintText}>登录后可以查看我的消息</Text>
                    <View style={{margin:5}}></View>
                    <Button
                        btnStyle={styles.hintToSignInBtn}
                        textStyle={styles.hintToSignInText}
                        text="去登录"
                        onPress={() => this._openSignPage()}
                    />
                </View>
            );
        }
    };

    render() {
        return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={{height: 5, backgroundColor:'#f0f4f4'}}/>
                {this._renderContent()}
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
        paddingBottom: 1
    },
    hint: {
        justifyContent:'center',
        alignItems:'center',
        margin:100
    },
    hintText: {
        color:'#aaa'
    },
    hintToSignInBtn: {
        paddingLeft:15,
        paddingRight:15,
        paddingTop:3,
        paddingBottom:3,
        borderColor:'#555',
        borderWidth:1,
        borderRadius: 15
    },
    hintToSignInText: {
        fontSize:15,
        color:'#555'
    },
});
NotificationPage.propTypes = propTypes;
export default NotificationPage;
