/* eslint no-use-before-define: ["error", { "variables": false }] */

import PropTypes from 'prop-types';
import React from 'react';
import {
	Text,
	Image,
	Platform,
	Clipboard,
	StyleSheet,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
	ViewPropTypes,
} from 'react-native';

import MessageText from './MessageText';
import MessageImage from './MessageImage';
import MessageProgress from './MessageProgress';
import DownloadLink from './DownloadLink';
import Time from './Time';
import I18n from './I18nUtil';
import Color from './Color';

import { isSameUser, isSameDay } from './utils';

export default class Bubble extends React.PureComponent {

  constructor(props) {
	super(props);
	this.onPress = this.onPress.bind(this);
    this.onLongPress = this.onLongPress.bind(this);
  }

  	onPress() {
		if (this.props.onPress) {
			this.props.onPress(this.context, this.props.currentMessage);
		}
	}

  onLongPress() {
    if (this.props.onLongPress) {
      this.props.onLongPress(this.context, this.props.currentMessage);
    } else if (this.props.currentMessage.text) {
      const options = ['Copy Text', 'Cancel'];
      const cancelButtonIndex = options.length - 1;
      this.context.actionSheet().showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              Clipboard.setString(this.props.currentMessage.text);
              break;
            default:
              break;
          }
        },
      );
    }
  }

  handleBubbleToNext() {
    if (
      isSameUser(this.props.currentMessage, this.props.nextMessage) &&
      isSameDay(this.props.currentMessage, this.props.nextMessage)
    ) {
      return StyleSheet.flatten([
        styles[this.props.position].containerToNext,
        this.props.containerToNextStyle[this.props.position],
      ]);
    }
    return null;
  }

  handleBubbleToPrevious() {
    if (
      isSameUser(this.props.currentMessage, this.props.previousMessage) &&
      isSameDay(this.props.currentMessage, this.props.previousMessage)
    ) {
      return StyleSheet.flatten([
        styles[this.props.position].containerToPrevious,
        this.props.containerToPreviousStyle[this.props.position],
      ]);
    }
    return null;
  }

  renderMessageText() {
	//圖片訊息不顯示文字(檔名)
	if (this.props.currentMessage.image || this.props.currentMessage.progress)
	  return null;
    if (this.props.currentMessage.text) {
      const { containerStyle, wrapperStyle, ...messageTextProps } = this.props;
      if (this.props.renderMessageText) {
        return this.props.renderMessageText(messageTextProps);
      }
      return <MessageText {...messageTextProps} />;
    }
    return null;
  }

  renderMessageImage() {
		if (this.props.currentMessage.progress)
			return null;
		if (this.props.currentMessage.image) {
			const { containerStyle, wrapperStyle, ...messageImageProps } = this.props;
			if (this.props.renderMessageImage) {
				return this.props.renderMessageImage(messageImageProps);
			}
			return <MessageImage {...messageImageProps} />;
		}
		return null;
	}

	renderDocView() {
		if (this.props.renderDocView) {
			return (
				<View style={{ paddingTop: 2, paddingRight: 5 }}>
					{this.props.renderDocView(this.props)}
				</View>
			);
		}
		return null;
	}

	renderDownloadLink() {
		if (this.props.currentMessage.filePath) {
			const { containerStyle, wrapperStyle, ...messageProps } = this.props;
			return (
				<View style={{ paddingLeft: 10 }}>
					<DownloadLink {...messageProps} />
				</View>
			);
			// return <DownloadLink {...messageProps} />;
		}
		return null;
	}

	renderMessageProgress() {
		if (this.props.currentMessage.progress) {
			const { containerStyle, wrapperStyle, ...messageProgressProps } = this.props;
			return <MessageProgress {...messageProgressProps} />;
		}
		return null;
	}

  renderTicks() {
    const { currentMessage } = this.props;
    if (this.props.renderTicks) {
      return this.props.renderTicks(currentMessage);
    }
    if (currentMessage.user._id !== this.props.user._id) {
      return null;
    }
    if (currentMessage.sent || currentMessage.received) {
		let readCount = '';
		if (currentMessage.countMessageReadStatus && currentMessage.countMessageReadStatus > 0)
			readCount = currentMessage.countMessageReadStatus;
		return (
			<View style={styles.tickView}>
				{currentMessage.sent && <Text style={[styles.tick, this.props.tickStyle]}>✓</Text>}
				{currentMessage.received && <Text style={[styles.tick, this.props.tickStyle]}>{I18n.get('Received') + readCount}</Text>}
			</View>
		)
    }
    return null;
  }

  renderTime() {
    if (this.props.currentMessage.createdAt) {
      const { containerStyle, wrapperStyle, ...timeProps } = this.props;
      if (this.props.renderTime) {
        return this.props.renderTime(timeProps);
      }
      return <Time {...timeProps} />;
    }
    return null;
  }

  renderResend() {
		if (!this.props.currentMessage.notSent || this.props.position === 'left')
			return null;
		const icon = Platform.select({
			ios: require('./images/refresh-ios10.png'),
			android: require('./images/refresh-android.png')
		});
		return (
			<TouchableOpacity accessibilityTraits="button"
				onPress={() => {
					this.props.onResend({ ...this.props.currentMessage })
				}}>
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginRight: 2, }}>
					<Image style={{ width: 18, height: 18 }} source={icon} />
					<Text style={{ fontSize: 9, color: '#444' }}>
						{'重新傳送'}
					</Text>
				</View>
			</TouchableOpacity>
		);
  }
  
  renderCustomView() {
		if (this.props.renderCustomView) {
			return this.props.renderCustomView(this.props);
		}
		return null;
  }
  
	render() {
		let uploadStyle = {};
		if (this.props.currentMessage.progress) {
			uploadStyle = { borderWidth: 0, backgroundColor: 'transparent' };
		}
		return (
			<View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
				{this.renderResend()}
				<View style={[styles[this.props.position].wrapper, this.props.wrapperStyle[this.props.position], this.handleBubbleToNext(), this.handleBubbleToPrevious(), uploadStyle]}>
					<TouchableOpacity
						onPress={this.onPress}
						onLongPress={this.onLongPress}
						accessibilityTraits="text"
						{...this.props.touchableProps}
					>
						<View>
							{this.renderCustomView()}
							{this.renderMessageImage()}
							{this.renderMessageText()}
							<View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 5 }}>
								{this.renderDocView()}
								{this.renderDownloadLink()}
							</View>
							{this.renderMessageProgress()}
							<View style={[styles.bottom, this.props.bottomContainerStyle[this.props.position]]}>
								{this.renderTicks()}
								{this.renderTime()}
							</View>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

