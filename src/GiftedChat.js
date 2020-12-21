/* eslint
    no-param-reassign: 0,
    no-use-before-define: ["error", { "variables": false }],
    no-return-assign: 0,
    no-mixed-operators: 0,
    react/sort-comp: 0
*/

import PropTypes from 'prop-types';
import React from 'react';
import { Animated, Platform, StyleSheet, View, Text, Keyboard, TouchableWithoutFeedback } from 'react-native';

import ActionSheet from '@expo/react-native-action-sheet';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/zh-tw';
import uuid from 'uuid';

import * as utils from './utils';
import Actions from './Actions';
import Avatar from './Avatar';
import Bubble from './Bubble';
import SystemMessage from './SystemMessage';
import MessageImage from './MessageImage';
import MessageText from './MessageText';
import Composer from './Composer';
import Day from './Day';
import InputToolbar from './InputToolbar';
import LoadEarlier from './LoadEarlier';
import Message from './Message';
import MessageContainer from './MessageContainer';
import Send from './Send';
import Time from './Time';
import GiftedAvatar from './GiftedAvatar';
import I18nUtil from './I18nUtil';
import Emoticons, * as emoticons from 'react-native-friendly-emoticons';

import {
	MIN_COMPOSER_HEIGHT,
	MAX_COMPOSER_HEIGHT,
	DEFAULT_PLACEHOLDER,
	TIME_FORMAT,
	DATE_FORMAT,
} from './Constant';

class GiftedChat extends React.Component {
	constructor(props) {
		super(props);

		// default values
		this._isMounted = false;
		this._keyboardHeight = 0;
		this._bottomOffset = 0;
		this._maxHeight = null;
		this._isFirstLayout = true;
		this._locale = 'en';
		this._messages = [];
		this._typingDisabled = false;

		this.state = {
			isInitialized: false, // initialization will calculate maxHeight before rendering the chat
			composerHeight: MIN_COMPOSER_HEIGHT,
			messagesContainerHeight: null,
			// typingDisabled: false,
      emoticonsVisible: false,
      forwardMessageMode: false, //轉傳訊息模式
      selectedMsgId: null, //按下轉傳的訊息id
		};

		this.onKeyboardWillShow = this.onKeyboardWillShow.bind(this);
		this.onKeyboardWillHide = this.onKeyboardWillHide.bind(this);
		this.onKeyboardDidShow = this.onKeyboardDidShow.bind(this);
		this.onKeyboardDidHide = this.onKeyboardDidHide.bind(this);
		this.onSend = this.onSend.bind(this);
		this.getLocale = this.getLocale.bind(this);
		this.onInputSizeChanged = this.onInputSizeChanged.bind(this);
		this.onInputTextChanged = this.onInputTextChanged.bind(this);
		this.onMainViewLayout = this.onMainViewLayout.bind(this);
		this.onInitialLayoutViewLayout = this.onInitialLayoutViewLayout.bind(this);


		this.invertibleScrollViewProps = {
			inverted: this.props.inverted,
			keyboardShouldPersistTaps: this.props.keyboardShouldPersistTaps,
			onKeyboardWillShow: this.onKeyboardWillShow,
			onKeyboardWillHide: this.onKeyboardWillHide,
			onKeyboardDidShow: this.onKeyboardDidShow,
			onKeyboardDidHide: this.onKeyboardDidHide,
		};
	}

	static append(currentMessages = [], messages, inverted = true) {
		if (!Array.isArray(messages)) {
			messages = [messages];
		}
		return inverted ? messages.concat(currentMessages) : currentMessages.concat(messages);
	}

	static prepend(currentMessages = [], messages, inverted = true) {
		if (!Array.isArray(messages)) {
			messages = [messages];
		}
		return inverted ? currentMessages.concat(messages) : messages.concat(currentMessages);
	}

	getChildContext() {
		return {
			actionSheet: () => this._actionSheetRef,
			getLocale: this.getLocale,
		};
	}

