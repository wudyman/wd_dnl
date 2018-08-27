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
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as signInUpCreators from '../actions/signinup';

import SignPage from '../pages/MiscPage/SignPage';
import WritePage from '../pages/WebViewPage/WritePageByWebView';
import AskPage from '../pages/WebViewPage/AskPageByWebView';
import SearchPage from '../pages/MiscPage/SearchPage';
import UserInfoPage from '../pages/WebViewPage/UserInfoPageByWebView';

import ToastUtil from '../utils/ToastUtil';
import { WRITE_URL,ASK_URL} from '../constants/Urls';

class MiscContainer extends React.Component {

  _closePage(){
    console.log('*******MiscContainer _closePage*******');
    this.props.navigation.pop();
  }

  componentWillMount() {
    console.log('*******MiscContainer componentWillMount*******');
    const { params } = this.props.navigation.state;
    if((params.pageType!='sign')&&(params.pageType!='search')&&(params.isSignIn=='false'))
    {
      ToastUtil.showShort("此功能需要先登录");
    }
  }


  render() {
    const { params } = this.props.navigation.state;
    if(params.pageType=='search')
      return <SearchPage closePage={()=>this._closePage()} {...this.props}/>;
    else if(params.pageType=='er')
      return <UserInfoPage closePage={()=>this._closePage()} userInfoUrl={params.itemData.erUrl} {...this.props}/>;
    else if(params.isSignIn=='false')
      return <SignPage closePage={()=>this._closePage()} {...this.props} />;
    else if(params.pageType=='ask')
      return <AskPage closePage={()=>this._closePage()} pageUrl={ASK_URL}/>;
    else if(params.pageType=='write')
      return <WritePage closePage={()=>this._closePage()} pageUrl={WRITE_URL}/>;
  }
}

const mapStateToProps = (state) => {
  const { signinup } = state;
  return {
    signinup
  };
};

const mapDispatchToProps = (dispatch) => {
  const signInUpActions = bindActionCreators(signInUpCreators, dispatch);
  return {
    signInUpActions
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MiscContainer);
