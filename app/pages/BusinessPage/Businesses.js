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
import { StyleSheet, Image, Text, TextInput, DeviceEventEmitter, TouchableOpacity, View, ListView, Modal } from 'react-native';
import ScrollableTabView, { ScrollableTabBar, DefaultTabBar } from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
import { Provinces } from '../../constants/Provinces';
import Button from '../../components/Button';
import RequestUtil from '../../utils/RequestUtil';
import NoDataView from '../../components/NoDataView';
import ItemList from '../../components/ItemList';
import ItemBusiness from './ItemBusiness';
import { concatFilterDuplicate, removeItemById, isNotDuplicateItem } from '../../utils/ItemsUtil';
import { formatUrlWithSiteUrl } from '../../utils/FormatUtil';
import { SITE_URL, BUSINESSES_URL } from '../../constants/Urls';
import { DATA_STEP_DOUBLE } from '../../constants/Constants';

const propTypes = {
};

let gProvinceValue=gCityValue=gDistrictValue='000000';
let provincesMap={};
let citysMap={};
let districtsMap={};
//let Citys=[];

const BUSINESS_TYPE = [['0','all','全部',0],['1','sell','出售',0],['2','buy','求购',0]];
const INDEX_ID =0;
const INDEX_TYPE =1;
const INDEX_NAME =2;
const INDEX_DATAINDEX =3;

let currentTabIndex=0;
let currentBusinessType=BUSINESS_TYPE[currentTabIndex][INDEX_TYPE];
let currentDataIndex=0;
let resultDatas=[[],[],[]];

let keywordText='';
let noMoreViewShow=false;