	componentWillMount() {
		const { messages, text } = this.props;
		this.setIsMounted(true);
		this.initLocale();
		this.setMessages(messages || []);
		this.setTextFromProp(text);
	}

	componentWillUnmount() {
		this.setIsMounted(false);
	}

	componentWillReceiveProps(nextProps = {}) {
		const { messages, text } = nextProps;
		this.setMessages(messages || []);
		this.setTextFromProp(text);
	}

	initLocale() {
		let locale = 'en';
		if (this.props.locale === null && moment.locales().indexOf(this.props.locale) === -1) {
			locale = 'en';
		} else {
			locale = this.props.locale;
		}
		I18nUtil.setLocale(locale);
		this.setLocale(I18nUtil.getLocale());
	}

	setLocale(locale) {
		this._locale = locale;
	}

	getLocale() {
		return this._locale;
	}

	setTextFromProp(textProp) {
		// Text prop takes precedence over state.
		if (textProp !== undefined && textProp !== this.state.text) {
			this.setState({ text: textProp });
		}
	}

	getTextFromProp(fallback) {
		if (this.props.text === undefined) {
			return fallback;
		}
		return this.props.text;
	}

	setMessages(messages) {
		this._messages = messages;
	}

	getMessages() {
		return this._messages;
	}

	setMaxHeight(height) {
		this._maxHeight = height;
	}

	getMaxHeight() {
		return this._maxHeight;
	}

	setKeyboardHeight(height) {
		this._keyboardHeight = height;
	}

	getKeyboardHeight() {
		if (Platform.OS === 'android' && !this.props.forceGetKeyboardHeight) {
			// For android: on-screen keyboard resized main container and has own height.
			// @see https://developer.android.com/training/keyboard-input/visibility.html
			// So for calculate the messages container height ignore keyboard height.
			return 0;
		} else {
			return this._keyboardHeight;
		}
	}

	setBottomOffset(value) {
		this._bottomOffset = value;
	}

	getBottomOffset() {
		return this._bottomOffset;
	}

	setIsFirstLayout(value) {
		this._isFirstLayout = value;
	}

	getIsFirstLayout() {
		return this._isFirstLayout;
	}

	setIsTypingDisabled(value) {
		// requestAnimationFrame((time = 10) => {
		// 	this.setState({
		// 		typingDisabled: value
		// 	});
		// });
		this._typingDisabled = value;
	}

	getIsTypingDisabled() {
		// return this.state.typingDisabled;
		return this._typingDisabled;
	}

	setIsMounted(value) {
		this._isMounted = value;
	}

	getIsMounted() {
		return this._isMounted;
	}

	// TODO: setMinInputToolbarHeight
	getMinInputToolbarHeight() {
		return this.props.renderAccessory 
			? this.props.minInputToolbarHeight * 2 
			: this.props.minInputToolbarHeight;
	}

	calculateInputToolbarHeight(composerHeight) {
		return composerHeight + (this.getMinInputToolbarHeight() - MIN_COMPOSER_HEIGHT);
	}

	/**
	 * Returns the height, based on current window size, without taking the keyboard into account.
	 */
	getBasicMessagesContainerHeight(composerHeight = this.state.composerHeight) {
		return this.getMaxHeight() - this.calculateInputToolbarHeight(composerHeight);
	}

	/**
	 * Returns the height, based on current window size, taking the keyboard into account.
	 */
	getMessagesContainerHeightWithKeyboard(composerHeight = this.state.composerHeight) {
		return this.getBasicMessagesContainerHeight(composerHeight) - this.getKeyboardHeight() + this.getBottomOffset();
	}

	prepareMessagesContainerHeight(value) {
		if (this.props.isAnimated === true) {
			return new Animated.Value(value);
		}
		return value;
	}

