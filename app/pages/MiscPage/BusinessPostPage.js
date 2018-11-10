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
//import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import store from 'react-native-simple-store';
import NavigationUtil from '../../utils/NavigationUtil';
import { SITE_URL, UPLOAD_IMG_URL, BUSINESS_POST_URL, UPDATE_BUSINESS_URL } from '../../constants/Urls';
import RequestUtil from '../../utils/RequestUtil';
import { formatUrlWithSiteUrl } from '../../utils/FormatUtil';
import ToastUtil from '../../utils/ToastUtil';


const propTypes = {
  signInUpActions: PropTypes.object,
  signinup: PropTypes.object.isRequired
};

let provinceValue2=cityValue2=districtValue2='000000';
let provincesMap2={};
let citysMap2={};
let districtsMap2={};
let citys2=districts2=[];
let pictures=[];
let pictureIndex=0;

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
        isRevise:false,
        id:0,  //for revise
        type:'sell',
        provinceValue2:provinceValue2,
        cityValue2:cityValue2,
        districtValue2:districtValue2,
        title:'',
        detail:'',
        pictures:pictures,
        contact:'',
        town:'',
        initDone:false,
    }
  }

  _postCallback(ret){
    if('fail'!=ret){
      pictures=[];
      pictureIndex=0;
      this.textInputTitle.clear();
      this.textInputDetail.clear();
      this.setState({title:'',detail:'',pictures:pictures});

      let itemData={};
      itemData.id=ret[0];
      itemData.title=ret[1];
      itemData.detail=ret[2];
      itemData.type=ret[3];
      itemData.addr=ret[4];
      itemData.addr_value=ret[5];
      itemData.contact=ret[6];
      itemData.pictures=ret[7];
      itemData.pub_date=ret[8];
      itemData.update_date=ret[9];
      itemData.poster_id=ret[10];
      itemData.poster_name=ret[11];

      itemData.url=SITE_URL+"/business/"+itemData.id+"/";
      itemData.pictures_array=[];
      if(""!=itemData.pictures)
      {
          let pictures=itemData.pictures;
          let array=pictures.split(";");
          for (let i in array)
          {
              let picture=array[i];
              if(picture)
              {
                itemData.pictures_array.push(formatUrlWithSiteUrl(picture));
              }
          }
      }
      else{
        itemData.pictures_array.push(formatUrlWithSiteUrl('/static/common/img/business_no_picture.jpg'));
      }

      const { navigate } = this.props.navigation;
      //navigate('Web', { itemData });
      navigate('BusinessInfo',{itemData});

    }
  }

  _post(){
    let addr_value=addr="";
    if("000000"==provinceValue2)
    {
        addr_value="000000";
        addr="";
    }
    else if("000000"==cityValue2)
    {
        addr_value=provinceValue2;
        addr=Provinces[provincesMap2[provinceValue2]].label;
    }
    else if("000000"==districtValue2)
    {
        addr_value=provinceValue2+cityValue2;
        addr=Provinces[provincesMap2[provinceValue2]].label+citys2[citysMap2[cityValue2]].label;
    }
    else
    {
        addr_value=provinceValue2+cityValue2+districtValue2;
        addr=Provinces[provincesMap2[provinceValue2]].label+citys2[citysMap2[cityValue2]].label+districts2[districtsMap2[districtValue2]].label;
        if(this.state.town)
            addr+=this.state.town;
    }

    let pictures_str='';
    pictures.map((picture)=>{
      if(picture.webUrl){
        pictures_str+=picture.webUrl+';';
      }
    });

    let formData=new FormData();
    formData.append("title",this.state.title);
    formData.append("detail",this.state.detail);
    formData.append("type",this.state.type);
    formData.append("addr",addr);
    formData.append("addr_value",addr_value);
    formData.append("contact",this.state.contact);
    formData.append("pictures",pictures_str);
    let url=BUSINESS_POST_URL;
    if(this.state.isRevise){
      formData.append("business_id",this.state.id);
      url=UPDATE_BUSINESS_URL+'all/';
    }
    RequestUtil.requestWithCallback(url,'POST',formData,this._postCallback.bind(this));
  }

  _checkPostInvalid(){
    if(
      ''!=this.state.type &&
      '000000'!=this.state.provinceValue2 &&
      ''!=this.state.title &&
      ''!=this.state.detail &&
      ''!=this.state.contact
    )
      return false;
    else
      return true;
  }

  _onFileUploadCallback(ret,callbackarg){
    let index=callbackarg;
    if('fail'!=ret){
      pictures.map((picture)=>{
        if(index==picture.index){
          picture.loading=false;
          picture.webUrl=ret;
        }
      });
      this.setState({pictures:pictures});
    }
  }

  _onFileUpload(file,index){
    let url=UPLOAD_IMG_URL;
    let fileData = {uri: file, type: 'multipart/form-data', name: 'image.jpg'};
    let formData=new FormData();
    formData.append("imgfile",fileData);
    RequestUtil.requestWithCallback(url,'POST',formData,this._onFileUploadCallback.bind(this),callbackarg=index);
    return true;
  }
