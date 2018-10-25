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

import Businesses from '../pages/BusinessPage/Businesses';

class BusinessContainer extends React.Component {
  static navigationOptions = {
    title: '买卖',
    tabBarIcon: ({ tintColor }) => (
      <View>
        <Icon name="md-pricetags" size={25} color={tintColor} />
      </View>
    ),
    header:null
  };

  componentWillMount() {
    console.log('**************BusinessContainer componentWillMount*********');
    gShowNotice=false;
  }

  componentDidMount() {
    console.log('**************BusinessContainer componentDidMount*********');
  }

  render() {
    return <Businesses {...this.props} />;
  }
}

export default BusinessContainer;