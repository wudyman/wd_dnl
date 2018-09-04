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
const ItemSearchPeople = ({ resultData, onPressHandler }) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={() => onPressHandler(resultData)}>
        <View style={styles.item}>
                <Image style={styles.avatar} source={{ uri: resultData.avatar }} />
                <View style={styles.itemRight}>
                        <Text style={styles.nameText}>{formatStringWithHtml(resultData.name)}</Text>
                        <Text style={styles.moodText}>{formatStringWithHtml(resultData.mood)}</Text>
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
        padding: 15,
        borderBottomColor: '#f8f8f8',
        borderBottomWidth: 1
    },
    item: {
        marginLeft:10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatar: {
        height: 50,
        width: 50,
        borderRadius:25
    },
    itemRight: {
        marginLeft:5,
    },
    name: {
        marginRight:20,
        paddingRight:20,
    },
    nameText: {
        fontSize: 16,
        color: '#1a1a1a',
        fontWeight:'700'
    },
    mood: {
        marginRight:20,
        paddingRight:20,
    },
    moodText: {
    },
});

export default ItemSearchPeople;
