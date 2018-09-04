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
import { StyleSheet, TextInput, View, Keyboard } from 'react-native';
import Button from '../../../components/Button';
import ToastUtil from '../../../utils/ToastUtil';
import {SITE_NAME} from '../../../constants/Urls';

let feedbackText;

class FeedbackPage extends React.Component {

  componentDidMount() {
    feedbackText = '';
    this.props.navigation.setParams({ handleCheck: this.onActionSelected });
  }

  onActionSelected = () => {
    if (feedbackText === undefined || feedbackText.replace(/\s+/g, '') === '') {
      ToastUtil.showShort('请填写建议内容哦~');
    } else {
      ToastUtil.showShort('您的问题已反馈，我们会及时跟进处理');
      this.textInput.clear();
      Keyboard.dismiss();
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          ref={(ref) => {
            this.textInput = ref;
          }}
          style={styles.textInput}
          placeholder={`请写下您宝贵的意见或建议，与${SITE_NAME}一起进步！`}
          placeholderTextColor="#aaaaaa"
          underlineColorAndroid="transparent"
          numberOfLines={500}
          multiline
          autoFocus
          onChangeText={(text) => {
            feedbackText = text;
          }}
        />
        <View>
            <Button
              btnStyle={styles.submitBtn}
              textStyle={styles.submitBtnText}
              text="提交建议"
              onPress={() => this.onActionSelected()}
            />
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
  textInput: {
    flex: 1,
    fontSize: 18,
    padding: 15,
    textAlignVertical: 'top'
  },
  submitBtn: {
    margin: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#228b22'
  },
  submitBtnText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff'
  },
});

export default FeedbackPage;
