import PropTypes from 'prop-types';
import React from 'react';
import {
	View,
	ViewPropTypes,
	StyleSheet,
	TouchableWithoutFeedback
} from 'react-native';

import Avatar from './Avatar';
import Bubble from './Bubble';
import SystemMessage from './SystemMessage';
import Day from './Day';
import Tag from './Tag';

import { isSameUser, isSameDay } from './utils';

export default class Message extends React.Component {

	getInnerComponentProps() {
		const { containerStyle, ...props } = this.props;
		return {
			...props,
			isSameUser,
			isSameDay
		}

	}

	renderTag() {
		if (this.props.currentMessage.isTag) {
			const tagProps = this.getInnerComponentProps();
			return <Tag {...tagProps} />;
		}
		return null;
	}

	renderDay() {
		if (this.props.currentMessage.createdAt) {
			const dayProps = this.getInnerComponentProps();
			if (this.props.renderDay) {
				return this.props.renderDay(dayProps);
			}
			return <Day {...dayProps} />;
		}
		return null;
	}

	renderBubble() {
		const bubbleProps = this.getInnerComponentProps();
		if (this.props.renderBubble) {
			return this.props.renderBubble(bubbleProps);
		}
		return <Bubble {...bubbleProps} />;
	}

	renderSystemMessage() {
		const systemMessageProps = this.getInnerComponentProps();
		if (this.props.renderSystemMessage) {
			return this.props.renderSystemMessage(systemMessageProps);
		}
		return <SystemMessage {...systemMessageProps} />;
	}

	renderAvatar() {
		//dont show avatar at single chat
		if (!this.props.currentMessage.groupMessage)
			return null;
		if (this.props.user._id === this.props.currentMessage.user._id && !this.props.showUserAvatar) {
			return null;
		}
		const avatarProps = this.getInnerComponentProps();
		const { currentMessage } = avatarProps;
		if (currentMessage.user.avatar === null) {
			return null;
		}
		return <Avatar {...avatarProps} />;
	}

	render() {
		if (this.props.currentMessage.isTag) {
			return this.renderTag();
		}
		return (
			<TouchableWithoutFeedback {...this.props}>
				<View>
					{this.renderDay()}
					<View style={[styles[this.props.position].container, {
						marginBottom: isSameUser(this.props.currentMessage, this.props.nextMessage) ? 2 : 10,
					}, this.props.containerStyle[this.props.position]]}>
						{this.props.position === 'left' ? this.renderAvatar() : null}
						{this.renderBubble()}
						{this.props.position === 'right' ? this.renderAvatar() : null}
					</View>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

const styles = {
	left: StyleSheet.create({
		container: {
			flexDirection: 'row',
			alignItems: 'flex-end',
			justifyContent: 'flex-start',
			marginLeft: 8,
			marginRight: 0,
		},
	}),
	right: StyleSheet.create({
		container: {
			flexDirection: 'row',
			alignItems: 'flex-end',
			justifyContent: 'flex-end',
			marginLeft: 0,
			marginRight: 8,
		},
	}),
};

Message.defaultProps = {
	renderAvatar: undefined,
	renderBubble: null,
	renderDay: null,
	renderSystemMessage: null,
	position: 'left',
	currentMessage: {},
	nextMessage: {},
	previousMessage: {},
	user: {},
	containerStyle: {},
};

Message.propTypes = {
	renderAvatar: PropTypes.func,
	showUserAvatar: PropTypes.bool,
	renderBubble: PropTypes.func,
	renderDay: PropTypes.func,
	renderSystemMessage: PropTypes.func,
	position: PropTypes.oneOf(['left', 'right']),
	currentMessage: PropTypes.object,
	nextMessage: PropTypes.object,
	previousMessage: PropTypes.object,
	user: PropTypes.object,
	containerStyle: PropTypes.shape({
		left: ViewPropTypes.style,
		right: ViewPropTypes.style,
	}),
};