	onKeyboardWillShow(e) {
		this.setIsTypingDisabled(true);
		this.setKeyboardHeight(e.endCoordinates ? e.endCoordinates.height : e.end.height);
		this.setBottomOffset(this.props.bottomOffset);
		const newMessagesContainerHeight = this.getMessagesContainerHeightWithKeyboard();
		if (this.props.isAnimated === true) {
			Animated.timing(this.state.messagesContainerHeight, {
				toValue: newMessagesContainerHeight,
				duration: 210,
			}).start();
		} else {
			requestAnimationFrame((time = 10) => {
				this.setState({
					messagesContainerHeight: newMessagesContainerHeight,
				});
			});
		}
	}

	onKeyboardWillHide() {
		this.setIsTypingDisabled(true);
		this.setKeyboardHeight(0);
		this.setBottomOffset(0);
		const newMessagesContainerHeight = this.getBasicMessagesContainerHeight();
		if (this.props.isAnimated === true) {
			Animated.timing(this.state.messagesContainerHeight, {
				toValue: newMessagesContainerHeight,
				duration: 210,
			}).start();
		} else {
			requestAnimationFrame((time = 10) => {
				this.setState({
					messagesContainerHeight: newMessagesContainerHeight,
				});
			});
		}
	}

	onKeyboardDidShow(e) {
		if (Platform.OS === 'android') {
			this.onKeyboardWillShow(e);
		}
		this.setIsTypingDisabled(false);
	}

	onKeyboardDidHide(e) {
		if (Platform.OS === 'android') {
			this.onKeyboardWillHide(e);
		}
		this.setIsTypingDisabled(false);
	}

	scrollToBottom(animated = true) {
		if (this._messageContainerRef === null) { 
			return 
		}
		this._messageContainerRef.scrollTo({ y: 0, animated });
	}

	renderMessages() {
    const AnimatedView = this.props.isAnimated === true ? Animated.View : View;
    const mcProps = {
      ...this.props,
      forwardMessageMode: this.state.forwardMessageMode,
      selectedMsgId: this.state.selectedMsgId
    }
		return (
			<AnimatedView style={{height: this.state.messagesContainerHeight,}}>
				<MessageContainer
					{ ...mcProps }
					onPress={this.onMessagePress.bind(this)}
					invertibleScrollViewProps={this.invertibleScrollViewProps}
					messages={this.getMessages()}
					ref={component => this._messageContainerRef = component}
				/>
				{this.renderChatFooter()}
			</AnimatedView>
		);
	}

	onSend(messages = [], shouldResetInputToolbar = false) {
		if (!Array.isArray(messages)) {
			messages = [messages];
		}

		messages = messages.map((message) => {
			return {
				...message,
				user: this.props.user,
				createdAt: new Date(),
				_id: this.props.messageIdGenerator(),
			};
		});

		if (shouldResetInputToolbar === true) {
			if (this.getIsMounted() === true) {
				this.setIsTypingDisabled(false);
				this.resetInputToolbar();
			}
		}
		
		this.props.onSend(messages);
		this.scrollToBottom();

		if (shouldResetInputToolbar === true) {
			setTimeout(() => {
				if (this.getIsMounted() === true) {
					this.setIsTypingDisabled(false);
				}
			}, 100);
		}
	}

	resetInputToolbar() {
		if (this.textInput) {
			this.textInput.clear();
		}
		this.notifyInputTextReset();
		const newComposerHeight = MIN_COMPOSER_HEIGHT;
		const newMessagesContainerHeight = this.getMessagesContainerHeightWithKeyboard(newComposerHeight);
		requestAnimationFrame(() => {
			this.setState({
				text: this.getTextFromProp(''),
				composerHeight: newComposerHeight,
				messagesContainerHeight: this.prepareMessagesContainerHeight(newMessagesContainerHeight),
				emoticonsVisible: false,
			});
		});
	}

	focusTextInput() {
		if (this.textInput) {
			this.textInput.focus();
		}
	}

