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
import { StyleSheet, View, ListView, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import store from 'react-native-simple-store';
import moment from 'moment';
import RequestUtil from '../../../utils/RequestUtil';
import Button from '../../../components/Button';
import NoDataView from '../../../components/NoDataView';
import ItemList from '../../../components/ItemList';
import ItemBusiness from '../../BusinessPage/ItemBusiness';
import { concatFilterDuplicate } from '../../../utils/ItemsUtil';
import { formatUrlWithSiteUrl } from '../../../utils/FormatUtil';
import { SITE_URL, REQUEST_MY_DATA_URL } from '../../../constants/Urls';
import { DATA_STEP_DOUBLE } from '../../../constants/Constants';

const propTypes = {
};

let noMoreViewShow=false;
let dataRequesting=false;
let start=0;
class MyBusinessPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myBusinesses: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
        }
    }

    componentWillMount() {
        console.log('**************MyBusinessPage componentWillMount*********');
        if('true'==gUserInfo.isSignIn)
            this._getMyBusinesses('refresh');
    }

    componentWillUnmount() {
        console.log('**************MyBusinessPage componentWillUnmount*********');
    }

    _openSignPage(){
        this.props.navigation.navigate('Misc',{pageType:'sign',isSignIn:'false'});
    }

    _getMyBusinessesCallback(ret)
    {
        let myBusinesses=[];
        if("fail"!=ret)
        {
            ret.map((item)=>{
                let businessInfo={};
                businessInfo.id=item[0];
                businessInfo.title=item[1];
                businessInfo.detail=item[2];
                businessInfo.type=item[3];
                businessInfo.addr=item[4];
                businessInfo.addr_value=item[5];
                businessInfo.contact=item[6];
                businessInfo.pictures=item[7];
                businessInfo.pub_date=item[8];
                businessInfo.update_date=item[9];
                businessInfo.poster_id=item[10];
                businessInfo.poster_name=item[11];

                businessInfo.url=SITE_URL+"/business/"+businessInfo.id+"/";
                businessInfo.pictures_array=[];
                if(""!=businessInfo.pictures)
                {
                    let pictures=businessInfo.pictures;
                    let array=pictures.split(";");
                    for (let i in array)
                    {
                        let picture=array[i];
                        if(picture)
                        {
                          businessInfo.pictures_array.push(formatUrlWithSiteUrl(picture));
                        }
                    }
                }
                else{
                    businessInfo.pictures_array.push(formatUrlWithSiteUrl('/static/common/img/business_no_picture.jpg'));
                }
                myBusinesses.push(businessInfo);
            });
            start+=DATA_STEP_DOUBLE;
        }
        else{
            noMoreViewShow=true;
        }
        this.setState({myBusinesses:concatFilterDuplicate(this.state.myBusinesses,myBusinesses)});
        dataRequesting=false;
    }

    _getMyBusinesses(type){
        if(dataRequesting)
            return;
        dataRequesting=true;
        noMoreViewShow=false;
        if('refresh'==type)
        {
            start=0;
            this.setState({myBusinessess:[]});
        }
        let end=start+DATA_STEP_DOUBLE;
        let url=REQUEST_MY_DATA_URL+'business/'+start+'/'+end+'/';
        RequestUtil.requestWithCallback(url,'POST','',this._getMyBusinessesCallback.bind(this));
    }

    onPress = (itemData) => {
        const { navigate } = this.props.navigation;
        //navigate('Web', { itemData });
        navigate('BusinessInfo',{itemData});
    };

    onRefresh = () => {
        console.log('**************MyBusinessPage onRefresh*********');
        this._getMyBusinesses('refresh');
    };

    onEndReached = () => {
        console.log('**************MyBusinessPage onEndReached*********');
        if(!noMoreViewShow)
            this._getMyBusinesses('more');
    };

    _renderFooter = () => {
        console.log('**************MyBusinessPage _renderFooter*********');
        if(noMoreViewShow)
            return <NoDataView />;
        else
            return <View />;
    };

    _renderItem = resultData => {
        return <ItemBusiness resultData={resultData} onPressHandler={this.onPress}/>
    };

    _renderContent = () => {
        if('true'==gUserInfo.isSignIn){
            let dataSource=this.state.dataSource.cloneWithRows(this.state.myBusinesses);
            return (
                <ItemList
                    dataSource={dataSource}
                    isRefreshing={false}
                    onEndReached={this.onEndReached}
                    onRefresh={this.onRefresh}
                    renderFooter={this._renderFooter}
                    renderItem={this._renderItem}
                />
            );
        }
        else{
            return (
                <View style={styles.hint}>
                    <Icon name="ios-cash-outline" size={100} color={"#999"}/>
                    <View style={{margin:5}}></View>
                    <Text style={styles.hintText}>登录后可以查看我的买卖</Text>
                    <View style={{margin:5}}></View>
                    <Button
                        btnStyle={styles.hintToSignInBtn}
                        textStyle={styles.hintToSignInText}
                        text="去登录"
                        onPress={() => this._openSignPage()}
                    />
                </View>
            );
        }
    };

    render() {
        return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={{height: 5, backgroundColor:'#f0f4f4'}}/>
                {this._renderContent()}
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
    content: {
        //flex: 1,
        justifyContent: 'center',
        paddingBottom: 1
    },
    hint: {
        justifyContent:'center',
        alignItems:'center',
        margin:100
    },
    hintText: {
        color:'#aaa'
    },
    hintToSignInBtn: {
        paddingLeft:15,
        paddingRight:15,
        paddingTop:3,
        paddingBottom:3,
        borderColor:'#555',
        borderWidth:1,
        borderRadius: 15
    },
    hintToSignInText: {
        fontSize:15,
        color:'#555'
    },
});
MyBusinessPage.propTypes = propTypes;
export default MyBusinessPage;
