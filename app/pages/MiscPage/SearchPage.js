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
import { StyleSheet, Text, View,TextInput,Platform } from 'react-native';
import store from 'react-native-simple-store';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../../components/Button';
import ImageButton from '../../components/ImageButtonWithText';

const propTypes = {
};

class SettingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        userInfo: {}
    }
  }

  _about() {
    this.props.navigation.navigate('Sub',{subPage:'about'});
  }

  _feedBack() {
    this.props.navigation.navigate('Sub',{subPage:'feedback'});
  }

  _checkUpdate(){
    
  }

  _doNothing(){
  }

  componentWillMount() {
    store.get('userInfo').then((userInfo)=>{
      this.setState({userInfo:userInfo});
    });
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={{flexDirection:'row',alignItems: 'center',justifyContent: 'space-between'}}>
            <View style={styles.closeButton}>
                    <ImageButton
                        onPress={this.props.closePage}
                        icon="ios-arrow-back"
                        iconColor="#555"
                        iconSize={25}
                        btnStyle={{width: 45, height: 45,padding:10}}
                        activeOpacity={0.2}
                    />
            </View>
            <View style={{flexDirection:'row',alignItems: 'center',marginTop:0,marginRight:20,paddingLeft:20,backgroundColor:'transparent',borderColor:'#f0f0f0',borderWidth:1,borderRadius: 20}}>
                <Icon name="md-search" size={20} color='#aaaaaa' />
                <TextInput
                style={{width:200,padding:2,fontSize:14,textAlign:'left'}}
                underlineColorAndroid='transparent'
                placeholderTextColor='#aaaaaa'
                autoFocus= {true}
                selectionColor='#228b22'
                placeholder='请输入关键字' />
            </View>
            <View style={{}}>
                <Button
                    btnStyle={{padding:10}}
                    textStyle={{color:'black',fontSize:16}}
                    text='搜索'
                    activeOpacity={0.2}
                />
            </View>
        </View>
        <View style={styles.content}>
            <View style={styles.hot}>
                <Text style={{paddingBottom:10,fontSize:15,color:"#aaaaaa"}}>热门搜索</Text>
                <View style={{height: 1, backgroundColor:'#f0f0f0'}}/>
            </View>
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
  closeButton:{
    marginTop: (Platform.OS === 'ios') ? 10 : 0,
    backgroundColor: '#fff'
  },
  content: {
    //flex: 1,
    margin:10,
    justifyContent: 'center',
    paddingBottom: 10
  },
  hot: {

  },
});
SettingPage.propTypes = propTypes;
export default SettingPage;
