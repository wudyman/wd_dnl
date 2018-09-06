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
import { formatStringWithHtml } from '../../utils/FormatUtil';
const ItemSearchHotWord = ({ index,indexColor, keyword, onPressHandler }) => (
    <TouchableOpacity onPress={() => onPressHandler(keyword)}>
        <View style={styles.container}>
                        <Text style={[styles.indexText,indexColor]}>{index}.</Text>
                        <Text style={styles.keywordText}>{formatStringWithHtml(keyword)}</Text>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 10,
        borderBottomColor: '#f8f8f8',
        borderBottomWidth: 1
    },
    indexText: {
        color: '#bcbcbc',
        paddingLeft:0,
        paddingRight:10
    },
    keywordText: {
        color: '#333',
    },
});

export default ItemSearchHotWord;