/*
  _selectImageOld = () =>{
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
 */
 _selectImage = () =>{
  if(pictures.length>=8){
    ToastUtil.showShort("不能超过8张!");
    return;
  }
  ImagePicker.openPicker({  
    //width: 720,  
    //height: 720,
    compressImageMaxWidth: 480,
    compressImageMaxHeight: 480,
    //cropping: false,
    compressImageQuality: 0.5,
    mediaType: 'photo',
    //showCropGuidelines: false,
    //hideBottomControls: true,   
  }).then(images => {  
    let source,file;
    if (Platform.OS === 'android') {
      source = {uri: images.path};
      file = images.path; 
    }
    else{
      source = {uri: images.path.replace('file://', ''), isStatic: true}
      file = images.path.replace('file://', '');
    }
    let index=pictureIndex;
    pictureIndex+=1;
    this._onFileUpload(file,index);
    let picture={};
    picture.index=index;
    picture.uri=file;
    picture.loading=true;
    picture.webUrl='';

    pictures.push(picture);
    this.setState({pictures: pictures});
  }).catch(error=>{
    console.log(error);
  });  
 }

 _deletePicture(index){
   pictures.splice(index,1);
   this.setState({pictures:pictures});
 }

  componentWillMount() {
    console.log('***************BusinessPostPage componentWillMount**************');
    let isRevise=this.props.isRevise;
    if(isRevise){
      let businessInfoData=this.props.businessInfoData;
      let addr_value=businessInfoData.addr_value;
      provinceValue2=addr_value.substr(0,6);
      cityValue2=addr_value.substr(6,6);
      districtValue2=addr_value.substr(12,6);
      if(!provinceValue2)
        provinceValue2='000000';
      if(!cityValue2)
        cityValue2='000000';
      if(!districtValue2)
        districtValue2='000000';

      for (i in Provinces)
      {
          let province=Provinces[i];
          let value=province.value;     
          provincesMap2[value]=i;    
      } 
      this._provinceSelect(provinceValue2,true);
      this._citySelect(cityValue2,true);
      this._districtSelect(districtValue2,true);

      let town='';
      if(districtValue2!='000000'){
        let addr=businessInfoData.addr;
        let addr_temp=Provinces[provincesMap2[provinceValue2]].label+citys2[citysMap2[cityValue2]].label+districts2[districtsMap2[districtValue2]].label;
        if(addr_temp!=addr)
        {
          town=addr.substring(addr_temp.length,addr.length);
        }
      }

      pictures=[];
      let pictures_str=businessInfoData.pictures;
      if(pictures_str){
        let array=pictures_str.split(';');
        for (let i in array)
        {
            let picture_url=array[i];
            if(picture_url)
            {
                let picture={};
                picture.index=i;
                picture.uri=formatUrlWithSiteUrl(picture_url);
                picture.loading=false;
                picture.webUrl=picture_url;          
                pictures.push(picture);
                pictureIndex+=1;
            }
        }
      }

      this.setState({isRevise:true,id:businessInfoData.id,title:businessInfoData.title,detail:businessInfoData.detail,contact:businessInfoData.contact,
        type:businessInfoData.type,town:town,pictures:pictures,
        provinceValue2:provinceValue2,cityValue2:cityValue2,districtValue2:districtValue2,initDone:true});

    }
    else{
      store.get('addrValue').then((values)=>{
        if(null!=values){
          provinceValue2=values[0];
          cityValue2=values[1];
          districtValue2=values[2];
        }
        else{
          provinceValue2=cityValue2=districtValue2='000000';
        }
        for (i in Provinces)
        {
            let province=Provinces[i];
            let value=province.value;     
            provincesMap2[value]=i;    
        } 
        this._provinceSelect(provinceValue2,true);
        this._citySelect(cityValue2,true);
        this._districtSelect(districtValue2,true);
        this.setState({provinceValue2:provinceValue2,cityValue2:cityValue2,districtValue2:districtValue2,initDone:true});
      });
    }
  }  
  
  _districtSelect(value,init=false){
    districtValue2=value;
    if(false==init){
      this.setState({provinceValue2:provinceValue2,cityValue2:cityValue2,districtValue2:districtValue2,town:''});
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
    cityValue2=value;
    districts2=[];
    if('000000'==cityValue2){
      districts2=[];
    }
    else
    {
      districts2=citys2[citysMap2[cityValue2]].children;
      for (i in districts2)
      {
          let district=districts2[i];
          let value=district.value;
          districtsMap2[value]=i;
      }
    }
    if(false==init){
      districtValue2='000000';
      this.setState({provinceValue2:provinceValue2,cityValue2:cityValue2,districtValue2:districtValue2,town:''});
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
    provinceValue2=value;
    citys2=districts2=[];
    if('000000'==provinceValue2)
    {
      citys2=districts2=[];
    }
    else
    {
      citys2=Provinces[provincesMap2[provinceValue2]].children;
      for (i in citys2)
      {
          let city=citys2[i];
          let value=city.value;
          citysMap2[value]=i;
      }
    }
    if(false==init){
      cityValue2=districtValue2='000000';
      this.setState({provinceValue2:provinceValue2,cityValue2:cityValue2,districtValue2:districtValue2,town:''});
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
          <Image style={{width:80,height:80}} source={{uri:picture.uri}} />
          {picture.loading?
          <View style={{position:'absolute',width:80,height:80,backgroundColor:'black',opacity:0.5}}>
            <Text style={{color:'white'}}>上传中...</Text>
          </View>
          :
          <Icon style={{position:'absolute'}} name="md-close-circle" size={35}  onPress={() => this._deletePicture(index)}/>
          }
        </View>
      );
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
              selectedValue={this.state.provinceValue2}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => this._provinceSelect(itemValue)}>
              <Picker.Item key='000000' label='请选择省份（必选）' value='000000' />
              {this._renderProvinces()}
            </Picker>
            <Picker
              mode='dropdown'
              selectedValue={this.state.cityValue2}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => this._citySelect(itemValue)}>
              <Picker.Item key='000000' label='请选择城市（全部）' value='000000' />
              {this._renderCitys()}
            </Picker>
            <Picker
            mode='dropdown'
            selectedValue={this.state.districtValue2}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => this._districtSelect(itemValue)}>
            <Picker.Item key='000000' label='请选择区县（全部）' value='000000' />
            {this._renderDistricts()}
            </Picker>
            <View>
              {'000000'!=districtValue2?
              <TextInput
                style={styles.town}
                maxLength={20}
                placeholder="乡镇或街道（可选填）"
                placeholderTextColor="#888"
                underlineColorAndroid="transparent"
                multiline
                defaultValue={this.state.town}
                onChangeText={(text) => {
                  this.setState({town:text});
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
              defaultValue={this.state.contact}
              onChangeText={(text) => {
                this.setState({contact:text});
              }}
            />
          </View>
          <View>
            <Text>信息内容：</Text>
            <TextInput
              ref={(ref) => {
                this.textInputTitle = ref;
              }}
              style={styles.title}
              maxLength={50}
              placeholder="标题（必填）"
              placeholderTextColor="#888"
              underlineColorAndroid="transparent"
              multiline
              defaultValue={this.state.title}
              onChangeText={(text) => {
                this.setState({title:text});
              }}
            />
            <TextInput
              ref={(ref) => {
                this.textInputDetail = ref;
              }}
              style={styles.detail}
              maxLength={500}
              placeholder='商品信息详细介绍 (必填)'
              placeholderTextColor="#888"
              underlineColorAndroid="transparent"
              multiline
              numberOfLines={5}
              defaultValue={this.state.detail}
              onChangeText={(text) => {
                this.setState({detail:text});
              }}
            />
            <View style={styles.picture}>
              <TouchableOpacity style={styles.pictureSelect} onPress={() => this._selectImage()}>
                <Text>添加图片(不超过8张,可选填)</Text>
                <Icon name="md-images" size={25} color={'#555'} /> 
              </TouchableOpacity>
              <View style={styles.pictureAdded}>
                {this._renderPicturesAdded()}
              </View>
            </View>
            <View style={styles.post}>
              <Button text={this.state.isRevise?"修改信息":"发布信息"} btnStyle={{padding:10,backgroundColor:this._checkPostInvalid()?'#ccc':'#228b22'}} textStyle={styles.postText} disabled={this._checkPostInvalid()} onPress={() => this._post()}></Button>
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
