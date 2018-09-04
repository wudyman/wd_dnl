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
const ItemSearchContent = ({ resultData, onPressHandler }) => (
  <View style={styles.container}>
    <View style={styles.itemTop}>
      <TouchableOpacity onPress={() => onPressHandler(resultData)}>
        <Text style={styles.title}>{formatStringWithHtml(resultData.title)}</Text>
      </TouchableOpacity>
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
});

export default ItemSearchContent;
