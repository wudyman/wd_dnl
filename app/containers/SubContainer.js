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
import NotificationPage from '../pages/HomePage/Subs/NotificationPage';
import ConversationPage from '../pages/HomePage/Subs/ConversationPage';
import ConversationMessagePage from '../pages/HomePage/Subs/ConversationMessagePage';
import SettingPage from '../pages/HomePage/Subs/SettingPage';
import AboutPage from '../pages/HomePage/Subs/AboutPage';
import FeedbackPage from '../pages/HomePage/Subs/FeedbackPage';

class SubContainer extends React.Component {
  
  _closePage(){
    console.log('*******SubContainer _closePage*******');
    this.props.navigation.pop();
  }

  componentWillMount() {
    console.log('*******SubContainer componentWillMount*******');
  }


  render() {
    const { params } = this.props.navigation.state;
    if(params.subPage=='Notification')
      return <NotificationPage closePage={()=>this._closePage()} {...this.props}/>;
    else if(params.subPage=='Conversation')
      return <ConversationPage closePage={()=>this._closePage()} {...this.props}/>;
    else if(params.subPage=='ConversationMessage')
      return <ConversationMessagePage conversationId={params.conversationId} closePage={()=>this._closePage()} {...this.props}/>;
    else if(params.subPage=='Setting')
        return <SettingPage closePage={()=>this._closePage()} {...this.props}/>;
    else if(params.subPage=='about')
        return <AboutPage closePage={()=>this._closePage()} {...this.props}/>;
    else if(params.subPage=='feedback')
        return <FeedbackPage closePage={()=>this._closePage()} {...this.props}/>;
    else
        return <SettingPage closePage={()=>this._closePage()} {...this.props}/>;
  }

}

export default SubContainer;

