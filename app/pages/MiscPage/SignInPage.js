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
import { checkPhoneNoFormat, checkPasswordFormat } from '../../utils/AccountUtil';
import ToastUtil from '../../utils/ToastUtil';
import { SITE_NAME, SITE_SLOGAN } from '../../constants/Urls';
class SignInPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            phoneNo : "",
            password : "",
        };
        this.handleBack = this._handleBack.bind(this);// In Modal, no use , block by Modal`s onRequestClose
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this._handleBack.bind(this));
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
    }

    _signIn() {
        //store.dispatch(signInUpCreators.requestSignIn(true));
        //gSignInUpActions.requestSignIn(this.state.phoneNo,this.state.password);
        if(false==checkPhoneNoFormat(this.state.phoneNo))
        {
            ToastUtil.showShort("手机号码格式错误");
            return;
        }
        if(false==checkPasswordFormat(this.state.password))
        {
            ToastUtil.showShort("密码格式错误");
            return;
        }

        const { signInUpActions } = this.props;
        signInUpActions.requestSignIn(this.state.phoneNo,this.state.password);
    }
    _handleBack() {
        return true;
    }

    _signupCallback(){
    }

    _forgetPassword(){

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
                    <Text style={styles.mainTitle}>登录{SITE_NAME}</Text>
                    <Text style={styles.subTitle}>{SITE_SLOGAN}</Text>
                </View>
                <View style={styles.signIn}>
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
                    <View style={styles.password}>
                        <TextInput
                            style={styles.edit}
                            secureTextEntry={true}
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
                    <View style={styles.forget}>
                        <Button style={styles.forgetText} text="忘记密码?" onPress={this.props.openRetrievePasswordPage} />
                    </View>
                    <View style={styles.signInButton}>
                        <Button btnStyle={styles.signInButtonBtn} textStyle={styles.signInButtonText} text="登录" onPress={this._signIn.bind(this)}/>
                    </View>
                    <View style={styles.switchSignInUpButton}>
                        <Button btnStyle={styles.switchSignInUpButtonBtn} textStyle={styles.switchSignInUpButtonText} text="没有帐号？注册" onPress={this.props.switchSignInUp}/>
                    </View>
                </View>
                {/*
                <View style={{flex: 1}}>
                    <View style={{flex: 1, justifyContent: 'flex-end', marginLeft: 20, marginRight: 20}}>
                        <TextDivider text="其他账号登录"/>
                    </View>
                    <View style={styles.thirdPartyView}>
                        <ImageButton text="微博" image={require('../../img/icon_weibo.png')} imgStyle={{width:40,height:40}} textStyle={{color:"red"}}/>
                        <ImageButton text="微信" image={require('../../img/icon_wechat.png')} imgStyle={{width:40,height:40}} textStyle={{color:"blue"}}/>
                        <ImageButton text="Github" image={require('../../img/icon_github.png')} imgStyle={{width:40,height:40}} textStyle={{color:"green"}}/>
                    </View>
                </View>
                */}
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
    signIn:{
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
    password:{
        height: 48,
        backgroundColor:'white',
        justifyContent: 'center',
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3
    },
    forget:{
        marginTop: 10,
        alignItems: 'flex-end'
    },
    forgetText:{
        color: '#aaaaaa'
    },
    signInButton:{
        marginTop: 30,
        alignItems: 'stretch'
    },
    signInButtonBtn:{
        alignItems: 'center',
        backgroundColor: '#228b22',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3
    },
    signInButtonText:{
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
    thirdPartyView:{
        flex: 1,
        marginTop: 10,
        flexDirection:'row',
        alignItems: 'flex-start',
        justifyContent:'space-around'
    }

});
/*
const mapStateToProps = (state) => {
    const { signinup } = state;
    return {
        signinup
    };
  };
  
  const mapDispatchToProps = (dispatch) => {
    const signInUpActions = bindActionCreators(signInUpCreators, dispatch);
    gSignInUpActions=signInUpActions;
    return {
        signInUpActions
    };
  };
*/

   
  
//export default connect(mapStateToProps, mapDispatchToProps)(SignInPage);
  
export default SignInPage;