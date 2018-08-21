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
  <TouchableOpacity onPress={() => onPressHandler(article)}>
    <View style={styles.containerItem}>
      <View style={styles.itemRightContent}>
        <Text style={styles.title}>{formatStringWithHtml(article.title)}</Text>
        <Image style={styles.itemImg} source={{ uri: article.contentImg }} />
        <Text numberOfLines={3} style={styles.content}>{formatStringWithHtml(article.format_content)}</Text>
        <View style={styles.itemRightBottom}>
          <Image style={styles.authorAvatar} source={{ uri: article.author_avatar }} />
          <Text style={styles.authorName}>{article.authorName}</Text>
          <Text style={styles.timeAgo}>{moment(article.pub_date).fromNow()}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  containerItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderBottomColor: '#f8f8f8',
    borderBottomWidth: 1
  },
  title: {
    fontSize: 20,
    //fontWeight: '500',
    textAlign: 'left',
    color: 'black'
  },
  content: {
    fontSize: 18,
    textAlign: 'left',
    color: '#666666'
  },
  itemImg: {
    height: 120,
    marginRight: 0
  },
  itemRightContent: {
    flex: 1,
    flexDirection: 'column'
  },
  itemRightBottom: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  authorAvatar: {
    width:20,
    height:20,
    borderRadius:10,
    marginTop: 5,
    marginRight: 5
  },
  authorName: {
    flex: 1,
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
