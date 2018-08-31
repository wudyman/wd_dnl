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
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import HomePage from '../pages/HomePage/HomePage';

class HomeContainer extends React.Component {
  static navigationOptions = {
    title: '我',
    tabBarIcon: ({ tintColor }) => (
      <View>
        {gShowNotice?
        <View style={{flexDirection:'row',paddingLeft:7}}>
          <Icon name="md-person" size={25} color={tintColor} />
          <View style={{left:-6,top:1,height:8,width:8,borderRadius:4,backgroundColor:'red',borderColor:'#fff',borderWidth:1}}></View>
        </View>
        :
        <Icon name="md-person" size={25} color={tintColor} />
        }
      </View>
    ),
    header:null
  };

  componentWillMount() {
    console.log('**************HomeContainer componentWillMount*********');
    gShowNotice=false;
  }

  componentDidMount() {
    console.log('**************HomeContainer componentDidMount*********');
  }

  render() {
    return <HomePage {...this.props} />;
  }
}

export default HomeContainer;