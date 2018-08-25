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
import {Text, View, StyleSheet, Platform, TextInput, BackHandler} from 'react-native';
import Button from '../../components/Button';
import ImageButton from '../../components/ImageButtonWithText';
import { GET_SMS_URL, SITE_NAME } from '../../constants/Urls';
import { checkPhoneNoFormat, checkPasswordFormat, checkSmsCodeFormat, checkNickNameFormat } from '../../utils/AccountUtil';
import ToastUtil from '../../utils/ToastUtil';


export default class SignUpPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            smsGetDisable : false,
            phoneNo : "",
            smsCode : "",
            nickName : "",
            password : "",
            countDownValue: 60
        };
        this.aInterval=null;
        this.handleBack = this._handleBack.bind(this);// In Modal, no use , block by Modal`s onRequestClose
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBack);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
    }

    _signUp() {
        if(false==checkPhoneNoFormat(this.state.phoneNo))
        {
            ToastUtil.showShort("手机号码格式错误");
            return;
        }
        if(false==checkSmsCodeFormat(this.state.smsCode))
        {
            ToastUtil.showShort("验证码格式错误");
            return;
        }
        if(false==checkNickNameFormat(this.state.nickName))
        {
            ToastUtil.showShort("昵称长度太长");
            return;
        }
        if(false==checkPasswordFormat(this.state.password))
        {
            ToastUtil.showShort("密码格式错误");
            return;
        }


        const { signInUpActions } = this.props;
        signInUpActions.requestSignUp(this.state.phoneNo,this.state.smsCode,this.state.nickName,this.state.password);
    }

    _handleBack() {
        return true;
    }

    _checkGetSmsCode(ret){

        if('registered'==ret){
            ToastUtil.showShort("该手机号已被注册");
        }
        else if('success'==ret){
            ToastUtil.showShort("验证码已发送到您的手机上，请注意查收");
        }
        else{
            ToastUtil.showShort("获取验证码失败，请稍候再重试");
        }
    
    }

    _getSmsCode(){
        let formData=new FormData();
        formData.append("phone_no",this.state.phoneNo);
        formData.append("type","register");
        fetch(GET_SMS_URL, {
          method:'POST',
          body:formData
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
                console.log(responseData);
                this._checkGetSmsCode(responseData);
            } else {
                console.log(responseData);
                this._checkGetSmsCode('fail');
            }
          })
          .catch((error) => {
            console.error(error);
            this._checkGetSmsCode('fail');
          });

        this.setState({smsGetDisable:true,countDownValue:60});
        this.aInterval=setInterval(this._countDown.bind(this),1000);
    }

    _countDown(){
        if(0==this.state.countDownValue){
            this.setState({smsGetDisable:false,countDownValue:60});
            clearInterval(this.aInterval);
        }
        else{
            this.setState({countDownValue:this.state.countDownValue-1});
        }
    }

    _signupCallback(){

    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.closeButton}>
                    <ImageButton
                        onPress={this.props.closePage}
                        icon="md-close"
                        iconColor="white"
                        iconSize={25}
                        btnStyle={{width: 45, height: 45, alignItems: 'center',justifyContent: 'center'}}
                    />
                </View>
                <View style={styles.title}>
                    <Text style={styles.mainTitle}>注册{SITE_NAME}</Text>
                </View>
                <View style={styles.signUp}>
                    <View style={styles.accout}>
                        <TextInput
                            style={styles.edit}
                            keyboardType='numeric'
                            underlineColorAndroid="transparent"
                            placeholder="手机号"
                            onChangeText={
                                (text) => {
                                  this.setState({phoneNo:text});
                                }
                            }
                            placeholderTextColor="#c4c4c4"/>
                    </View>
                    <View style={{height: 1, backgroundColor:'#c4c4c4'}}/>
                    <View style={styles.smsInput}>
                        <View style={styles.smsInputEdit}>
                            <TextInput
                                style={[styles.edit,{width:180}]}
                                keyboardType='numeric'
                                underlineColorAndroid="transparent"
                                placeholder="请输入短信验证码"
                                onChangeText={
                                    (text) => {
                                      this.setState({smsCode:text});
                                    }
                                }
                                placeholderTextColor="#c4c4c4"/>
                        </View>                       
                        <View style={styles.smsInputButton}>
                            <Button disabled={this.state.smsGetDisable} text={this.state.smsGetDisable?this.state.countDownValue+"秒后可重发":"获取短信验证码"} btnStyle={styles.smsInputButtonBtn} textStyle={styles.smsInputButtonText} onPress={this._getSmsCode.bind(this)}/>
                        </View>                        
                    </View>

                    <View style={{height: 1, backgroundColor:'#c4c4c4'}}/>
                    <View style={styles.nickName}>
                        <TextInput
                            style={styles.edit}
                            underlineColorAndroid="transparent"
                            placeholder="昵称"
                            onChangeText={
                                (text) => {
                                  this.setState({nickName:text});
                                }
                            }
                            placeholderTextColor="#c4c4c4"/>
                    </View>
                    <View style={{height: 1, backgroundColor:'#c4c4c4'}}/>
                    <View style={styles.password}>
                        <TextInput
                            style={styles.edit}
                            underlineColorAndroid="transparent"
                            placeholder="密码"
                            onChangeText={
                                (text) => {
                                  this.setState({password:text});
                                }
                            }
                            placeholderTextColor="#c4c4c4"/>
                    </View>
                    <View style={{height: 1, backgroundColor:'#c4c4c4'}}/>
                    <View style={styles.signUpButton}>
                        <Button btnStyle={styles.signUpButtonBtn} textStyle={styles.signUpButtonText} text="注册" onPress={this._signUp.bind(this)}/>
                    </View>
                    <View style={styles.switchSignInUpButton}>
                        <Button btnStyle={styles.switchSignInUpButtonBtn} textStyle={styles.switchSignInUpButtonText} text="已有帐号？登录" onPress={this.props.switchSignInUp}/>
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
        backgroundColor: 'white'
    },
    closeButton:{
        marginTop: (Platform.OS === 'ios') ? 10 : 0,
        backgroundColor: '#228b22'
    },
    title:{
        paddingBottom: 20,
        alignItems: 'center',
        backgroundColor: '#228b22'
    },
    mainTitle:{
        color: 'white',
        fontSize: 24
    },
    subTitle:{
        color: 'white',
        fontSize: 20
    },
    signUp:{
        margin: 15,
        marginTop: 5
    },
    accout:{
        height: 48,
        backgroundColor:'white',
        justifyContent: 'center',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3
    },
    smsInput:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 48,
        backgroundColor:'white'
    },
    smsInputEdit:{

    },
    smsInputButton:{
        
    },
    smsInputButtonBtn:{
        padding: 5,
        borderWidth:1,
        borderColor:'#228b22',
        borderRadius: 3,
        borderStyle:'dotted'
    },
    smsInputButtonText:{
        color:'#228b22',
    },
    nickName:{
        height: 48,
        backgroundColor:'white',
        justifyContent: 'center',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3
    },
    password:{
        height: 48,
        backgroundColor:'white',
        justifyContent: 'center',
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3
    },
    signUpButton:{
        marginTop: 20,
        alignItems: 'stretch'
    },
    signUpButtonBtn:{
        alignItems: 'center',
        backgroundColor: '#228b22',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3
    },
    signUpButtonText:{
        paddingTop:5,
        paddingBottom:5,
        fontSize:20,
        color:'white'
    },
    edit:{
        fontSize: 20,
        backgroundColor: '#fff'
    },
    switchSignInUpButton:{
        marginTop: 30,
        alignItems: 'stretch'
    },
    switchSignInUpButtonBtn:{
        alignItems: 'center',
        backgroundColor: '#eeeeee',
    },
    switchSignInUpButtonText:{
        paddingTop:5,
        paddingBottom:5,
        fontSize: 16
    },
});