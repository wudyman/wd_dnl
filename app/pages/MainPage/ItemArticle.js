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
import moment from 'moment';

import { formatStringWithHtml } from '../../utils/FormatUtil';

require('moment/locale/zh-cn');

const ItemCell = ({ article, onPressHandler }) => (
  <View style={styles.container}>
    <View style={styles.itemTop}>
      <TouchableOpacity onPress={() => onPressHandler('CONTENT',article)}>
        <Text style={styles.title}>{formatStringWithHtml(article.questionTitle)}</Text>
        <Image style={styles.contentImg} source={{ uri: article.contentImg }} />
        <Text numberOfLines={3} style={styles.content}>{formatStringWithHtml(article.format_content)}</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.itemBottom}>
      <TouchableOpacity style={styles.itemBottomLeft} onPress={() => onPressHandler('PEOPLE',article)}>
        <Image style={styles.authorAvatar} source={{ uri: article.author_avatar }} />
        <Text style={styles.authorName}>{formatStringWithHtml(article.author_name)}</Text>
      </TouchableOpacity>
      {/*<Text style={styles.timeAgo}>{moment(article.pub_date).fromNow()}</Text>*/}
    </View>
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
  itemTop: {
    flexDirection: 'column'
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'left',
    marginBottom:5,
    color: '#1a1a1a'
  },
  contentImg: {
    height: 120,
    marginBottom:5,
    marginRight: 0
  },
  content: {
    fontSize: 15,
    textAlign: 'left',
    fontWeight: '400',
    color: '#333'
  },
  itemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemBottomLeft: {
    flexDirection: 'row',
  },
  authorAvatar: {
    width:20,
    height:20,
    borderRadius:10,
    marginTop: 5,
    marginRight: 5
  },
  authorName: {
    fontSize: 14,
    color: '#a0b0a0',
    marginTop: 5,
    marginRight: 5
  },
  timeAgo: {
    marginTop: 5,
    fontSize: 14,
    color: '#aaaaaa'
  }
});

export default ItemCell;
