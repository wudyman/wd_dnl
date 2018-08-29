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
import { Text, Image, TouchableOpacity, View, StyleSheet } from 'react-native';
import moment from 'moment';

require('moment/locale/zh-cn');

const ItemConversation = ({ conversation, onPressHandler}) => (
  <View style={styles.container}>
    <View style={styles.item}>
        <TouchableOpacity onPress={() => onPressHandler('PEOPLE',conversation)}>
            <Image style={styles.avatar} source={{ uri: conversation.er_avatar }} />
        </TouchableOpacity>
        <View style={styles.itemRight}>
            <TouchableOpacity style={styles.name} onPress={() => onPressHandler('PEOPLE',conversation)}>
                <Text style={styles.nameText}>{conversation.er_name}:</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.message} onPress={() => onPressHandler('MESSAGES',conversation)}>
                <Text style={styles.messageText}>{conversation.latest_message_content}</Text>
            </TouchableOpacity>
        </View>
    </View>
    <View style={styles.action}>
        <View style={styles.timeAgo}>
            <Text style={styles.timeAgoText}>{moment(conversation.update).fromNow()}</Text>
        </View>
        <View style={styles.openConversation}>
            <TouchableOpacity onPress={() => onPressHandler('MESSAGES',conversation)}>
                <Text style={styles.openConversationText}>查看对话</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.deleteConversation}>
            <TouchableOpacity onPress={() => onPressHandler('DELETE',conversation)}>
                <Text style={styles.deleteConversationText}>删除对话</Text>
            </TouchableOpacity>
        </View>
    </View>
    <View style={{height: 1, backgroundColor:'#f0f4f4'}}/>
  </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff'
    },
    item: {
        margin:10,
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    avatar: {
        height: 50,
        width: 50
    },
    itemRight: {
        marginLeft:5,
        //marginRight:20,
        //paddingRight:20,
    },
    name: {
        marginRight:20,
        paddingRight:20,
    },
    nameText: {
        fontWeight:'900'
    },
    message: {
        marginRight:20,
        paddingRight:20,
    },
    messageText: {
    },
    action: {
        marginLeft:10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    timeAgo: {
        width: 200
    },
    timeAgoText: {
        fontSize: 14,
        color: '#aaaaaa'
    },
    openConversation: {
        marginRight:10,
    },
    openConversationText: {
        color:'#228b22'
    },
    deleteConversation: {
        marginRight:10,
    },
    deleteConversationText: {
        color:'#228b22'
    }
});

export default ItemConversation;