class Businesses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        isSwitchCityModal: false,
        Citys:[],
        Districts:[],
        districtValue:gDistrictValue,
        keywordText: '',
        results: [],
        dataSource: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2
        }),
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


  _searchCallback(ret,callbackarg){
    let businessInfos=resultDatas[callbackarg];
    if('fail'!=ret)
    {
      console.log(ret);
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
        businessInfo.update_date=item[8];

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
        console.log(businessInfo);
        if(isNotDuplicateItem(businessInfos,businessInfo))
          businessInfos.push(businessInfo);
      });
      BUSINESS_TYPE[callbackarg][INDEX_DATAINDEX]+=DATA_STEP_DOUBLE;
    }
    else{
      noMoreViewShow=true;
      console.log(ret);
    }
    this.setState({results:resultDatas});
  }


  _search(start){
    noMoreViewShow=false;
    let addr='';
    let addr_value='000000';
    if("000000"==gProvinceValue)
    {
        addr_value="000000";
        addr="";
    }
    else if("000000"==gCityValue)
    {
        addr_value=gProvinceValue;
        addr=Provinces[provincesMap[gProvinceValue]].label;
    }
    else if("000000"==gDistrictValue)
    {
        addr_value=gProvinceValue+gCityValue;
        addr=Provinces[provincesMap[gProvinceValue]].label+this.state.Citys[citysMap[gCityValue]].label;
    }
    else
    {
        addr_value=gProvinceValue+gCityValue+gDistrictValue;
        addr=Provinces[provincesMap[gProvinceValue]].label+this.state.Citys[citysMap[gCityValue]].label+this.state.Districts[districtsMap[gDistrictValue]].label;
    }
    let keyword=keywordText.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,"");
    let type=currentBusinessType;
    let order=1;
    let end=start+DATA_STEP_DOUBLE;
    let url=BUSINESSES_URL+type+'/'+order+'/'+start+'/'+end+'/';
    let formData=new FormData();
    formData.append("addr",addr);
    formData.append("addr_value",addr_value);
    formData.append("keyword",keyword);
    RequestUtil.requestWithCallback(url,'POST',formData,this._searchCallback.bind(this),callbackarg=currentTabIndex);
  }

  _pressSearch() {
    currentDataIndex=0;
    resultDatas=[[],[],[]];
    BUSINESS_TYPE[0][INDEX_DATAINDEX]=0;
    BUSINESS_TYPE[1][INDEX_DATAINDEX]=0;
    BUSINESS_TYPE[2][INDEX_DATAINDEX]=0;
    this.setState({keywordText:keywordText,results:resultDatas});
    this._search(currentDataIndex);
  }



  componentWillMount() {
    console.log('**************HomePage componentWillMount***************');
    for (i in Provinces)
    {
        let province=Provinces[i];
        let value=province.value;     
        provincesMap[value]=i;    
    } 
    this._pressSearch();
  }

  componentWillUnmount() {
    console.log('**************HomePage componentWillUnmount***************');
  }

  onPress = (itemData) => {
    const { navigate } = this.props.navigation;
    navigate('Web', { itemData });
  };
  
  onRefresh = () => {
    console.log('**************onRefresh*********');
    this._pressSearch();
  };

  onEndReached = () => {
    console.log('**************onEndReached*********');
    currentDataIndex=BUSINESS_TYPE[currentTabIndex][INDEX_DATAINDEX];
    this._search(currentDataIndex);
  };


  _renderFooter = () => {
    if(noMoreViewShow)
      return <NoDataView />;
    else
      return <View />;
  };

  _renderItem = resultData => {
      return <ItemBusiness resultData={resultData} onPressHandler={this.onPress}/>
  };

  _renderResult(typeId) {
    let dataSource=this.state.dataSource.cloneWithRows(this.state.results[parseInt(typeId)]);
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

  _renderContent(){
    const content = BUSINESS_TYPE.map((type) => {
      const typeView = (
        <View key={type[INDEX_ID]} tabLabel={type[INDEX_NAME]} style={styles.base}>
          {(currentBusinessType==type[INDEX_TYPE])? 
            this._renderResult(
              type[INDEX_ID]
          )
          :
          <View/>
          }
        </View>
      );
      return typeView;
    });
    return (      
      <ScrollableTabView
        ref="myScrollableTabView"
        renderTabBar={() => (
          <DefaultTabBar
            style={{borderWidth:1,borderColor:'#f8f8f8'}}
            tabStyle={styles.tab}
            textStyle={styles.tabText}
          />
        )}
        initialPage={0}
        locked={false}
        scrollWithoutAnimation={false}
        onChangeTab={(obj) => {
            console.log('**************searchPage onChangeTab*********');
            currentTabIndex=obj.i;
            currentBusinessType=BUSINESS_TYPE[currentTabIndex][INDEX_TYPE];
            currentDataIndex=BUSINESS_TYPE[currentTabIndex][INDEX_DATAINDEX];
            this._search(currentDataIndex);
          }
        }
        tabBarBackgroundColor="#ffffff"
        tabBarUnderlineStyle={styles.tabBarUnderline}
        tabBarActiveTextColor="#228b22"
        tabBarInactiveTextColor="#888"
      >
        {content}
      </ScrollableTabView>
      );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.head}>
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
          <View style={{flexDirection:'row',alignItems: 'center',justifyContent: 'space-around'}}>
            <View style={{flexDirection:'row',alignItems: 'center',marginTop:0,marginRight:20,paddingLeft:20,backgroundColor:'transparent',borderColor:'#f0f0f0',borderWidth:1,borderRadius: 20}}>
                <Icon name="md-search" size={20} color='#aaaaaa' />
                <TextInput
                ref="myTextInput"
                style={{width:200,padding:2,fontSize:14,textAlign:'left'}}
                autoFocus= {true}
                selectionColor='#228b22'
                placeholder= '请输入关键字'
                placeholderTextColor='#aaaaaa'
                defaultValue={this.state.keywordText}
                onChangeText={
                    (text) => {
                        //resultDatas=[[],[],[]];
                        keywordText=text;
                        //this.setState({keywordText:keywordText,results:resultDatas});
                    }
                  }
                underlineColorAndroid='transparent' />
            </View>
            <View style={{}}>
                <Button
                    btnStyle={{padding:10}}
                    textStyle={{color:'black',fontSize:16}}
                    text='搜索'
                    onPress={this._pressSearch.bind(this)}
                    activeOpacity={0.2}
                />
            </View>
          </View>
        </View>
        <View style={{marginBottom:20}}></View>
          {this._renderContent()}
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
  head: {
    //flex: 1,
    justifyContent: 'center',
    paddingBottom: 10
  },
  tabBarUnderline: {
    backgroundColor: 'transparent',
  }
});
Businesses.propTypes = propTypes;
export default Businesses;
