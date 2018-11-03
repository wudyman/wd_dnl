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
import store from 'react-native-simple-store';
import Icon from 'react-native-vector-icons/Ionicons';
import { Provinces } from '../../constants/Provinces';
import Button from '../../components/Button';
import RequestUtil from '../../utils/RequestUtil';
import NoDataView from '../../components/NoDataView';
import ItemList from '../../components/ItemList';
import ItemBusiness from './ItemBusiness';
import { isNotDuplicateItem } from '../../utils/ItemsUtil';
import { formatUrlWithSiteUrl } from '../../utils/FormatUtil';
import { SITE_URL, BUSINESSES_URL } from '../../constants/Urls';
import { DATA_STEP_DOUBLE } from '../../constants/Constants';

const propTypes = {
};

let provinceValue=cityValue=districtValue='000000';
let provincesMap={};
let citysMap={};
let districtsMap={};
let citys=districts=[];

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
let dataRequesting=false;

class Businesses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        isSwitchCityModal: false,
        Citys:citys,
        Districts:districts,
        districtValue:districtValue,
        keywordText: '',
        results: [],
        dataSource: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2
        }),
        initDone:false
    }
  }

  _businessPost(){
    this.props.navigation.navigate('Misc',{pageType:'businessPost'});
  }

  _getCurrentCity(){
    if('000000'==provinceValue)
      return '全国';
    else if('000000'==cityValue)
      return Provinces[provincesMap[provinceValue]].label;
    else
      return citys[citysMap[cityValue]].label;
  }

  _switchCity(){
    this.setState({
        isSwitchCityModal: true
    });
  }

  _districtSelect(value,init=false){
    districtValue=value;
    this.setState({districtValue:districtValue});
    if(false==init){
      store.save('addrValue',[provinceValue,cityValue,districtValue]);
      this._pressSearch();
    }
  }

  _getDistrictColor(value){
    if(districtValue==value)
      return '#333';
    else
      return '#25d';
  }

  _renderDistricts(){
    const districtsContent = districts.map((district) => {
      const districtItem = (
      <Button key={district.value} text={district.label} btnStyle={styles.addrSelectBtnStyle} textStyle={{fontSize:16,color:this._getDistrictColor(district.value)}} onPress={() => this._districtSelect(district.value)}/>
      );
      return districtItem;
    });
    return districtsContent;
  }

  _citySelect(value,init=false){
    cityValue=value;
    if('000000'==cityValue)
      this.setState({Districts:[],isSwitchCityModal:false});
    else
    {
      districts=citys[citysMap[cityValue]].children;
      for (i in districts)
      {
          let district=districts[i];
          let value=district.value;
          districtsMap[value]=i;
      }
      this.setState({Districts:districts,isSwitchCityModal:false});
    }
    if(false==init){
      districtValue='000000';
      store.save('addrValue',[provinceValue,cityValue,districtValue]);
      this._pressSearch();
    }
  }

  _getCityColor(value){
    if(cityValue==value)
      return '#333';
    else
      return '#25d';
  }

  _renderCitys(){
    const citysContent = citys.map((city) => {
      const cityItem = (
      <Button key={city.value} text={city.label} btnStyle={styles.addrSelectBtnStyle} textStyle={{fontSize:16,color:this._getCityColor(city.value)}} onPress={() => this._citySelect(city.value)}/>
      );
      return cityItem;
    });
    return citysContent;
  }

  _provinceSelect(value,init=false){
    provinceValue=value;
    if('000000'==provinceValue)
    {
      if(false==init)
      {
        this.setState({Citys:[],isSwitchCityModal:false});
        this._pressSearch();
      }
    }
    else
    {
      citys=Provinces[provincesMap[provinceValue]].children;
      for (i in citys)
      {
          let city=citys[i];
          let value=city.value;
          citysMap[value]=i;
      }
      this.setState({Citys:citys});
    }
    if(false==init){
      cityValue=districtValue='000000';
      store.save('addrValue',[provinceValue,cityValue,districtValue]);
    }
  }

  _getProvinceColor(value){
    if(provinceValue==value)
      return '#333';
    else
      return '#25d';
  }

  _renderProvinces(){
    const provincesContent = Provinces.map((province) => {
      const provinceItem = (
        <Button key={province.value} text={province.label} btnStyle={styles.addrSelectBtnStyle} textStyle={{fontSize:16,color:this._getProvinceColor(province.value)}} onPress={() => this._provinceSelect(province.value)}/>
      );
      return provinceItem;
    });
    return provincesContent;
  }


  _searchCallback(ret,callbackarg){
    let businessInfos=resultDatas[callbackarg];
    if('fail'!=ret)
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
    dataRequesting=false;
  }


  _search(start){
    if(dataRequesting)
      return;
    dataRequesting=true;
    noMoreViewShow=false;
    let addr='';
    let addr_value='000000';
    if("000000"==provinceValue)
    {
        addr_value="000000";
        addr="";
    }
    else if("000000"==cityValue)
    {
        addr_value=provinceValue;
        addr=Provinces[provincesMap[provinceValue]].label;
    }
    else if("000000"==districtValue)
    {
        addr_value=provinceValue+cityValue;
        addr=Provinces[provincesMap[provinceValue]].label+citys[citysMap[cityValue]].label;
    }
    else
    {
        addr_value=provinceValue+cityValue+districtValue;
        addr=Provinces[provincesMap[provinceValue]].label+citys[citysMap[cityValue]].label+districts[districtsMap[districtValue]].label;
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
    console.log('**************BusinessesPage componentWillMount***************');
    store.get('addrValue').then((values)=>{
      if(null!=values){
        provinceValue=values[0];
        cityValue=values[1];
        districtValue=values[2];
      }
      else{
        provinceValue=cityValue=districtValue='000000';
      }
      for (i in Provinces)
      {
          let province=Provinces[i];
          let value=province.value;     
          provincesMap[value]=i;    
      } 
      this._provinceSelect(provinceValue,true);
      this._citySelect(cityValue,true);
      this._districtSelect(districtValue,true);
      this._pressSearch();
      this.setState({initDone:true});
    });
  }

  componentWillUnmount() {
    console.log('**************BusinessesPage componentWillUnmount***************');
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
    if(false==this.state.initDone)
      return;
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
          <View style={styles.headTop}>
            <TouchableOpacity onPress={this._switchCity.bind(this)} style={styles.switchCity}>
              <Text style={styles.switchCityText}>{this._getCurrentCity()}</Text>
              <Button text="[切换城市]" onPress={this._switchCity.bind(this)}/>
            </TouchableOpacity>
            <Button text="免费发布信息" textStyle={styles.postTextStyle} btnStyle={styles.postBtnStyle} onPress={this._businessPost.bind(this)}/>
          </View>
          {cityValue!='000000'?
          <View style={styles.district}>
              <Text style={styles.addrPlease}>请选择区县：</Text>
              <Button  text='全部' btnStyle={styles.addrSelectBtnStyle} textStyle={{fontSize:16,color:this._getDistrictColor('000000')}} onPress={() => this._districtSelect('000000')}/>
              {this._renderDistricts()}
          </View>
          :
          <View/>
          }
          <View style={{marginTop:10,flexDirection:'row',alignItems: 'center',justifyContent: 'flex-start'}}>
            <View style={{flexDirection:'row',alignItems: 'center',marginTop:0,paddingLeft:20,backgroundColor:'transparent',borderColor:'#f0f0f0',borderWidth:1}}>
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
                    btnStyle={{paddingLeft:10,paddingRight:10,paddingTop:6,paddingBottom:6,backgroundColor:'#228b22'}}
                    textStyle={{color:'white',fontSize:16}}
                    text='搜索'
                    onPress={this._pressSearch.bind(this)}
                    activeOpacity={0.2}
                />
            </View>
          </View>
        </View>
              
        <View style={{marginTop:10,marginBottom:10,height: 3, backgroundColor:'#f0f4f4'}}/>
          {this._renderContent()}
          
        <Modal
          visible={this.state.isSwitchCityModal}
          onRequestClose={() => {
            this.setState({
                isSwitchCityModal: false
            });
          }}
        >
          <View style={styles.province}>
              <Text style={styles.addrPlease}>请选择省份：</Text>
              <Button  text='全国' btnStyle={styles.addrSelectBtnStyle} textStyle={{fontSize:16,color:this._getProvinceColor('000000')}} onPress={() => this._provinceSelect('000000')}/>
              {this._renderProvinces()}
          </View>
          {provinceValue!='000000'?
          <View style={styles.city}>
              <Text style={styles.addrPlease}>请选择城市：</Text>
              <Button  text='全部' btnStyle={styles.addrSelectBtnStyle} textStyle={{fontSize:16,color:this._getCityColor('000000')}} onPress={() => this._citySelect('000000')}/>
              {this._renderCitys()}
          </View>
          :
          <View/>
          }
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
    justifyContent: 'center',
    padding: 10
  },
  headTop: {
    marginTop:10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
  },
  switchCity: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems:'center'
  },
  switchCityText: {
    fontSize:18,
    fontWeight:'700',
    color:'#228b22'
  },
  postBtnStyle: {
    padding:5,
    borderColor:'#228b22',
    borderWidth:1
  },
  postTextStyle: {
    color:'#228b22'
  },
  province: {
    margin:10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap:'wrap'
  },
  city: {
    margin:10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap:'wrap'
  },
  district: {
    marginTop:10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap:'wrap'
  },
  addrPlease: {
    fontSize:16,
    padding:5
  },
  addrSelectBtnStyle: {
    padding:5
  },

  tabBarUnderline: {
    backgroundColor: '#228b22',//'transparent',
  }
});
Businesses.propTypes = propTypes;
export default Businesses;
