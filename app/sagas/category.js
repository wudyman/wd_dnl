/* eslint no-constant-condition: ["error", { "checkLoops": false }] */
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
import { put, take, call, fork } from 'redux-saga/effects';
import store from 'react-native-simple-store';
import * as types from '../constants/ActionTypes';
import ToastUtil from '../utils/ToastUtil';
import RequestUtil from '../utils/RequestUtil';
import { AJAX_TOPICS_URL } from '../constants/Urls';
import { fetchTopicList, receiveTopicList } from '../actions/category';

function convertTopics(ret)
{
  let topics=[];
  ret.map((item)=>{
    let topic={'id':item[0],'name':item[1]};
    //let topic={};
    //topic.id=''+item[0];
    //topic.name=item[1];
    topics.push(topic);
  });
  return topics;
}
export function* requestTopicList() {
  try {
    yield put(fetchTopicList());
    const ret = yield call(RequestUtil.request, AJAX_TOPICS_URL, 'post');
    const topicList=convertTopics(ret);
    yield put(receiveTopicList(topicList));
    yield call(store.save, 'topicList', topicList);
    const errorMessage = topicList;
    if (errorMessage && errorMessage == 'fail') {
      yield  ToastUtil.showShort(errorMessage);
    }
  } catch (error) {
    yield put(receiveTopicList([]));
    yield ToastUtil.showShort('网络发生错误，请重试');
  }
}

export function* watchRequestTopicList() {
  while (true) {
    yield take(types.REQUEST_TOPIC_LIST);
    yield fork(requestTopicList);
  }
}