	onInputSizeChanged(size) {
		const newComposerHeight = Math.max(MIN_COMPOSER_HEIGHT, Math.min(MAX_COMPOSER_HEIGHT, size.height));
		const newMessagesContainerHeight = this.getMessagesContainerHeightWithKeyboard(newComposerHeight);
		requestAnimationFrame((time = 10) => {
			this.setState({
				composerHeight: newComposerHeight,
				messagesContainerHeight: this.prepareMessagesContainerHeight(newMessagesContainerHeight),
			});
		});
	}

	onInputTextChanged(text) {
		if (this.getIsTypingDisabled()) {
			return;
		}
		if (this.props.onInputTextChanged) {
			this.props.onInputTextChanged(text);
		}
		// Only set state if it's not being overridden by a prop.
		if (this.props.text === undefined) {
			this.setState({ text });
		}
	}

	notifyInputTextReset() {
		if (this.props.onInputTextChanged) {
			this.props.onInputTextChanged('');
		}
	}

	onInitialLayoutViewLayout(e) {
		const layout = e.nativeEvent.layout;
		if (layout.height <= 0) {
			return;
		}
		this.notifyInputTextReset();
		this.setMaxHeight(layout.height);
		const newComposerHeight = MIN_COMPOSER_HEIGHT;
		const newMessagesContainerHeight = this.getMessagesContainerHeightWithKeyboard(newComposerHeight);
		requestAnimationFrame((time = 10) => {
			this.setState({
				isInitialized: true,
				text: this.getTextFromProp(''),
				composerHeight: newComposerHeight,
				messagesContainerHeight: this.prepareMessagesContainerHeight(newMessagesContainerHeight),
			});
		});
	}

	onMainViewLayout(e) {
		// fix an issue when keyboard is dismissing during the initialization
		const { layout } = e.nativeEvent;
		if (this.getMaxHeight() !== layout.height || this.getIsFirstLayout() === true) {
			this.setMaxHeight(layout.height);
			requestAnimationFrame((time = 10) => {
				this.setState({
					messagesContainerHeight: this.prepareMessagesContainerHeight(this.getBasicMessagesContainerHeight()),
				});
			});
		}
		if (this.getIsFirstLayout() === true) {
			this.setIsFirstLayout(false);
		}
	}

	renderInputToolbar() {
		const inputToolbarProps = {
			...this.props,
			text: this.getTextFromProp(this.state.text),
			composerHeight: Math.max(MIN_COMPOSER_HEIGHT, this.state.composerHeight),
			onSend: this.onSend,
			onInputSizeChanged: this.onInputSizeChanged,
			onTextChanged: this.onInputTextChanged,
			textInputProps: {
				...this.props.textInputProps,
				ref: (textInput) => (this.textInput = textInput),
				maxLength: this.getIsTypingDisabled() ? 0 : this.props.maxInputLength,
				onFocus: this.onTextInputFocus,
			},
			onPressEmojiIcon: this.onPressEmojiIcon,
		};
		if (this.props.renderInputToolbar) {
			return this.props.renderInputToolbar(inputToolbarProps);
		}
		return (
			<InputToolbar
				{...inputToolbarProps}
			/>
		);
	}

	renderChatFooter() {
		if (this.props.renderChatFooter) {
			const footerProps = {
				...this.props,
			};
			return this.props.renderChatFooter(footerProps);
		}
		return null;
	}

	renderLoading() {
		if (this.props.renderLoading) {
			return this.props.renderLoading();
		}
		return null;
	}

	onEmoticonPress = (data) => {
		// console.log('onEmoticonPress:', data);
		requestAnimationFrame((time = 10) => {
			this.setState({
				text: this.state.text + data.code
			});
		});
	}

	onBackspacePress = () => {
		if (this.state.text.length > 0) {
			let oldText = emoticons.splitter(this.state.text);
			oldText.pop();
			requestAnimationFrame((time = 10) => {
				this.setState({
					text: oldText.join('')
				});
			});
		}
	}