const styles = {
	left: StyleSheet.create({
		container: {
			flex: 1,
			flexDirection: 'row',
			alignItems: 'flex-start',
		},
		wrapper: {
			borderRadius: 15,
			backgroundColor: Color.leftBubbleBackground,
			marginRight: 60,
			minHeight: 20,
			justifyContent: 'flex-end',
		},
		containerToNext: {
			borderBottomLeftRadius: 3,
		},
		containerToPrevious: {
			borderTopLeftRadius: 3,
		},
	}),
	right: StyleSheet.create({
		container: {
			flex: 1,
			flexDirection: 'row',
			alignItems: 'flex-end',
			justifyContent: 'flex-end',
		},
		wrapper: {
			borderRadius: 15,
			backgroundColor: Color.defaultBlue,
			marginLeft: 60,
			minHeight: 20,
			justifyContent: 'flex-end',
		},
		containerToNext: {
			borderBottomRightRadius: 3,
		},
		containerToPrevious: {
			borderTopRightRadius: 3,
		},
	}),
	bottom: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	tick: {
		fontSize: 10,
		backgroundColor: Color.backgroundTransparent,
		color: Color.white,
	},
	tickView: {
		flexDirection: 'row',
		marginRight: 2,
		marginLeft: 6,
	}
};

Bubble.contextTypes = {
	actionSheet: PropTypes.func,
};

Bubble.defaultProps = {
	touchableProps: {},
	onLongPress: null,
	renderMessageImage: null,
	renderMessageText: null,
	renderCustomView: null,
	renderTicks: null,
	renderTime: null,
	position: 'left',
	currentMessage: {
		text: null,
		createdAt: null,
		image: null,
		progress: null,
	},
	nextMessage: {},
	previousMessage: {},
	containerStyle: {},
	wrapperStyle: {},
	bottomContainerStyle: {},
	tickStyle: {},
	containerToNextStyle: {},
	containerToPreviousStyle: {}
};

Bubble.propTypes = {
	user: PropTypes.object.isRequired,
	touchableProps: PropTypes.object,
	onLongPress: PropTypes.func,
	renderMessageImage: PropTypes.func,
	renderMessageText: PropTypes.func,
	renderCustomView: PropTypes.func,
	renderTime: PropTypes.func,
	renderTicks: PropTypes.func,
	position: PropTypes.oneOf(['left', 'right']),
	currentMessage: PropTypes.object,
	nextMessage: PropTypes.object,
	previousMessage: PropTypes.object,
	containerStyle: PropTypes.shape({
		left: ViewPropTypes.style,
		right: ViewPropTypes.style,
	}),
	wrapperStyle: PropTypes.shape({
		left: ViewPropTypes.style,
		right: ViewPropTypes.style,
	}),
	bottomContainerStyle: PropTypes.shape({
		left: ViewPropTypes.style,
		right: ViewPropTypes.style,
	}),
	tickStyle: Text.propTypes.style,
	containerToNextStyle: PropTypes.shape({
		left: ViewPropTypes.style,
		right: ViewPropTypes.style,
	}),
	containerToPreviousStyle: PropTypes.shape({
		left: ViewPropTypes.style,
		right: ViewPropTypes.style,
	}),
};