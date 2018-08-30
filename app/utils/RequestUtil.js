/**
 *
 * Copyright 2015-present wd_dnl
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

import getUrl from './UrlUtil';

const request = (url, method, data) => {
  let isOk;
  console.log(url);
  console.log(data);
  return new Promise((resolve, reject) => {
    fetch(getUrl(url), {
      method:method,
      /*
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      */
      //body:JSON.stringify({type:'hot'})
      body:data
    })
      .then((response) => {
        if (response.ok) {
          isOk = true;
        } else {
          isOk = false;
        }
        return response.json();
      })
      .then((responseData) => {
        if (isOk) {
          resolve(responseData);
        } else {
          reject(responseData);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const requestWithCallback = (url, method, data,callback) => {
  let isOk;
  console.log(url);
  console.log(data);
  fetch(url, {
      method:method,
      body:data
  })
  .then((response) => {
  if (response.ok) {
      isOk = true;
  } else {
      isOk = false;
  }
  return response.json();
  })
  .then((responseData) => {
  if (isOk) {
      callback(responseData);
  } else {
      console.log(responseData);
      callback('fail');
  }
  })
  .catch((error) => {
    console.error(error);
    callback('fail');
  });
};

export default {
  request,
  requestWithCallback
};
