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
import { ScrollView, RefreshControl, StyleSheet, View, ListView } from 'react-native';
import store from 'react-native-simple-store';
import RequestUtil from '../../../utils/RequestUtil';
import ItemList from './ItemList';
import ItemConversationMessage from './ItemConversationMessage';
import { concatFilterDuplicate } from '../../../utils/FormatUtil';
import { SITE_URL, CONVERSATION_MESSAGES_URL } from '../../../constants/Urls';
import { DATA_STEP } from '../../../constants/Constants';

const propTypes = {
};

let start=0;
let conversationId=0;
class ConversationMessagePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
        }
    }

    componentWillMount() {
        console.log('**************ConversationMessagePage componentWillMount*********');
        conversationId=this.props.conversationId;
        this.setState({messages:[]});
        start=0;
        this._getConversationMessages(start);
        start=start+DATA_STEP*2;
    }

    _convertConversationMessages(ret)
    {
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
                message.sender_avatar=item[7];
                message.receiver_id=item[8];
                message.receiver_name=item[9];
                message.receiver_avatar=item[10];
    
                //if (message.delete_id==gUserInfo.id) //user have delete this message
                //    continue;
    
                if(message.sender_id==gUserInfo.id)
                {
                    message.sender_name="我";
                    message.letter_id=message.receiver_id;
                    message.letter_name=message.receiver_name;
                }
                else
                {
                    message.letter_id=message.sender_id;
                    message.letter_name=message.sender_name;
                }
                message.er_url=SITE_URL+"/er/"+message.sender_id+"/";



                //notification.questionUrl=SITE_URL+"/question/"+notification.target_id+"/";
                //notification.erUrl=SITE_URL+"/er/"+notification.sender_id+"/";
                //notification.url="";//SITE_URL+"/question/"+notification.target_id+"/";

                if((message.sender_avatar!=null)&&(message.sender_avatar.indexOf('http')<0))
                {
                    message.sender_avatar=SITE_URL+message.sender_avatar;
                }
                if((message.receiver_avatar!=null)&&(message.receiver_avatar.indexOf('http')<0))
                {
                    message.receiver_avatar=SITE_URL+message.receiver_avatar;
                }

                messages.push(message);
            });
        }
        console.log(messages);
        this.setState({messages:concatFilterDuplicate(this.state.messages,messages)});
        //return concatFilterDuplicate(this.state.conversations,conversations);
        
    }

    _getConversationMessages(start){
        let end=start+DATA_STEP*2;
        let url=CONVERSATION_MESSAGES_URL+this.props.conversationId+'/1/'+start+'/'+end+'/';
        RequestUtil.requestWithCallback(url,'POST','',this._convertConversationMessages.bind(this));
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
        else
        {
            console.log("open message");
            navigate('Sub',{subPage:'ConversationMessage'});
        }
      };

    onRefresh = () => {
        console.log('**************ConversationMessagePage onRefresh*********');
        this.setState({messages:[]});
        start=0;
        this._getConversationMessages(start);
        start=start+DATA_STEP*2;
    };

    onEndReached = () => {
        console.log('**************ConversationMessagePage onEndReached*********');
        this._getConversationMessages(start);
        start=start+DATA_STEP*2;
    };

    _renderFooter = () => {
        console.log('**************ConversationMessagePage _renderFooter*********');
        return <View />;
    };



    _renderItem = message => (
        <ItemConversationMessage message={message} onPressHandler={this.onPress}/>
    );

    renderItems = () => {
        let dataSource=this.state.dataSource.cloneWithRows(this.state.messages);
        return (
        <ScrollView
            automaticallyAdjustContentInsets={false}
            horizontal={false}
            contentContainerStyle={styles.no_data}
            style={styles.base}
            refreshControl={
            <RefreshControl
                refreshing={false}
                onRefresh={this.onRefresh}
                title="Loading..."
                colors={['#228b22cc', '#00ff00ff', '#ffffbb33', '#ffff4444']}
                //colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
            />
            }
        >
            <ItemList
                dataSource={dataSource}
                isRefreshing={false}
                onEndReached={this.onEndReached}
                onRefresh={this.onRefresh}
                renderFooter={this._renderFooter}
                renderItem={this._renderItem}
            />
        </ScrollView>
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
        paddingBottom: 10
    },
});
ConversationMessagePage.propTypes = propTypes;
export default ConversationMessagePage;
