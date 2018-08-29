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
import ItemConversation from './ItemConversation';
import { concatFilterDuplicate } from '../../../utils/FormatUtil';
import { SITE_URL, CONVERSATIONS_URL } from '../../../constants/Urls';
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

    _convertConversations(ret)
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

                //notification.questionUrl=SITE_URL+"/question/"+notification.target_id+"/";
                //notification.erUrl=SITE_URL+"/er/"+notification.sender_id+"/";
                //notification.url="";//SITE_URL+"/question/"+notification.target_id+"/";

                if((conversation.initator_avatar!=null)&&(conversation.initator_avatar.indexOf('http')<0))
                {
                    conversation.initator_avatar=SITE_URL+conversation.initator_avatar;
                }
                if((conversation.parter_avatar!=null)&&(conversation.parter_avatar.indexOf('http')<0))
                {
                    conversation.parter_avatar=SITE_URL+conversation.parter_avatar;
                }

                if(conversation.delete_id==gUserInfo.id) //user have delete this message
                {
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

                /*********for wechat share******** */
                //notification.title="";//notification.target_title;
                //notification.format_content="";
                //notification.contentImg="";

                conversations.push(conversation);
            });
        }
        console.log(conversations);
        this.setState({conversations:concatFilterDuplicate(this.state.conversations,conversations)});
        //return concatFilterDuplicate(this.state.conversations,conversations);
        
    }

    _getConversations(start){
        let end=start+DATA_STEP*2;
        let url=CONVERSATIONS_URL+'1/'+start+'/'+end+'/';
        RequestUtil.requestWithCallback(url,'POST','',this._convertConversations.bind(this));
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
            console.log("open message 3");
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
ConversationPage.propTypes = propTypes;
export default ConversationPage;
