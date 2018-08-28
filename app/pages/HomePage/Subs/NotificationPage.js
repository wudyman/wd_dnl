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
import { ScrollView, RefreshControl, StyleSheet, View, ListView } from 'react-native';
import store from 'react-native-simple-store';
import ItemList from './ItemList';
import ItemNotification from './ItemNotification';
import { concatFilterDuplicate } from '../../../utils/FormatUtil';
import { SITE_URL, NOTIFICATIONS_URL } from '../../../constants/Urls';
import { DATA_STEP } from '../../../constants/Constants';

const propTypes = {
};

let start=0;
class NotificationPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
        }
    }

    componentWillMount() {
        console.log('**************NotificationPage componentWillMount*********');
        this.setState({notifications:[]});
        start=0;
        this._getNotifications(start);
        start=start+DATA_STEP*2;
    }

    _convertNotifications(ret)
    {
        let notifications=[];
        if("fail"!=ret)
        {
            ret.map((item)=>{
                let notification={};
                notification.id=item[0];
                notification.type=item[1];
                notification.pub_date=item[2];
                notification.sender_id=item[3];
                notification.sender_first_name=item[4];
                notification.target_id=item[5];
                notification.target_title=item[6];
                notification.status=item[7];

                notification.questionUrl=SITE_URL+"/question/"+notification.target_id+"/";
                notification.erUrl=SITE_URL+"/er/"+notification.sender_id+"/";
                notification.url="";//SITE_URL+"/question/"+notification.target_id+"/";

                /*********for wechat share******** */
                notification.title="";//notification.target_title;
                //notification.format_content="";
                //notification.contentImg="";

                notifications.push(notification);
            });
        }
        return concatFilterDuplicate(this.state.notifications,notifications);
    }

    _getNotifications(start){
        let end=start+DATA_STEP*2;
        let url=NOTIFICATIONS_URL+'1/'+start+'/'+end+'/';
        console.log(url);
        fetch(url, {
            method:'POST',
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
            let notifications=this._convertNotifications(responseData);
            this.setState({notifications:notifications});
        } else {
            console.log(responseData);
        }
        })
        .catch((error) => {
        console.error(error);
        });
    }

    onPress = (type,itemData) => {
        const { navigate } = this.props.navigation;
        if('PEOPLE'==type)
        {
            itemData.url=itemData.erUrl;
            itemData.title=itemData.sender_first_name;
            //navigate('Misc', { pageType:'er',itemData });
            navigate('Web', { itemData });
        }
        else
        {
            itemData.url=itemData.questionUrl;
            itemData.title=itemData.target_title;
            navigate('Web', { itemData });
        }
      };

    onRefresh = () => {
        console.log('**************NotificationPage onRefresh*********');
        this.setState({notifications:[]});
        start=0;
        this._getNotifications(start);
        start=start+DATA_STEP*2;
    };

    onEndReached = () => {
        console.log('**************NotificationPage onEndReached*********');
        this._getNotifications(start);
        start=start+DATA_STEP*2;
    };

    _renderFooter = () => {
        console.log('**************NotificationPage _renderFooter*********');
        return <View />;
    };



    _renderItem = notification => (
        <ItemNotification notification={notification} onPressHandler={this.onPress}/>
    );

    renderItems = () => {
        let dataSource=this.state.dataSource.cloneWithRows(this.state.notifications);
        return (
        <ScrollView
            automaticallyAdjustContentInsets={false}
            horizontal={false}
            contentContainerStyle={styles.no_data}
            style={styles.base}
            refreshControl={
            <RefreshControl
                refreshing={false}
                onRefresh={this.onRefresh}
                title="Loading..."
                colors={['#228b22cc', '#00ff00ff', '#ffffbb33', '#ffff4444']}
                //colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
            />
            }
        >
            <ItemList
                dataSource={dataSource}
                isRefreshing={false}
                onEndReached={this.onEndReached}
                onRefresh={this.onRefresh}
                renderFooter={this._renderFooter}
                renderItem={this._renderItem}
            />
        </ScrollView>
        );
    };

    render() {
        return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={{height: 5, backgroundColor:'#f0f4f4'}}/>
                {this.renderItems()}
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
        paddingBottom: 10
    },
});
NotificationPage.propTypes = propTypes;
export default NotificationPage;
