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
import { ScrollView, RefreshControl, StyleSheet, View, ListView, Alert } from 'react-native';
import store from 'react-native-simple-store';
import RequestUtil from '../../../utils/RequestUtil';
import ItemList from './ItemList';
import ItemConversation from './ItemConversation';
import { concatFilterDuplicate, removeItemById } from '../../../utils/ItemsUtil';
import { SITE_URL, CONVERSATIONS_URL, DELETE_CONVERSATION_URL } from '../../../constants/Urls';
import { DATA_STEP } from '../../../constants/Constants';

const propTypes = {
};

let start=0;
class ConversationPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            conversations: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
        }
    }

    componentWillMount() {
        console.log('**************ConversationPage componentWillMount*********');
        this.setState({conversations:[]});
        start=0;
        this._getConversations(start);
        start=start+DATA_STEP*2;
    }

    _getConversationsCallback(ret)
    {
        let conversations=[];
        if("fail"!=ret)
        {
            ret.map((item)=>{
                let conversation={};

                conversation.id=item[0];
                conversation.delete_id=item[1];
                conversation.update=item[2];
                conversation.initator_id=item[3];
                conversation.initator_name=item[4];
                conversation.initator_avatar=item[5];
                conversation.parter_id=item[6];
                conversation.parter_name=item[7];
                conversation.parter_avatar=item[8];
                conversation.latest_message_content=item[9];

                if((conversation.initator_avatar!=null)&&(conversation.initator_avatar.indexOf('http')<0))
                {
                    conversation.initator_avatar=SITE_URL+conversation.initator_avatar;
                }
                if((conversation.parter_avatar!=null)&&(conversation.parter_avatar.indexOf('http')<0))
                {
                    conversation.parter_avatar=SITE_URL+conversation.parter_avatar;
                }

                if(conversation.initator_id!=gUserInfo.id)
                {
                    conversation.er_id=conversation.initator_id;
                    conversation.er_name=conversation.initator_name;
                    conversation.er_avatar=conversation.initator_avatar;
                    conversation.er_url=SITE_URL+"/er/"+conversation.er_id+"/";
                }
                else
                {
                    conversation.er_id=conversation.parter_id;
                    conversation.er_name=conversation.parter_name;
                    conversation.er_avatar=conversation.parter_avatar;
                    conversation.er_url=SITE_URL+"/er/"+conversation.er_id+"/";
                }

                if(conversation.delete_id!=gUserInfo.id) //user have delete this message
                {
                    conversations.push(conversation);
                }
            });
        }
        console.log(conversations);
        this.setState({conversations:concatFilterDuplicate(this.state.conversations,conversations)});
        //return concatFilterDuplicate(this.state.conversations,conversations);
        
    }

    _getConversations(start){
        let end=start+DATA_STEP*2;
        let url=CONVERSATIONS_URL+'1/'+start+'/'+end+'/';
        RequestUtil.requestWithCallback(url,'POST','',this._getConversationsCallback.bind(this));
    }

    _deleteConversationCallback(ret){
        if("fail"!=ret)
        {
            console.log("delete ok"); 
        }
    }

    _deleteConversation(conversationId){
        let url=DELETE_CONVERSATION_URL+conversationId+'/';
        RequestUtil.requestWithCallback(url,'POST','',this._deleteConversationCallback.bind(this));
        this.setState({conversations:removeItemById(conversationId,this.state.conversations)});       
    }

    onPress = (type,itemData) => {
        const { navigate } = this.props.navigation;
        if('PEOPLE'==type)
        {
            itemData.url=itemData.er_url;
            itemData.title=itemData.er_name;
            //navigate('Misc', { pageType:'er',itemData });
            navigate('Web', { itemData });
        }
        else if('DELETE'==type)
        {
            Alert.alert(
                '确定要删除？',
                '',
                [
                  {text: '确定', onPress: () => this._deleteConversation(itemData.id)},
                  {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                ],
                { cancelable: false }
              )
        }
        else
        {
            navigate('Sub',{subPage:'ConversationMessage',conversationId:itemData.id});
        }
      };

    onRefresh = () => {
        console.log('**************ConversationPage onRefresh*********');
        this.setState({notifications:[]});
        start=0;
        this._getConversations(start);
        start=start+DATA_STEP*2;
    };

    onEndReached = () => {
        console.log('**************ConversationPage onEndReached*********');
        this._getConversations(start);
        start=start+DATA_STEP*2;
    };

    _renderFooter = () => {
        console.log('**************ConversationPage _renderFooter*********');
        return <View />;
    };



    _renderItem = conversation => (
        <ItemConversation conversation={conversation} onPressHandler={this.onPress}/>
    );

    renderItems = () => {
        let dataSource=this.state.dataSource.cloneWithRows(this.state.conversations);
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
    };

    render() {
        return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={{height: 5, backgroundColor:'#f0f4f4'}}/>
                {this.renderItems()}
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
});
ConversationPage.propTypes = propTypes;
export default ConversationPage;
