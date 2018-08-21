/** @format */

import {AppRegistry} from 'react-native';
import { YellowBox } from 'react-native';
//import App from './App';
import {name as appName} from './app.json';
import Root from './app/root';
//import SplashScreen from 'react-native-splash-screen';

//SplashScreen.hide();
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
AppRegistry.registerComponent(appName, () => Root);
