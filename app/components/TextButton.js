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
import { ViewPropTypes,Text, TouchableOpacity } from 'react-native';

const propTypes = {
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    btnStyle: ViewPropTypes.style,
    textStyle: Text.propTypes.style,
    text: PropTypes.string,
    activeOpacity: PropTypes.number
};

const TextButton = ({
    onPress,
    disabled,
    btnStyle,
    textStyle,
    text,
    activeOpacity
  }) => (
    <TouchableOpacity
      style={btnStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={activeOpacity}
    >
        <Text style={textStyle}>{text}</Text>
    </TouchableOpacity>
);

TextButton.propTypes = propTypes;

TextButton.defaultProps = {
  onPress() {},
  disabled: false,
  activeOpacity: 0.8,
};

export default TextButton;