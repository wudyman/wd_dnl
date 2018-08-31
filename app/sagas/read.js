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

import * as types from '../constants/ActionTypes';
import ToastUtil from '../utils/ToastUtil';
import RequestUtil from '../utils/RequestUtil';
import { SITE_URL } from '../constants/Urls';
import { HEAD_TOPIC_ID, ANSWER_TOPIC_ID,DATA_STEP } from '../constants/Constants';
import { fetchArticleList, receiveArticleList } from '../actions/read';

function getIndexImg(content){
  var imgReg=/<img.*?(?:>|\/>)/gi;
  var arr=content.match(imgReg);
  if(arr!=null)
  {
      var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
      imgsrc=arr[0].match(srcReg);
      return imgsrc[1];
  }
  else
      return null;
}

function removeImg(content){
  var imgReg=/<img.*?(?:>|\/>)/gi;
  var temp=content.replace(imgReg,"").replace(/<[^>]+>/g,"");
  return temp;
}

function convertQuestionList(ret,noAnswer)
{
  if("fail"==ret)
    return [];
  var questions=[];
  if(noAnswer)
  {
    ret.map((item)=>{
      let question={};
      question.id=item[0];
      question.title=item[1];
      question.answer_nums=item[2];
      question.follower_nums=item[3];
      question.pub_date=item[4];
      question.url=SITE_URL+"/question/"+question.id+"/";
      questions.push(question);
    });
  }
  else
  {
    ret.map((item)=>{
      let question={};
      let content_type=item[2];
      if("article"==content_type)
      {
        question.id=item[0];
        question.questionTitle=item[1];
        question.topics=item[3];
        question.click_nums=item[4];
        question.questionUrl=SITE_URL+"/article/"+question.id+"/";
      }
      else
      {
        question.id=item[0];
        question.questionTitle=item[1];
        question.topics=item[3];
        question.answer_id=item[4];
        question.questionUrl=SITE_URL+"/question/"+question.id+"/?ans="+question.answer_id;
      }

      question.push_index=item[5];
      question.content=item[6];
      question.like_nums=item[7];
      question.comment_nums=item[8];
      question.pub_date=item[9];
      question.author_id=item[10];
      question.author_name=item[11];
      question.author_avatar=item[12];
      question.author_mood=item[13];
      question.author_sexual=item[14];
      question.author_question_nums=item[15];
      question.author_article_nums=item[16];
      question.author_answer_nums=item[17];
      question.author_followto_nums=item[18];
      question.author_follower_nums=item[19];
      question.author_followtopic_nums=item[20];
      question.author_followquestion_nums=item[21];

      question.erUrl=SITE_URL+"/er/"+question.author_id+"/";
      question.url="";

      question.title="";

      question.contentImg=getIndexImg(question.content);
      if((question.contentImg!=null)&&(question.contentImg.indexOf('http')<0))
      {
        question.contentImg=SITE_URL+question.contentImg;
      }
      if((question.author_avatar!=null)&&(question.author_avatar.indexOf('http')<0))
      {
        question.author_avatar=SITE_URL+question.author_avatar;
      }
      question.authorName=question.author_name;
      question.format_content=removeImg(question.content);

      questions.push(question);
    });
  }
  return questions;
}
export function* requestArticleList(
  topicId,
  tabIndex,
  dataIndex,
  isRefreshing,
  loading,
  isLoadMore
) {
  let noAnswer=false;
  let start=dataIndex;
  let end=start+DATA_STEP;
  let url=`${SITE_URL}/ajax/topic/${topicId}/1/${start}/${end}/`;
  if(HEAD_TOPIC_ID==topicId)
  {
    url=`${SITE_URL}/ajax/questions/1/${start}/${end}/`;
  }
  else if(ANSWER_TOPIC_ID==topicId)
  {
    url=`${SITE_URL}/ajax/answer_page/all/1/${start}/${end}/`;
    noAnswer=true;
  }
  let formData=new FormData();
  formData.append("type","hot");
  try {
    yield put(fetchArticleList(isRefreshing, loading, isLoadMore));
    const ret = yield call(
      RequestUtil.request,
      url,
      'post',
      formData
    );
    const articleList=convertQuestionList(ret,noAnswer);
    yield put(receiveArticleList(
      topicId,
      tabIndex,
      dataIndex,
      articleList
    ));
    const errorMessage = articleList;
    if (errorMessage && errorMessage == 'fail') {
      yield ToastUtil.showShort(errorMessage);
    }
  } catch (error) {
    yield put(receiveArticleList(topicId, tabIndex, dataIndex, []));
    ToastUtil.showShort('网络发生错误，请重试');
  }
}

export function* watchRequestArticleList() {
  while (true) {
    const {
      topicId, tabIndex, dataIndex, isRefreshing, loading, isLoadMore
    } = yield take(types.REQUEST_ARTICLE_LIST);
    yield fork(
      requestArticleList,
      topicId,
      tabIndex,
      dataIndex,
      isRefreshing,
      loading,
      isLoadMore
    );
  }
}
