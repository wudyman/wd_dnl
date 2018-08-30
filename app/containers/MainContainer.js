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
import { View,StatusBar } from 'react-native';
import store from 'react-native-simple-store';
import { connect } from 'react-redux';
import CodePush from 'react-native-code-push';
import { bindActionCreators } from 'redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Main from '../pages/MainPage/Main';
import * as readCreators from '../actions/read';
import Button from '../components/Button';
import ImageButton from '../components/ImageButtonWithText';  

let isSignIn='false';
class MainContainer extends React.Component {
  
  static navigationOptions = ({ navigation }) => {
    return{
      //headerTitle: '首页',
      title: '首页',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="md-home" size={25} color={tintColor} />
      ),
      headerLeft: (<Button text='写文章' onPress={()=>navigation.navigate('Misc',{pageType:'write',isSignIn:isSignIn})} btnStyle={{padding:15}} textStyle={{fontSize:16,fontWeight:'100',textAlign: 'center',color:'#555'}}/>),
      headerRight: (<Button text='提问' onPress={()=>navigation.navigate('Misc',{pageType:'ask',isSignIn:isSignIn})} btnStyle={{padding:15}} textStyle={{fontSize:16,fontWeight:'100',textAlign: 'center',color:'#228b22'}}/>),
      headerTitle:(
        <View style={{flex:1,flexDirection:'row',marginLeft:15,marginRight:15,borderColor:'#f0f0f0',borderWidth:1,borderRadius: 20}}>
          <ImageButton text='搜索内容' onPress={()=>navigation.navigate('Misc',{pageType:'search',isSignIn:isSignIn})} icon="md-search" iconColor="#aaaaaa" iconSize={20} btnStyle={{flex:1,flexDirection:'row',justifyContent:'center', padding:5}} textStyle={{paddingLeft:5, fontSize:14, textAlign: 'center',color:'#aaaaaa'}}/>
        </View>
      ),
    };
  };

  componentWillMount() {
    console.log('**************MainContainer componentWillMount*********');
    if('true'==gUserInfo.isSignIn)
      isSignIn='true';
    else
      isSignIn='false';
  }

  componentDidMount() {
    console.log('**************MainContainer componentDidMount*********');
    CodePush.sync({
      deploymentKey: 'i08yF2_VmL5fc-x6-TFNP4jvAlSP53e08c89-2ae8-489d-b663-3966535e6711',
      updateDialog: {
        optionalIgnoreButtonLabel: '稍后',
        optionalInstallButtonLabel: '立即更新',
        optionalUpdateMessage: '有新版本了，是否更新？',
        title: '更新提示'
      },
      installMode: CodePush.InstallMode.ON_NEXT_RESTART
    });
  }

  render() {
  return (<Main {...this.props} />);
  }
}

const mapStateToProps = (state) => {
  const { read } = state;
  return {
    read
  };
};

const mapDispatchToProps = (dispatch) => {
  const readActions = bindActionCreators(readCreators, dispatch);
  return {
    readActions
  };
};

 

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
