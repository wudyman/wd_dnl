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
import { Platform, StyleSheet, View, ScrollView, Picker, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
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
let town='';
let pictures=['file:///storage/emulated/0/Pictures/images/image-c76b075f-0192-40c2-8f37-490f307b1419.jpg',
'file:///storage/emulated/0/Pictures/images/image-c76b075f-0192-40c2-8f37-490f307b1419.jpg',
'file:///storage/emulated/0/Pictures/images/image-c76b075f-0192-40c2-8f37-490f307b1419.jpg',
'file:///storage/emulated/0/Pictures/images/image-c76b075f-0192-40c2-8f37-490f307b1419.jpg',
'file:///storage/emulated/0/Pictures/images/image-c76b075f-0192-40c2-8f37-490f307b1419.jpg',
'file:///storage/emulated/0/Pictures/images/image-c76b075f-0192-40c2-8f37-490f307b1419.jpg',
'file:///storage/emulated/0/Pictures/images/image-c76b075f-0192-40c2-8f37-490f307b1419.jpg',
'file:///storage/emulated/0/Pictures/images/image-c76b075f-0192-40c2-8f37-490f307b1419.jpg'
];

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
        pictures:pictures,
        contact:'',
        initDone:false,
    }
  }

  _post(){
    console.log(this.state.type);
    console.log(this.state.provinceValue);
    console.log(this.state.title);
    console.log(this.state.detail);
    console.log(this.state.contact);
    console.log(this.state.pictures);
  }

  _checkPostInvalid(){
    if(
      ''!=this.state.type &&
      '000000'!=this.state.provinceValue &&
      ''!=this.state.title &&
      ''!=this.state.detail &&
      ''!=this.state.contact
    )
      return false;
    else
      return true;
  }

  _onFileUpload(){
    return true;
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
            pictures.push(file);
            this.setState({pictures: pictures});

            this._onFileUpload(file,response.fileName||'unkown.jpg');
          }
      })
 }

 _deletePicture(index){
   console.log('*************delete picture*********************'+index);
   console.log(pictures);
   pictures.splice(index,1);
   console.log(pictures);
   this.setState({pictures:pictures});
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

  _renderPicturesAdded(){
    const picturesView = this.state.pictures.map((picture,index) => {
      const pictureItem = (
        <View key={index} style={{flexDirection:'row',justifyContent:'flex-start',margin:2}}>
          <Image style={{width:80,height:80}} source={{uri:picture}} />
          <Icon style={{position:'absolute'}} name="md-close-circle" size={35}  onPress={() => this._deletePicture(index)}/>
        </View>
      );
      console.log(pictureItem);
      return pictureItem;
    });
    return picturesView;
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View>
            <Text>选择类别：</Text>
            <Picker
              mode='dropdown'
              selectedValue={this.state.type}
              style={styles.picker}
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
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => this._provinceSelect(itemValue)}>
              <Picker.Item key='000000' label='请选择省份（必选）' value='000000' />
              {this._renderProvinces()}
            </Picker>
            <Picker
              mode='dropdown'
              selectedValue={this.state.cityValue}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => this._citySelect(itemValue)}>
              <Picker.Item key='000000' label='请选择城市（全部）' value='000000' />
              {this._renderCitys()}
            </Picker>
            <Picker
            mode='dropdown'
            selectedValue={this.state.districtValue}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => this._districtSelect(itemValue)}>
            <Picker.Item key='000000' label='请选择区县（全部）' value='000000' />
            {this._renderDistricts()}
            </Picker>
            <View>
              {'000000'!=districtValue?
              <TextInput
                style={styles.town}
                maxLength={20}
                placeholder="乡镇或街道（可选填）"
                placeholderTextColor="#888"
                underlineColorAndroid="transparent"
                multiline
                onChangeText={(text) => {
                  town=text;
                }}
              />
              :
              <View/>
              }
            </View>
          </View>
          <View>
            <Text>联系方式：</Text>
            <TextInput
              style={styles.contact}
              maxLength={50}
              placeholder="名字，电话等（必填）"
              placeholderTextColor="#888"
              underlineColorAndroid="transparent"
              multiline
              onChangeText={(text) => {
                this.setState({contact:text});
              }}
            />
          </View>
          <View>
            <Text>信息内容：</Text>
            <TextInput
              style={styles.title}
              maxLength={50}
              placeholder="标题（必填）"
              placeholderTextColor="#888"
              underlineColorAndroid="transparent"
              multiline
              onChangeText={(text) => {
                this.setState({title:text});
              }}
            />
            <TextInput
              style={styles.detail}
              maxLength={500}
              placeholder='商品信息详细介绍 (必填)'
              placeholderTextColor="#888"
              underlineColorAndroid="transparent"
              multiline
              numberOfLines={5}
              onChangeText={(text) => {
                this.setState({detail:text});
              }}
            />
            <View style={styles.picture}>
              <TouchableOpacity style={styles.pictureSelect} onPress={() => this._selectImage()}>
                <Text>添加图片(不多于4张,可选填)</Text>
                <Icon name="md-images" size={25} color={'#555'} /> 
              </TouchableOpacity>
              <View style={styles.pictureAdded}>
                {this._renderPicturesAdded()}
              </View>
            </View>
            <View style={styles.post}>
              <Button text="发布" btnStyle={{padding:10,backgroundColor:this._checkPostInvalid()?'#ccc':'#228b22'}} textStyle={styles.postText} disabled={this._checkPostInvalid()} onPress={() => this._post()}></Button>
            </View>
          </View>
        </View>
      </ScrollView>
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
    margin:10,
  },
  picker: {
    height: 40, 
    marginLeft:10
  },
  town:{
    marginTop:10,
    marginBottom:10,
    marginLeft:15,
    marginRight:15, 
    fontSize: 15,
    backgroundColor: '#f0f0f0'
  },
  contact:{
    marginTop:10,
    marginBottom:10,
    marginLeft:15,
    marginRight:15,
    fontSize: 15,
    backgroundColor: '#f0f0f0'
  },
  title: {
    margin:10,
    fontSize: 16,
    backgroundColor: '#f0f0f0'
  },
  detail: {
    margin:10,
    fontSize: 15,
    backgroundColor: '#f0f0f0',
    textAlignVertical: 'top'
  },
  picture: {
    margin:10,
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:3,
    paddingRight:3,
    borderColor:'#f4f4f4',
    borderWidth:1
  },
  pictureSelect: {
    marginBottom:10,
    flexDirection: 'row',
    justifyContent:'space-between'
  },
  pictureAdded: {
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    flexWrap:'wrap'
  },
  post: {
    marginLeft:60,
    marginRight:60,
    marginTop:20,
    marginBottom:60,
  },
  postBtn: {
    padding:10,
    backgroundColor:'#228b22'
  },
  postText: {
    color:'white',
    textAlign:'center'
  }

});
BusinessPostPage.propTypes = propTypes;
export default BusinessPostPage;