	onPressEmojiIcon = () => {
		Keyboard.dismiss();
		const visible = !this.state.emoticonsVisible;
		requestAnimationFrame((time = 10) => {
			this.setState({
				emoticonsVisible: visible,
			});
		});
	}

	onTextInputFocus = () => {
		this.hideEmoticons();
	}

	renderEmojiView() {
		return (
			<Emoticons
				onEmoticonPress={this.onEmoticonPress.bind(this)}
				onBackspacePress={this.onBackspacePress.bind(this)}
				concise={this.props.emojiConcise}
				showPlusBar={this.props.emojiShowPlusBar}
				showHistoryBar={this.props.emojiShowHistoryBar}
				show={this.state.emoticonsVisible}
				offsetBottom={45}
			/>
		);
	}

	onMessagePress = () => {
		this.hideEmoticons();
	}

	hideEmoticons = () => {
		if (this.state.emoticonsVisible === true) {
			requestAnimationFrame((time = 10) => {
				this.setState({
					emoticonsVisible:false
				});
			});
		}
  }
  
  setForwardMessageMode = (mode, selectedMsgId = null) => {
    this.setState({
      forwardMessageMode: mode,
      selectedMsgId: selectedMsgId
    })
  }

  renderForwardMessageBar = () => {
    if (this.state.forwardMessageMode === true) {
      return (
        <View style={styles.forwardMessageBar}>
          <View style={{flex:0.5}}>
            <TouchableWithoutFeedback 
              onPress={() => {
                this.props.onForwardMessages([])
                this.setForwardMessageMode(false)
              }}>
              <View style={styles.forwardCancelButton}>
                <Text allowFontScaling={false} style={[styles.forwardButtonText]}>
                  {I18nUtil.get('Cancel')}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={{flex:0.5}}>
            <TouchableWithoutFeedback 
              onPress={() => {
                this.props.onForwardMessages(this._messageContainerRef.getSelectedMsgs())
                this.setForwardMessageMode(false)
              }}
              accessibilityTraits="button">
              <View style={styles.forwardConfirmButton}>
                <Text allowFontScaling={false} style={[styles.forwardButtonText]}>
                  {I18nUtil.get('Confirm')}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      )
    } else {
      return null
    }
  }

	render() {
		if (this.state.isInitialized === true) {
			return (
				<ActionSheet ref={component => this._actionSheetRef = component}>
					<View style={styles.container} onLayout={this.onMainViewLayout}>
						{this.renderMessages()}
						{this.renderInputToolbar()}
						{this.renderEmojiView()}
            {this.renderForwardMessageBar()}
					</View>
				</ActionSheet>
			);
		}
		return (
			<View style={styles.container} onLayout={this.onInitialLayoutViewLayout}>
				{this.renderLoading()}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
  },
  forwardMessageBar: {
    flexDirection:'row',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  forwardConfirmButton: {
    flex: 0.5,
    height: 50,
    alignItems: 'center', 
    justifyContent:'center',
    backgroundColor: '#D9534F',
  },
  forwardCancelButton: {
    flex: 0.5,
    height: 50,
    alignItems: 'center', 
    justifyContent:'center',
    backgroundColor: '#AAA',
  },
  forwardButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 20,
  },
});

GiftedChat.childContextTypes = {
	actionSheet: PropTypes.func,
	getLocale: PropTypes.func,
};

