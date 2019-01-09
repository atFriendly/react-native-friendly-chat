/* eslint no-use-before-define: ["error", { "variables": false }] */

import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View, Keyboard, ViewPropTypes, TouchableOpacity } from 'react-native';

import Composer from './Composer';
import Send from './Send';
import Actions from './Actions';
import Color from './Color';
import Emoji from './Emoji';

export default class InputToolbar extends React.Component {

  constructor(props) {
    super(props);

    this.keyboardWillShow = this.keyboardWillShow.bind(this);
    this.keyboardWillHide = this.keyboardWillHide.bind(this);

    this.state = {
      position: 'absolute',
    };
  }

  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  keyboardWillShow() {
    if (this.state !== 'relative') {
      this.setState({
        position: 'relative',
      });
    }
  }

  keyboardWillHide() {
    if (this.state !== 'absolute') {
      this.setState({
        position: 'absolute',
      });
    }
  }

  renderActions() {
    if (this.props.renderActions) {
      return this.props.renderActions(this.props);
    } else if (this.props.onPressActionButton) {
      return <Actions {...this.props} />;
    }
    return null;
  }

  renderSend() {
    if (this.props.renderSend) {
      return this.props.renderSend(this.props);
    }
    return <Send {...this.props} />;
  }
  renderComposer() {
	if (this.props.renderComposer) {
	  return this.props.renderComposer(this.props);
	}
    return <Composer {...this.props} />;
  }

  // renderAccessory() {
  //   if (this.props.renderAccessory) {
  //     return (
  //       <View style={[styles.accessory, this.props.accessoryStyle]}>{this.props.renderAccessory(this.props)}</View>
  //     );
  //   }
  //   return null;
  // }

	renderEmoji() {
		return (
			<Emoji {...this.props} />
		);
	}

	render() {
		return (
			<View style={[styles.container, this.props.containerStyle, { position: this.state.position }]}>
				<View style={[styles.primary, this.props.primaryStyle]}>
					{this.renderActions()}
					{this.renderEmoji()}
					{this.renderComposer()}
					{this.renderSend()}
				</View>
				{/*this.renderAccessory()*/}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		borderTopWidth: StyleSheet.hairlineWidth,
		borderTopColor: Color.defaultColor,
		backgroundColor: Color.white,
		bottom: 0,
		left: 0,
		right: 0,
	},
	primary: {
		flexDirection: 'row',
		alignItems: 'flex-end',
	},
	accessory: {
		height: 44,
	},
	emojiIcon : {
		width: 26,
		height: 26,
		marginLeft: 10,
		marginBottom: 10,
	}
});

InputToolbar.defaultProps = {
  renderAccessory: null,
  renderActions: null,
  renderSend: null,
  renderComposer: null,
  containerStyle: {},
  primaryStyle: {},
  accessoryStyle: {},
  onPressActionButton: () => {},
  onPressEmojiIcon: () => {},
};

InputToolbar.propTypes = {
	renderAccessory: PropTypes.func,
	renderActions: PropTypes.func,
	renderSend: PropTypes.func,
	renderComposer: PropTypes.func,
	onPressActionButton: PropTypes.func,
	containerStyle: ViewPropTypes.style,
	primaryStyle: ViewPropTypes.style,
	accessoryStyle: ViewPropTypes.style,
	onPressEmojiIcon: PropTypes.func,
};