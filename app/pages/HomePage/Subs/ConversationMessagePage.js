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
import { ScrollView, RefreshControl, StyleSheet, View, ListView, Text, TextInput, Keyboard, Alert } from 'react-native';
import store from 'react-native-simple-store';
import RequestUtil from '../../../utils/RequestUtil';
import { formatUrlWithSiteUrl } from '../../../utils/FormatUtil';
import ItemList from '../../../components/ItemList';
import ItemConversationMessage from './ItemConversationMessage';
import Button from '../../../components/Button';
import ToastUtil from '../../../utils/ToastUtil';
import { concatFilterDuplicate, removeItemById } from '../../../utils/ItemsUtil';
import { SITE_URL, CONVERSATION_MESSAGES_URL, SEND_MESSAGE_URL, DELETE_MESSAGE_URL } from '../../../constants/Urls';
import { DATA_STEP_DOUBLE } from '../../../constants/Constants';

const propTypes = {
};

let start=0;
let conversationId=0;
let letterToId;
let letterToName;
let letterText;
class ConversationMessagePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
        },
        this.aInterval=null;
        this.componentWillUnmount=this.componentWillUnmount.bind(this);
    }

    componentWillMount() {
        console.log('**************ConversationMessagePage componentWillMount*********');
        letterText = '';
        conversationId=this.props.conversationId;
        this._getMessages('refresh');
        this.aInterval=setInterval(this._getMessagesTimer.bind(this),10*1000);
    }

    componentWillUnmount() {
        console.log('**************ConversationMessagePage componentWillUnmount*********');
        clearInterval(this.aInterval);
    }

    _getMessagesCallback(ret,type){
        let messages=[];
        if("fail"!=ret)
        {
            ret.map((item)=>{
                let message={};

                message.id=item[0];
                message.content=item[1];
                message.status=item[2];
                message.delete_id=item[3];
                message.pub_date=item[4];
                message.sender_id=item[5];
                message.sender_name=item[6];
                message.sender_avatar=formatUrlWithSiteUrl(item[7]);
                message.receiver_id=item[8];
                message.receiver_name=item[9];
                message.receiver_avatar=formatUrlWithSiteUrl(item[10]);
    
                if(message.sender_id==gUserInfo.id)
                {
                    message.sender_name="我";
                    message.letter_id=message.receiver_id;
                    message.letter_name=message.receiver_name;
                    letterToId=message.receiver_id;
                    letterToName=message.receiver_name;
                }
                else
                {
                    message.letter_id=message.sender_id;
                    message.letter_name=message.sender_name;
                    letterToId=message.sender_id
                    letterToName=message.sender_name;
                }
                message.er_url=SITE_URL+"/er/"+message.sender_id+"/";

                if (message.delete_id!=gUserInfo.id)//user have delete this message
                {
                    messages.push(message);
                }

            });
            if('timer'!=type)
                start+=DATA_STEP_DOUBLE;
        }
        if('more'==type)
            this.setState({messages:concatFilterDuplicate(this.state.messages,messages)});
        else
            this.setState({messages:concatFilterDuplicate(messages,this.state.messages)});
    }

    _getMessagesTimer(){
        console.log('**************ConversationMessagePage _getMessagesTimer*********');
        let tmpStart=0;
        let end=tmpStart+DATA_STEP_DOUBLE;
        let url=CONVERSATION_MESSAGES_URL+this.props.conversationId+'/1/'+tmpStart+'/'+end+'/';
        RequestUtil.requestWithCallback(url,'POST','',this._getMessagesCallback.bind(this),callbackarg='timer');
    }


    _getMessages(type){
        if('refresh'==type)
        {
            start=0;
            this.setState({messages:[]});
        }
        let end=start+DATA_STEP_DOUBLE;
        let url=CONVERSATION_MESSAGES_URL+this.props.conversationId+'/1/'+start+'/'+end+'/';
        RequestUtil.requestWithCallback(url,'POST','',this._getMessagesCallback.bind(this),callbackarg=type);
    }

    _sendMessageCallback(ret){
        if("fail"!=ret)
        {
            let messages=[];
            let message={};
            message.id=ret;
            message.content=letterText;
            message.pub_date=new Date();
            message.sender_id=gUserInfo.id;
            message.sender_name='我';
            message.sender_avatar=gUserInfo.avatar;
            message.er_url=SITE_URL+"/er/"+message.sender_id+"/";

            messages.push(message);
            this.setState({messages:concatFilterDuplicate(messages,this.state.messages)});
        }
    }

    _sendMessage(){
        let formData=new FormData();
        formData.append("content",letterText);
        let url=SEND_MESSAGE_URL+letterToId+'/';
        RequestUtil.requestWithCallback(url,'POST',formData,this._sendMessageCallback.bind(this));
    }

    _deleteMessageCallback(ret){
        if("fail"!=ret)
        {
            console.log("delete ok"); 
        }
    }

    _deleteMessage(messageId){
        let url=DELETE_MESSAGE_URL+messageId+'/';
        RequestUtil.requestWithCallback(url,'POST','',this._deleteMessageCallback.bind(this));
        this.setState({messages:removeItemById(messageId,this.state.messages)});       
    }

    onPress = (type,itemData) => {
        const { navigate } = this.props.navigation;
        if('PEOPLE'==type)
        {
            itemData.url=itemData.er_url;
            itemData.title=itemData.er_name;
            navigate('Web', { itemData });
        }
        else if('DELETE'==type)
        {
            Alert.alert(
                '确定要删除？',
                '',
                [
                  {text: '确定', onPress: () => this._deleteMessage(itemData.id)},
                  {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                ],
                { cancelable: false }
              )
        }
        else
        {
            navigate('Sub',{subPage:'ConversationMessage'});
        }
      };

    onRefresh = () => {
        console.log('**************ConversationMessagePage onRefresh*********');
        this._getMessages('refresh');
    };

    onEndReached = () => {
        console.log('**************ConversationMessagePage onEndReached*********');
        this._getMessages('more');
    };

    _renderFooter = () => {
        console.log('**************ConversationMessagePage _renderFooter*********');
        return <View />;
    };

    onActionSelected = () => {
        letterText=letterText.replace(/\s+/g, '');
        if (letterText === undefined || letterText === '') {
          ToastUtil.showShort('请填写建议内容哦~');
        } else {
          this._sendMessage();
          this.textInput.clear();
          Keyboard.dismiss();
          //ToastUtil.showShort('已发送');
        }
    };

    _renderItem = message => (
        <ItemConversationMessage message={message} onPressHandler={this.onPress}/>
    );

    renderItems = () => {
        let dataSource=this.state.dataSource.cloneWithRows(this.state.messages);
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
            <View style={{height: 5, backgroundColor:'#f0f4f4'}}/>
            <View style={styles.letterTo}>
                <Text style={styles.letterToText}>发私信给 {letterToName}:</Text>
            </View>
            <View style={styles.letterContent}>
                <TextInput
                ref={(ref) => {
                    this.textInput = ref;
                }}
                style={styles.textInput}
                placeholder={'内容...'}
                placeholderTextColor="#aaaaaa"
                underlineColorAndroid="transparent"
                multiline
                onChangeText={(text) => {
                    letterText = text;
                }}
                />
            </View>
            <View>
                <Button
                btnStyle={styles.submitBtn}
                textStyle={styles.submitBtnText}
                text="发送"
                onPress={() => this.onActionSelected()}
                />
            </View>
            <View style={styles.content}>
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
    letterTo: {
        margin:10,
    },
    letterToText: {
        fontWeight:'900',
    },
    letterContent: {
        minHeight:100,
        marginLeft:10,
        marginRight:10,
        borderColor:'#f0f0f0',
        borderWidth:1,
        borderRadius: 3
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        padding: 10,
        textAlignVertical: 'top'
    },
    submitBtn: {
        margin: 10,
        marginLeft:200,
        padding: 5,
        borderRadius: 5,
        backgroundColor: '#228b22'
    },
    submitBtnText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#fff'
    },
    content: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        //justifyContent: 'center',
        paddingBottom: 1
    },
});
ConversationMessagePage.propTypes = propTypes;
export default ConversationMessagePage;