GiftedChat.defaultProps = {
	messages: [],
	text: undefined,
	placeholder: DEFAULT_PLACEHOLDER,
	messageIdGenerator: () => uuid.v4(),
	user: {},
	onSend: () => { },
	onResend: () => {
	},
	locale: null,
	timeFormat: TIME_FORMAT,
	dateFormat: DATE_FORMAT,
	isAnimated: Platform.select({
		ios: true,
		android: false,
	}),
	loadEarlier: false,
	onLoadEarlier: () => { },
	isLoadingEarlier: false,
	renderLoading: null,
	renderLoadEarlier: null,
	renderAvatar: undefined,
	showUserAvatar: false,
	onPressAvatar: null,
	renderAvatarOnTop: false,
	renderBubble: null,
	renderSystemMessage: null,
	onLongPress: null,
	renderMessage: null,
	renderMessageText: null,
	renderMessageImage: null,
	imageProps: {},
	lightboxProps: {},
	textInputProps: {},
	listViewProps: {},
	renderCustomView: null,
	renderDocView: null,
	renderDay: null,
	renderTime: null,
	renderFooter: null,
	renderChatFooter: null,
	renderInputToolbar: null,
	renderComposer: null,
	renderActions: null,
	renderSend: null,
	renderAccessory: null,
	onPressActionButton: null,
	bottomOffset: 0,
	minInputToolbarHeight: 44,
	keyboardShouldPersistTaps: Platform.select({
		ios: 'never',
		android: 'always',
	}),
	onInputTextChanged: null,
	maxInputLength: null,
	forceGetKeyboardHeight: false,
	inverted: true,
	emojiConcise: false,
	emojiShowPlusBar: false,
  emojiShowHistoryBar: true,
  onForwardMessages: () => {}
};

GiftedChat.propTypes = {
	messages: PropTypes.arrayOf(PropTypes.object),
	text: PropTypes.string,
	placeholder: PropTypes.string,
	messageIdGenerator: PropTypes.func,
	user: PropTypes.object,
	onSend: PropTypes.func,
	onResend: PropTypes.func,
	locale: PropTypes.string,
	timeFormat: PropTypes.string,
	dateFormat: PropTypes.string,
	isAnimated: PropTypes.bool,
	loadEarlier: PropTypes.bool,
	onLoadEarlier: PropTypes.func,
	isLoadingEarlier: PropTypes.bool,
	renderLoading: PropTypes.func,
	renderLoadEarlier: PropTypes.func,
	renderAvatar: PropTypes.func,
	showUserAvatar: PropTypes.bool,
	onPressAvatar: PropTypes.func,
	renderAvatarOnTop: PropTypes.bool,
	renderBubble: PropTypes.func,
	renderSystemMessage: PropTypes.func,
	onLongPress: PropTypes.func,
	renderMessage: PropTypes.func,
	renderMessageText: PropTypes.func,
	renderMessageImage: PropTypes.func,
	imageProps: PropTypes.object,
	lightboxProps: PropTypes.object,
	renderCustomView: PropTypes.func,
	renderDocView: PropTypes.func,
	renderDay: PropTypes.func,
	renderTime: PropTypes.func,
	renderFooter: PropTypes.func,
	renderChatFooter: PropTypes.func,
	renderInputToolbar: PropTypes.func,
	renderComposer: PropTypes.func,
	renderActions: PropTypes.func,
	renderSend: PropTypes.func,
	renderAccessory: PropTypes.func,
	onPressActionButton: PropTypes.func,
	bottomOffset: PropTypes.number,
	minInputToolbarHeight: PropTypes.number,
	listViewProps: PropTypes.object,
	keyboardShouldPersistTaps: PropTypes.oneOf(['always', 'never', 'handled']),
	onInputTextChanged: PropTypes.func,
	maxInputLength: PropTypes.number,
	forceGetKeyboardHeight: PropTypes.bool,
	inverted: PropTypes.bool,
	textInputProps: PropTypes.object,
	emojiConcise: PropTypes.bool,
	emojiShowPlusBar: PropTypes.bool,
  emojiShowHistoryBar: PropTypes.bool,
  onForwardMessages: PropTypes.func
};

export {
	GiftedChat,
	Actions,
	Avatar,
	Bubble,
	SystemMessage,
	MessageImage,
	MessageText,
	Composer,
	Day,
	InputToolbar,
	LoadEarlier,
	Message,
	MessageContainer,
	Send,
	Time,
	GiftedAvatar,
	utils
};