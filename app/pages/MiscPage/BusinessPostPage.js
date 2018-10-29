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
import { Platform, StyleSheet, View, Picker, Text, TextInput, Image } from 'react-native';
import { Provinces } from '../../constants/Provinces';
import Button from '../../components/Button';
import  ImagePicker from 'react-native-image-picker';
import store from 'react-native-simple-store';
import NavigationUtil from '../../utils/NavigationUtil';


const propTypes = {
  signInUpActions: PropTypes.object,
  signinup: PropTypes.object.isRequired
};

let provinceValue=cityValue=districtValue='000000';
let provincesMap2={};
let citysMap2={};
let districtsMap2={};
let citys2=districts2=[];

let imageOptions = {
  //底部弹出框选项
  title:'请选择',
  cancelButtonTitle:'取消',
  takePhotoButtonTitle:'拍照',
  chooseFromLibraryButtonTitle:'选择相册',
  quality:0.75,
  allowsEditing:true,
  noData:false,
  storageOptions: {
      skipBackup: true,
      path:'images'
  }
}

class BusinessPostPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        type:'sell',
        provinceValue:provinceValue,
        cityValue:cityValue,
        districtValue:districtValue,
        title:'',
        detail:'',
        pictures:'',
        contact:'',
        imageSource:'',
        initDone:false,
    }
  }

  _onFileUpload(){

  }

  _selectImage = () =>{
      ImagePicker.showImagePicker(imageOptions,(response) =>{
          console.log('response'+response);
          if (response.didCancel){
              return;
          }
          else if (response.error){
            console.log("ImagePicker发生错误：" + response.error);
          }
          else{
            let source,file;
            if (Platform.OS === 'android') {
              source = {uri: response.uri, isStatic: true}
              file = response.uri;
            } else {
              source = {uri: response.uri.replace('file://', ''), isStatic: true}
              file = response.uri.replace('file://', '');
            }
            console.log(source);
            console.log(file);
            // You can also display the image using data:
            // let source = { uri: 'data:image/jpeg;base64,' + response.data };
            this.setState({
              imageSource: source
            });

            this._onFileUpload(file,response.fileName||'unkown.jpg');
          }
      })
 }

  componentWillMount() {
    console.log('***************BusinessPostPage componentWillMount**************');
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
          provincesMap2[value]=i;    
      } 
      this._provinceSelect(provinceValue,true);
      this._citySelect(cityValue,true);
      this._districtSelect(districtValue,true);
      this.setState({provinceValue:provinceValue,cityValue:cityValue,districtValue:districtValue,initDone:true});
    });
  }  
  
  _districtSelect(value,init=false){
    districtValue=value;
    this.setState({districtValue:districtValue});
    if(false==init){
      this.setState({provinceValue:provinceValue,cityValue:cityValue,districtValue:districtValue});
    }
  }

  

  _renderDistricts(){
    const districtsContent = districts2.map((district) => {
      const districtItem = (
        <Picker.Item key={district.value} label={district.label} value={district.value} />
      );
      return districtItem;
    });
    return districtsContent;
  }

  _citySelect(value,init=false){
    cityValue=value;
    districts2=[];
    if('000000'==cityValue){
      districts2=[];
    }
    else
    {
      districts2=citys2[citysMap2[cityValue]].children;
      for (i in districts2)
      {
          let district=districts2[i];
          let value=district.value;
          districtsMap2[value]=i;
      }
    }
    if(false==init){
      districtValue='000000';
      this.setState({provinceValue:provinceValue,cityValue:cityValue,districtValue:districtValue});
    }
  }

  _renderCitys(){
    const citysContent = citys2.map((city) => {
      const cityItem = (
        <Picker.Item key={city.value} label={city.label} value={city.value} />
      );
      return cityItem;
    });
    return citysContent;
  }

  _provinceSelect(value,init=false){
    provinceValue=value;
    citys2=districts2=[];
    if('000000'==provinceValue)
    {
      citys2=districts2=[];
    }
    else
    {
      citys2=Provinces[provincesMap2[provinceValue]].children;
      for (i in citys2)
      {
          let city=citys2[i];
          let value=city.value;
          citysMap2[value]=i;
      }
    }
    if(false==init){
      cityValue=districtValue='000000';
      this.setState({provinceValue:provinceValue,cityValue:cityValue,districtValue:districtValue});
    }
  }

  _renderProvinces(){
    const provincesContent = Provinces.map((province) => {
      const provinceItem = (
        <Picker.Item key={province.value} label={province.label} value={province.value} />
      );
      return provinceItem;
    });
    return provincesContent;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{padding:10}}>
          <View>
            <Text>信息类别：</Text>
            <Picker
              mode='dropdown'
              selectedValue={this.state.type}
              style={{ height: 40, marginLeft:10 }}
              onValueChange={(itemValue, itemIndex) => this.setState({type: itemValue})}>
              <Picker.Item label="出售" value="sell"/>
              <Picker.Item label="求购" value="buy"/>
            </Picker>
          </View>
          <View>
            <Text>选择区域：</Text>
            <Picker
              mode='dropdown'
              selectedValue={this.state.provinceValue}
              style={{ height: 40,marginLeft:10 }}
              onValueChange={(itemValue, itemIndex) => this._provinceSelect(itemValue)}>
              <Picker.Item key='000000' label='全国' value='000000' />
              {this._renderProvinces()}
            </Picker>
            <Picker
              mode='dropdown'
              selectedValue={this.state.cityValue}
              style={{ height: 40,marginLeft:10 }}
              onValueChange={(itemValue, itemIndex) => this._citySelect(itemValue)}>
              <Picker.Item key='000000' label='全部' value='000000' />
              {this._renderCitys()}
            </Picker>
            <Picker
            mode='dropdown'
            selectedValue={this.state.districtValue}
            style={{ height: 40, marginLeft:10 }}
            onValueChange={(itemValue, itemIndex) => this._districtSelect(itemValue)}>
            <Picker.Item key='000000' label='全部' value='000000' />
            {this._renderDistricts()}
            </Picker>
          </View>
        </View>
        <View style={{height: 1, backgroundColor:'#f0f0f0'}}/>
        <View>
          <View>
            <TextInput
              style={styles.edit}
              placeholder="标题"
              placeholderTextColor="#c4c4c4"
              underlineColorAndroid="transparent"
              onChangeText={(text) => {
                this.setState({title:text});
              }}
            />
          </View>
          <View>
            <TextInput
              style={styles.textInput}
              placeholder='商品信息详细介绍 (可选)'
              placeholderTextColor="#c4c4c4"
              underlineColorAndroid="transparent"
              multiline
              onChangeText={(text) => {
                detail = text;
              }}
            />
          </View>
          <View>
            <Button text='添加图片' onPress={() => this._selectImage()}></Button>
            <Image style={{width:100,height:100}} source={this.state.imageSource} />
          </View>
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
  edit:{
    fontSize: 20,
    backgroundColor: '#fff'
  },
  textInput: {
    fontSize: 20,
    backgroundColor: '#fff'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 10
  },
  login: {
    flex: 1,
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
  disclaimerContent: {
    flexDirection: 'column'
  },
  disclaimer: {
    fontSize: 18,
    textAlign: 'left'
  },
  bottomContainer: {
    alignItems: 'flex-start'
  }
});
BusinessPostPage.propTypes = propTypes;
export default BusinessPostPage;
