/* eslint react-native/no-inline-styles: 0 */

import PropTypes from 'prop-types';
import React from 'react';
import { View, ViewPropTypes, StyleSheet, TouchableWithoutFeedback, Text, TouchableOpacity, } from 'react-native';

import Avatar from './Avatar';
import Bubble from './Bubble';
import SystemMessage from './SystemMessage';
import Day from './Day';
import Tag from './Tag';

import { isSameUser, isSameDay } from './utils';

export default class Message extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      selected: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hasOwnProperty('forwardMessageMode')) {
      if (nextProps.forwardMessageMode === false) {
        this.setState({
          selected: false
        })
      } else {
        const firstSelect = nextProps.selectedMsgId === nextProps.currentMessage.realId
        if (firstSelect) {
          nextProps.onSelect(nextProps.currentMessage)
        }
        this.setState({
          selected: firstSelect
        })
      }
      
    }
  }

  getInnerComponentProps() {
    const { containerStyle, ...props } = this.props;
    return {
      ...props,
      isSameUser,
      isSameDay,
    };
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
    if (this.props.forwardMessageMode === true) {
      return null
    }
		//一對一聊天不顯示頭像
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

	renderTag() {
		if (this.props.currentMessage.isTag) {
			const tagProps = this.getInnerComponentProps();
			return <Tag {...tagProps} />;
		}
		return null;
  }
  
  renderForwardButton() {
    if (this.props.hasOwnProperty('forwardMessageMode') && this.props.forwardMessageMode === true) {
      if (this.state.selected === true ) {
        return (
          <TouchableOpacity accessibilityTraits="button"
            onPress={() => {
              this.setState({ selected: false })
              this.props.onUnSelect(this.props.currentMessage)
            }}
          >
            <View style={[checkboxStyles.checkboxBox, 
                        { marginLeft: this.props.position === 'left' ? 0 : 8 }]}>
              <View style={checkboxStyles.checkbox}>
                <Text style={checkboxStyles.checkboxText}>{'✓'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )
      } else {
        return (
          <TouchableOpacity accessibilityTraits="button"
            onPress={() => {
              this.setState({ selected: true })
              this.props.onSelect(this.props.currentMessage)
            }}
          >
            <View style={[checkboxStyles.checkboxBox, 
                        { marginLeft: this.props.position === 'left' ? 0 : 8 }]}>
              <View style={checkboxStyles.checkbox}>
              </View>
            </View>
          </TouchableOpacity>
        )
      }
    }
    return null;
  }

	render() {
		if (this.props.currentMessage.isTag) {
			return this.renderTag();
		}
		const sameUser = isSameUser(this.props.currentMessage, this.props.nextMessage);
		return (
			<TouchableWithoutFeedback {...this.props}>
				<View>
					{this.renderDay()}
					{this.props.currentMessage.system ? (
					  this.renderSystemMessage()
					) : (
					  <View 
					    style={[
						  styles[this.props.position].container, 
						  {	marginBottom: sameUser ? 2 : 10	}, 
						  !this.props.inverted && { marginBottom: 2 },
						  this.props.containerStyle[this.props.position],
						]}
					  >
            {this.renderForwardButton()}
						{this.props.position === 'left' ? this.renderAvatar() : null}
						{this.renderBubble()}
						{this.props.position === 'right' ? this.renderAvatar() : null}
					  </View>
					)}
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

const checkboxStyles = StyleSheet.create({
  checkboxBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  checkbox: {
    margin: 2,
    borderColor: '#666',
    borderWidth: 1,
    height: 23,
    width: 23,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkboxText: {
    color: '#337AB7',
    fontSize: 20,
    fontWeight: '900'
  },
})

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
	showUserAvatar: true,
  inverted: true,
  onSelect: () => {},
  onUnSelect: () => {}
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
	inverted: PropTypes.bool,
	containerStyle: PropTypes.shape({
		left: ViewPropTypes.style,
		right: ViewPropTypes.style,
  }),
  onSelect: PropTypes.func,
  onUnSelect: PropTypes.func
};
