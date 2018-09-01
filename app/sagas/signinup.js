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
import { concatFilterDuplicate } from '../utils/ItemsUtil';
import { SITE_URL } from '../constants/Urls';
import { SIGN_IN_URL,REQUEST_USER_INFO_URL,SIGN_UP_URL,FOLLOW_TOPICS_URL } from '../constants/Urls';
import { startSignIn,endSignIn,requestUserInfo,receiveUserInfo,startSignUp,endSignUp } from '../actions/signinup';

function convertUserInfo(ret)
{
  gUserInfo={};
  if("fail"==ret)
  {
    store.get('userInfo').then((userInfo)=>{
      if(null!=userInfo)
      {
        gUserInfo=userInfo;
      }
      else{
        gUserInfo.isSignIn='false';
      }
    });      
  }
  else if('nologin'==ret)
  {
    gUserInfo.isSignIn='fail';
  }
  else
  {
    let userInfoArray=ret[0];
    gUserInfo.id=userInfoArray[0];
    gUserInfo.name=userInfoArray[1];
    gUserInfo.avatar=userInfoArray[2];
    if(gUserInfo.avatar.indexOf('http')<0)
    {
      gUserInfo.avatar=SITE_URL+gUserInfo.avatar;
    }
    gUserInfo.mood=userInfoArray[3];
  
    gUserInfo.url=SITE_URL+'/er/'+gUserInfo.id+'/';
    gUserInfo.isSignIn='true';
  }
  return gUserInfo;
}

function convertFollowTopics(ret)
{
  let followTopics=[];
  if('nologin'==ret)
  {
    followTopics=['nologin'];
  }
  else
  {
    let followTopicsArray=ret[1];

    followTopicsArray.map((item)=>{
      let tempTopic={'id':item[0],'name':item[1],'dataIndex':0};
      followTopics.push(tempTopic);
    });
  }
  return followTopics;
}

export function* signIn(phoneNo,password) {
  let formData=new FormData();
  formData.append("phoneNo",phoneNo);
  formData.append("password",password);
  try {
    yield put(startSignIn());
    const ret = yield call(RequestUtil.request, SIGN_IN_URL, 'post',formData);
    yield put(endSignIn(ret));
    if(ret == 'success')
    {
      yield ToastUtil.showShort("登录成功");
      yield put(requestUserInfo());
      const ret = yield call(RequestUtil.request, REQUEST_USER_INFO_URL, 'post');
      if("fail"!=ret)
      {
        convertUserInfo(ret);
        const followTopics=convertFollowTopics(ret);
        yield call(store.save, 'userInfo', gUserInfo);
        if(followTopics!=['nologin'])
          {
            let oldFollowTopics=yield call(store.get, 'followTopics');
            if(oldFollowTopics.length>0)
            {
              followTopics=concatFilterDuplicate(followTopics,oldFollowTopics);
              let followTopicsIds=[];
              followTopics.map((topic)=>{followTopicsIds.push(topic.id);});
              let formData=new FormData();
              formData.append("topicsIds",""+followTopicsIds);
              yield call(RequestUtil.request, FOLLOW_TOPICS_URL, 'post',formData);
            }
            yield call(store.save, 'followTopics', followTopics);
          }
        yield put(receiveUserInfo(gUserInfo));
      }
    }
    else
    {
      yield  ToastUtil.showShort("登录失败");
    }
  } catch (error) {
    yield put(endSignIn('fail'));
    yield ToastUtil.showShort('登录失败');
  }
}

export function* signUp(phoneNo,smsCode,nickName,password) {
  let formData=new FormData();
  formData.append("phoneNo",phoneNo);
  formData.append("smsCode",smsCode);
  formData.append("nickName",nickName);
  formData.append("password",password);
  try {
    yield put(startSignUp());
    const ret = yield call(RequestUtil.request, SIGN_UP_URL, 'post',formData);
    yield put(endSignUp(ret));
    if(ret == 'registered')
    {
      yield ToastUtil.showLong("该手机号已注册");
    }
    else if(ret == 'success')
    {
      yield ToastUtil.showLong("注册成功,请登录");
    }
    else
    {
      yield  ToastUtil.showShort("注册失败");
    }
  } catch (error) {
    yield put(endSignUp('fail'));
    yield ToastUtil.showShort('注册失败');
  }
}

export function* watchSignIn() {
  while (true) {
    const {phoneNo,password} = yield take(types.REQUEST_SIGN_IN);
    yield fork(signIn,phoneNo,password);
  }
}

export function* watchSignUp() {
  while (true) {
    const {phoneNo,smsCode,nickName,password} = yield take(types.REQUEST_SIGN_UP);
    yield fork(signUp,phoneNo,smsCode,nickName,password);
  }
}
