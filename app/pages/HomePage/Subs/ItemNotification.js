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
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { formatStringWithHtml } from '../../../utils/FormatUtil';
import moment from 'moment';
require('moment/locale/zh-cn');

const ItemNotification = ({ notification, onPressHandler}) => (
  <View style={styles.container}>
    <View style={styles.timeAgo}>
        <Text style={styles.timeAgoText}>{moment(notification.pub_date).fromNow()}</Text>
    </View>
    <View style={styles.Item}>
        <TouchableOpacity onPress={() => onPressHandler('PEOPLE',notification)}>
            <View style={styles.containerItem}>
                <Text style={styles.contentLinkText}>{formatStringWithHtml(notification.sender_first_name)}</Text>
            </View>
        </TouchableOpacity>
        <Text style={styles.contentText}>邀请你回答</Text>
        <TouchableOpacity onPress={() => onPressHandler('QUESTION',notification)}>
            <View style={styles.containerItem}>
                <Text style={styles.contentLinkText}>{formatStringWithHtml(notification.target_title)}</Text>
            </View>
        </TouchableOpacity>
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
    timeAgo: {
        margin: 10,
    },
    timeAgoText: {
        fontSize: 14,
        color: '#aaaaaa'
    },
    Item: {
        marginLeft:15,
        marginBottom:10,
        flexDirection: 'row',
    },
    contentText: {
        fontSize: 14,
    },
    contentLinkText: {
        fontSize: 14,
        color: '#228b22',
    }
});

export default ItemNotification;
