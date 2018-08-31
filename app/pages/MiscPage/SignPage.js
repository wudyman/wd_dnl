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
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import store from 'react-native-simple-store';
import NavigationUtil from '../../utils/NavigationUtil';
import SignInPage from './SignInPage';
import SignUpPage from './SignUpPage';
import RetrievePasswordPage from './RetrievePasswordPage';


const propTypes = {
  signInUpActions: PropTypes.object,
  signinup: PropTypes.object.isRequired
};

class SignPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        userInfo: {},
        isSignUp:false,
        isRetrievePassword:false,
    }
  }

  _renderPage(){
    if(this.state.isRetrievePassword)
      return (<RetrievePasswordPage closePage={()=>this.props.closePage()} {...this.props}/>);
    else if(this.state.isSignUp)
      return (<SignUpPage closePage={()=>this.props.closePage()} switchSignInUp={()=>this._switchSignInUp()} {...this.props}/>);
    else
      return (<SignInPage closePage={()=>this.props.closePage()} switchSignInUp={()=>this._switchSignInUp()} openRetrievePasswordPage={()=>this._openRetrievePasswordPage()} {...this.props}/>);
  }
  _switchSignInUp(){
    this.setState({isSignUp:!this.state.isSignUp});
  }

  _openRetrievePasswordPage(){
    this.setState({isRetrievePassword:true});
  }

  _doNothing(){
  }


  componentWillMount() {
    console.log('***************SignPage componentWillMount**************');
    this.setState({userInfo:gUserInfo});
  }

  componentWillReceiveProps(nextProps) {
    const { signinup } = nextProps;
    if('success'==signinup.signInResult)
    {
      console.log("sign in success");
    }
    if('success'==signinup.getUserInfoResult)
    {
      console.log("getUserInfoResult success");
      this.setState({userInfo:signinup.userInfo});
      NavigationUtil.reset(this.props.navigation, 'Main');
    }
    if('success'==signinup.signUpResult)
    {
      this.setState({isSignUp:false});
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this._renderPage()}
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 10
  },
  login: {
    flex: 1,
    padding:10,
    alignItems: 'center'
  },
  loginButton: {
    margin: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 50,
    backgroundColor: '#228b22'
  },
  logo: {
    width: 110,
    height: 110,
    marginTop: 50
  },
  userInfo: {
    alignItems: 'center'
  },
  userInfoAvatar: {
    width: 70,
    height: 70,
    borderRadius:35
  },
  userInfoName: {
    fontSize:20,
    fontWeight: 'bold',
    alignItems: 'center'
  },
  userInfoMood: {
    alignItems: 'center'
  },
  version: {
    fontSize: 16,
    textAlign: 'center',
    color: '#aaaaaa',
    marginTop: 5
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    color: '#313131',
    marginTop: 10
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#4e4e4e'
  },
  disclaimerContent: {
    flexDirection: 'column'
  },
  disclaimer: {
    fontSize: 18,
    textAlign: 'left'
  },
  bottomContainer: {
    alignItems: 'flex-start'
  }
});
SignPage.propTypes = propTypes;
export default SignPage;
