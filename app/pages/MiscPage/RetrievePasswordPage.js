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
import RequestUtil from '../../utils/RequestUtil';
import Button from '../../components/Button';
import ImageButton from '../../components/ImageButtonWithText';
import { GET_SMS_URL, CHECK_SMS_URL, RESET_PWD_URL } from '../../constants/Urls';
import { checkPhoneNoFormat, checkPasswordFormat, checkSmsCodeFormat } from '../../utils/AccountUtil';
import ToastUtil from '../../utils/ToastUtil';


export default class SignUpPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            secondStep : false,
            smsGetDisable : false,
            mainTitle : '找回密码',
            subTitle : '请输入手机号，点击获取验证码',
            phoneNo : "",
            smsCode : "",
            nickName : "",
            password : "",
            passwordRepeat : "",
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

    _handleBack() {
        return true;
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


    _getSmsCodeCallback(ret){
        if('fail'==ret)
        {
            ToastUtil.showShort("网络错误");
        }
        else if('unregistered'==ret)
        {
            ToastUtil.showShort("该手机号未注册");
        }
        else if('success'==ret)
        {
            this.setState({subTitle:'验证码已发送到您的手机上，请查看并输入'});
        }
        else
        {
            ToastUtil.showShort(ret);
        }  
    }

    _getSmsCode(){
        let url=GET_SMS_URL;
        let formData=new FormData();
        formData.append("phone_no",this.state.phoneNo);
        formData.append("type","password_reset");
        RequestUtil.requestWithCallback(url,'POST',formData,this._getSmsCodeCallback.bind(this));

        this.setState({smsGetDisable:true,countDownValue:60});
        this.aInterval=setInterval(this._countDown.bind(this),1000);
    }

    _nextStepCallback(ret){
        if('fail'==ret)
        {
            ToastUtil.showShort("网络错误");
        }
        else if('unregistered'==ret)
        {
            ToastUtil.showShort("该手机号未注册");
        }
        else if('veri_code_error'==ret)
        {
            ToastUtil.showShort("验证码错误");
        }
        else if('veri_code_ok'==ret)
        {
            this.setState({mainTitle:'设置新密码',subTitle:'请输入新密码，点击确认修改'}); 
            this.setState({secondStep:true});   
        }
        else
        {
            ToastUtil.showShort(ret);
        }    
     }

     _nextStep(){
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

        let url=CHECK_SMS_URL;
        let formData=new FormData();
        formData.append("phone_no",this.state.phoneNo);
        formData.append("type","password_reset");
        formData.append("veri_code",this.state.smsCode);
        RequestUtil.requestWithCallback(url,'POST',formData,this._nextStepCallback.bind(this));
    }

    _modifyPasswordCallback(ret){
        if('fail'==ret)
        {
            ToastUtil.showShort("网络错误");
        }
        else if('success'==ret)
        {
            ToastUtil.showShort("密码修改成功，请使用新密码登录");
            this.props.closePage();
        }
        else
        {
            ToastUtil.showShort(ret);
        }  
    }
    _modifyPassword(){
        if(false==checkPasswordFormat(this.state.password))
        {
            ToastUtil.showShort("密码格式错误");
            return;
        }
        if(false==checkPasswordFormat(this.state.passwordRepeat))
        {
            ToastUtil.showShort("密码格式错误");
            return;
        }
        if(this.state.password!=this.state.passwordRepeat)
        {
            ToastUtil.showShort("两次密码输入不一致");
            return;
        }
        let url=RESET_PWD_URL;
        let formData=new FormData();
        formData.append("phone_no",this.state.phoneNo);
        formData.append("veri_code",this.state.smsCode);
        formData.append("pwd",this.state.password);
        RequestUtil.requestWithCallback(url,'POST',formData,this._modifyPasswordCallback.bind(this));
    }

    _renderStep()
    {
        if(!this.state.secondStep)
        {
            return (
                <View style={styles.retrievePassword}>
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
                    <View style={styles.nextButton}>
                        <Button btnStyle={styles.nextButtonBtn} textStyle={styles.nextButtonText} text="下一步" onPress={this._nextStep.bind(this)}/>
                    </View>
                </View>
            );
        }
        else
        {
            return (
                <View style={styles.retrievePassword}>
                    <View style={styles.password}>
                        <Text style={{fontSize:20,textAlign: 'center'}}>{this.state.phoneNo}</Text>
                    </View>                   
                    <View style={styles.password}>
                        <TextInput
                            style={styles.edit}
                            underlineColorAndroid="transparent"
                            placeholder="请输入密码"
                            onChangeText={
                                (text) => {
                                this.setState({password:text});
                                }
                            }
                            placeholderTextColor="#c4c4c4"/>
                    </View>
                    <View style={{height: 1, backgroundColor:'#c4c4c4'}}/>
                    <View style={styles.password}>
                        <TextInput
                            style={styles.edit}
                            underlineColorAndroid="transparent"
                            placeholder="请再次输入新密码"
                            onChangeText={
                                (text) => {
                                this.setState({passwordRepeat:text});
                                }
                            }
                            placeholderTextColor="#c4c4c4"/>
                    </View>
                    <View style={{height: 1, backgroundColor:'#c4c4c4'}}/>
                    <View style={styles.nextButton}>
                        <Button btnStyle={styles.nextButtonBtn} textStyle={styles.nextButtonText} text="确认" onPress={this._modifyPassword.bind(this)}/>
                    </View>
                </View>
            );
        }
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
                        <Text style={styles.mainTitle}>{this.state.mainTitle}</Text>
                        <Text style={styles.subTitle}>{this.state.subTitle}</Text>
                </View>
                {this._renderStep()}
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
    retrievePassword:{
        margin: 15
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
    password:{
        height: 48,
        backgroundColor:'white',
        justifyContent: 'center',
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3
    },
    nextButton:{
        marginTop: 30,
        alignItems: 'stretch'
    },
    nextButtonBtn:{
        alignItems: 'center',
        backgroundColor: '#228b22',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3
    },
    nextButtonText:{
        paddingTop:5,
        paddingBottom:5,
        fontSize:20,
        color:'white'
    },
    edit:{
        fontSize: 20,
        backgroundColor: '#fff'
    },
});