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
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { formatStringWithHtml } from '../../utils/FormatUtil';
import moment from 'moment';

const ItemBusiness= ({ resultData, onPressHandler }) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={() => onPressHandler(resultData)}>
        <View style={styles.item}>
            <Image style={styles.picture} source={{ uri: resultData.pictures_array[0] }} />
            <View style={styles.itemRight}>
                <Text numberOfLines={1} style={styles.titleText}>{formatStringWithHtml(resultData.title)}</Text>
                <Text numberOfLines={1} style={styles.detailText}>{formatStringWithHtml(resultData.detail)}</Text>
                <View style={styles.itemRightBottom}>
                    <Text numberOfLines={1} style={styles.addrText}>{formatStringWithHtml(resultData.addr)}</Text>
                    <Text numberOfLines={1} style={styles.timeText}>{moment(resultData.update_date).fromNow()}</Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 10,
        borderBottomColor: '#f8f8f8',
        borderBottomWidth: 1
    },
    item: {
        marginLeft:0,
        flexDirection: 'row',
        alignItems: 'center'
    },
    picture: {
        height: 60,
        width: 80
    },
    itemRight: {
        marginLeft:5,
    },
    titleText: {
        fontSize: 16,
        color: '#1a1a1a',
        fontWeight:'700'
    },
    detailText: {
        fontSize: 15,
        marginBottom:5,
    },
    itemRightBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    addrText: {
        fontSize: 13,
        color: '#a0b0a0',
    },
    timeText: {
        fontSize: 13,
        color: '#a0b0a0',
    },
});

export default ItemBusiness;