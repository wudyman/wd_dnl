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
import { StyleSheet, Image, Text,  DeviceEventEmitter, TouchableOpacity, View, Modal } from 'react-native';
import { Provinces } from '../../constants/Provinces';
import Button from '../../components/Button';
import ArrowButton from '../../components/ArrowButton';

const propTypes = {
};

let gProvinceValue=gCityValue=gDistrictValue='000000';
let provincesMap={};
let citysMap={};
let districtsMap={};
//let Citys=[];

class Businesses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        isSwitchCityModal: false,
        Citys:[],
        Districts:[],
        districtValue:gDistrictValue,
        userInfo: {}
    }
  }

  _getCurrentCity(){
    if('000000'==gProvinceValue)
      return '全国';
    else if('000000'==gCityValue)
      return Provinces[provincesMap[gProvinceValue]].label;
    else
      return Provinces[provincesMap[gProvinceValue]].label+this.state.Citys[citysMap[gCityValue]].label;
  }

  _switchCity(){
    this.setState({
        isSwitchCityModal: true
    });
  }

  _openSignPage(){
    this.props.navigation.navigate('Misc',{pageType:'sign',isSignIn:'false'});
  }

  _openUserInfoPage(){
    let itemData={'url':this.state.userInfo.url,'title':this.state.userInfo.name,'content':this.state.userInfo.mood,'thumbImage':this.state.userInfo.avatar};
    this.props.navigation.navigate('Web',{itemData});
  }

  _districtSelect(value){
    gDistrictValue=value;
    this.setState({districtValue:gDistrictValue});
  }

  _getDistrictColor(value){
    if(gDistrictValue==value)
      return '#333';
    else
      return '#25d';
  }

  _renderDistricts(){
    const districtsContent = this.state.Districts.map((district) => {
      const districtItem = (
      <Button key={district.value} text={district.label} btnStyle={{paddingRight:10}} textStyle={{color:this._getDistrictColor(district.value)}} onPress={() => this._districtSelect(district.value)}/>
      );
      return districtItem;
    });
    return districtsContent;
  }

  _citySelect(value){
    gCityValue=value;
    if('000000'==gCityValue)
      this.setState({Districts:[],isSwitchCityModal:false});
    else
    {
      let districts=this.state.Citys[citysMap[gCityValue]].children;
      for (i in districts)
      {
          let district=districts[i];
          let value=district.value;
          districtsMap[value]=i;
      }
      this.setState({Districts:districts,isSwitchCityModal:false});
    }
    gDistrictValue='000000';
  }

  _getCityColor(value){
    if(gCityValue==value)
      return '#333';
    else
      return '#25d';
  }

  _renderCitys(){
    const citysContent = this.state.Citys.map((city) => {
      const cityItem = (
      <Button key={city.value} text={city.label} btnStyle={{paddingRight:10}} textStyle={{color:this._getCityColor(city.value)}} onPress={() => this._citySelect(city.value)}/>
      );
      return cityItem;
    });
    return citysContent;
  }

  _provinceSelect(value){
    gProvinceValue=value;
    if('000000'==gProvinceValue)
      this.setState({Citys:[],isSwitchCityModal:false});
    else
    {
      let citys=Provinces[provincesMap[gProvinceValue]].children;
      for (i in citys)
      {
          let city=citys[i];
          let value=city.value;
          citysMap[value]=i;
      }
      this.setState({Citys:citys});
    }
    gCityValue='000000';
  }

  _getProvinceColor(value){
    if(gProvinceValue==value)
      return '#333';
    else
      return '#25d';
  }

  _renderProvinces(){
    const provincesContent = Provinces.map((province) => {
      const provinceItem = (
        <Button key={province.value} text={province.label} btnStyle={{paddingRight:10}} textStyle={{color:this._getProvinceColor(province.value)}} onPress={() => this._provinceSelect(province.value)}/>
      );
      return provinceItem;
    });
    return provincesContent;
  }

  componentWillMount() {
    console.log('**************HomePage componentWillMount***************');
    this.setState({userInfo:gUserInfo});
    DeviceEventEmitter.addListener('changeUserInfo', (userinfo) => {
      console.log('**************HomePage componentWillMount changeUserInfo*********');
      this.setState({userInfo:userinfo});
    });

    for (i in Provinces)
    {
        let province=Provinces[i];
        let value=province.value;     
        provincesMap[value]=i;    
    } 
  }

  componentWillUnmount() {
    console.log('**************HomePage componentWillUnmount***************');
    DeviceEventEmitter.removeAllListeners('changeUserInfo');
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={{flexDirection: 'row',alignItems: 'flex-start'}}>
              <Text>{this._getCurrentCity()}</Text>
              <Button text="[切换城市]" onPress={this._switchCity.bind(this)}/>
              <Button text="免费发布信息"/>
          </View>
          <View style={{flexDirection: 'row',alignItems: 'flex-start',flexWrap:'wrap'}}>
              <Text style={{paddingRight:10}}>请选择地区：</Text>
              <Button  text='全部' btnStyle={{paddingRight:10}} textStyle={{color:this._getDistrictColor('000000')}} onPress={() => this._districtSelect('000000')}/>
              {this._renderDistricts()}
          </View>
        </View>
        <Modal
          visible={this.state.isSwitchCityModal}
          onRequestClose={() => {
            this.setState({
                isSwitchCityModal: false
            });
          }}
        >
          <View style={{flexDirection: 'row',alignItems: 'flex-start',flexWrap:'wrap'}}>
              <Text style={{paddingRight:10}}>请选择省份：</Text>
              <Button  text='全国' btnStyle={{paddingRight:10}} textStyle={{color:this._getProvinceColor('000000')}} onPress={() => this._provinceSelect('000000')}/>
              {this._renderProvinces()}
          </View>
          <View style={{flexDirection: 'row',alignItems: 'flex-start',flexWrap:'wrap'}}>
              <Text style={{paddingRight:10}}>请选择城市：</Text>
              <Button  text='全部' btnStyle={{paddingRight:10}} textStyle={{color:this._getCityColor('000000')}} onPress={() => this._citySelect('000000')}/>
              {this._renderCitys()}
          </View>
        </Modal>
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
  login: {
    //flex: 1,
    padding:10,
    alignItems: 'center'
  },
  loginButton: {
    margin: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 50,
    backgroundColor: '#228b22'
  },
  logo: {
    width: 110,
    height: 110,
    marginTop: 50
  },
  userInfo: {
    alignItems: 'center'
  },
  userInfoAvatar: {
    width: 70,
    height: 70,
    borderRadius:35
  },
  userInfoName: {
    fontSize:20,
    fontWeight: 'bold',
    alignItems: 'center'
  },
  userInfoMood: {
    alignItems: 'center'
  },
  version: {
    fontSize: 16,
    textAlign: 'center',
    color: '#aaaaaa',
    marginTop: 5
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    color: '#313131',
    marginTop: 10
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#4e4e4e'
  },
  midContainer: {
    //alignItems: 'flex-start'
    padding:20
  },
  midContent: {
    //flexDirection: 'column'
  },
  arrowButtonTextStyle: {
    fontSize: 16,
    color:'#555',
    textAlign: 'left'
  },
  arrowButtonTipsStyle: {
    fontSize: 14,
    color:'#aaa',
    marginRight:5
  }
});
Businesses.propTypes = propTypes;
export default Businesses;
