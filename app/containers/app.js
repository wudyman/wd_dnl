/**
 *
 * Copyright 2015-present wd_dnl
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
import { StackNavigator, TabNavigator } from 'react-navigation';
import Splash from '../pages/Splash';
import CategoryContainer from '../containers/CategoryContainer';
import MainContainer from '../containers/MainContainer';
import WebViewPage from '../pages/WebViewPage/WebViewPage';
import HomeContainer from '../containers/HomeContainer';
import MiscContainer from '../containers/MiscContainer';
import SubContainer from '../containers/SubContainer';

const TabContainer = TabNavigator(
  {
    Main: { screen: MainContainer },
    Category: { screen: CategoryContainer },
    Home: { screen: HomeContainer }
  },
  {
    lazy: true,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: '#228b22',
      inactiveTintColor: '#555',
      showIcon: true,
      style: {
        backgroundColor: '#fff'
      },
      indicatorStyle: {
        opacity: 0
      },
      tabStyle: {
        padding: 0
      }
    }
  }
);

const App = StackNavigator(
  {
    Splash: { screen: Splash },
    Category: {
      screen: CategoryContainer,
      navigationOptions: {
        headerStyle: {borderBottomWidth: 1,borderColor:'#f8f8f8',elevation: 0,shadowOpacity: 0},
      }
    },
    Main: {
      screen: TabContainer,
      navigationOptions: {
        //headerLeft: null,
        headerStyle: {borderBottomWidth: 1,borderColor:'#f8f8f8',elevation: 0,shadowOpacity: 0},
        //headerStyle：设置导航条的样式。背景色，宽高等。如果想去掉安卓导航条底部阴影可以添加elevation: 0，iOS下用shadowOpacity: 0
      }
    },
    Misc: {
      screen: MiscContainer,
      navigationOptions: {
        header: null,
        headerStyle: {borderBottomWidth: 1,borderColor:'#f8f8f8',elevation: 0,shadowOpacity: 0},
        //headerStyle：设置导航条的样式。背景色，宽高等。如果想去掉安卓导航条底部阴影可以添加elevation: 0，iOS下用shadowOpacity: 0
      }
    },
    Sub: {
      screen: SubContainer,
      navigationOptions: {
        //header: null,
        headerStyle: {borderBottomWidth: 1,borderColor:'#f8f8f8',elevation: 0,shadowOpacity: 0},
        //headerStyle：设置导航条的样式。背景色，宽高等。如果想去掉安卓导航条底部阴影可以添加elevation: 0，iOS下用shadowOpacity: 0
      }
    },
    Web: { 
      screen: WebViewPage,
      navigationOptions: {
        headerStyle: {borderBottomWidth: 1,borderColor:'#f8f8f8',elevation: 0,shadowOpacity: 0},
      } 
    }
  },
  {
    headerMode: 'screen',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#fcfcfc'
      },
      headerTitleStyle: {
        color: '#228b22',
        fontSize: 20
      },
      headerTintColor: '#555'
      //headerTintColor: '#228b22'
    }
  }
);

export default App;
