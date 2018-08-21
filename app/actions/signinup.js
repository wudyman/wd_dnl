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
import * as types from '../constants/ActionTypes';

export function initSignIn(phoneNo,password) {
  return {
    type: types.INIT_SIGN_IN,
  };
}

export function requestSignIn(phoneNo,password) {
  return {
    type: types.REQUEST_SIGN_IN,
    phoneNo,
    password
  };
}

export function startSignIn() {
  return {
    type: types.START_SIGN_IN
  };
}

export function endSignIn(signInResult) {
  return {
    type: types.END_SIGN_IN,
    signInResult
  };
}

export function requestUserInfo() {
  return {
    type: types.REQUEST_USER_INFO
  };
}

export function receiveUserInfo(userInfo) {
  return {
    type: types.RECEIVE_USER_INFO,
    userInfo
  };
}

export function requestSignUp(phoneNo,smsCode,nickName,password) {
  return {
    type: types.REQUEST_SIGN_UP,
    phoneNo,
    smsCode,
    nickName,
    password
  };
}

export function startSignUp() {
  return {
    type: types.START_SIGN_UP
  };
}

export function endSignUp(signUpResult) {
  return {
    type: types.END_SIGN_UP,
    signUpResult
  };
}
