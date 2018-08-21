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
import { ViewPropTypes,Text, View, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const propTypes = {
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    btnStyle: ViewPropTypes.style,
    imgStyle: Image.propTypes.style,
    textStyle: Text.propTypes.style,
    text: PropTypes.string,
    activeOpacity: PropTypes.number,
    image: PropTypes.number,
    icon: PropTypes.string,
    iconSize: PropTypes.number,
    iconColor: PropTypes.string
};
const ImageButton=({
    onPress,
    disabled,
    activeOpacity,
    image,
    icon,
    text, 
    btnStyle,
    imgStyle,
    textStyle,
    iconSize,
    iconColor  
})=>
{
    if (image) {
        return (
        <TouchableOpacity style={btnStyle} onPress={onPress} disabled={disabled} activeOpacity={activeOpacity}>
                    <Image source={image} style={imgStyle}/>
                    {text ?
                        <Text style={textStyle}>{text}</Text>
                        :
                        null
                    }
        </TouchableOpacity>
        );
    }
    else if(icon)
    {
        return (
            <TouchableOpacity style={btnStyle} onPress={onPress} disabled={disabled} activeOpacity={activeOpacity}>
            <Icon name={icon} size={iconSize} color={iconColor}/>
            {text ?
                <Text style={textStyle}>{text}</Text>
                :
                null
            }
            </TouchableOpacity>
        )
    }
};

ImageButton.propTypes = propTypes;
ImageButton.defaultProps = {
    onPress() {},
    disabled: false,
    activeOpacity: 0.8,
};
export default ImageButton;