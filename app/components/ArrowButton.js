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
import { ViewPropTypes,Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const propTypes = {
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    btnStyle: ViewPropTypes.style,
    textStyle: Text.propTypes.style,
    tipsStyle: Text.propTypes.style,
    text: PropTypes.string,
    newNotice: PropTypes.string,
    tips: PropTypes.string,
    activeOpacity: PropTypes.number,
    icon: PropTypes.string,
    iconSize: PropTypes.number,
    iconColor: PropTypes.string
};

const ArrowButton=({
    onPress,
    disabled,
    activeOpacity,
    icon,
    text,
    newNotice,
    tips, 
    btnStyle,
    textStyle,
    tipsStyle,
    iconSize,
    iconColor  
})=>
{
    return (
        <TouchableOpacity style={{flexDirection: 'row',justifyContent: 'space-between',paddingTop:15, paddingBottom:15}}  onPress={onPress} disabled={disabled} activeOpacity={activeOpacity}>
            <View style={{flexDirection: 'row',alignItems: 'center'}}>
                {text ?
                    <Text style={textStyle}>{text}</Text>
                    :
                    null
                }
                {newNotice ?
                    <View style={{marginLeft:5,height:14,width:14,borderRadius:7,backgroundColor:'#eb413d'}}>
                        <Text style={{fontSize:10,color:'#ddd',textAlign: 'center'}}>{newNotice}</Text>
                    </View>
                    :
                    null
                }
            </View>
            <View style={{flexDirection: 'row',alignItems: 'center'}}>
                {tips ?
                    <Text style={tipsStyle}>{tips}</Text>
                    :
                    null
                }
                <Icon name={icon} size={iconSize} color={iconColor}/>
            </View>
        </TouchableOpacity>
    )
};
  
ArrowButton.propTypes = propTypes;
ArrowButton.defaultProps = {
    onPress() {},
    disabled: false,
    activeOpacity: 0.8,
};
export default ArrowButton;