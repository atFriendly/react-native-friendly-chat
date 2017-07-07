import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import I18n from './I18nUtil';

export default class Send extends React.Component {
  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.props.text.trim().length === 0 && nextProps.text.trim().length > 0 || this.props.text.trim().length > 0 && nextProps.text.trim().length === 0) {
  //     return true;
  //   }
  //   return false;
  // }
  render() {
    // if (this.props.text.trim().length > 0) {
      return (
        <TouchableWithoutFeedback
          style={[styles.container, this.props.containerStyle]}
          onPress={() => {
			if (this.props.text.trim().length > 0) {
				requestAnimationFrame(() => {
					setTimeout(() => {
						this.props.onSend({text: this.props.text.trim()}, true);
					}, 0);
				});
			}
          }}
          accessibilityTraits="button"
        >
			<View>
				<Text allowFontScaling={false} style={[styles.text, this.props.textStyle]}>
		  			{I18n.get('Send')}
				</Text>
			</View>
        </TouchableWithoutFeedback>
      );
    // }
    // return <View/>;
  }
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    justifyContent: 'flex-end',
  },
  text: {
    color: '#0084ff',
    fontWeight: '600',
    fontSize: 17,
    backgroundColor: 'transparent',
    marginBottom: 12,
    marginLeft: 10,
    marginRight: 10,
	// paddingTop: 10,
	// paddingBottom: 10,
	// paddingLeft: 8,
	// paddingRight: 8,
	// marginBottom: 2,
    // marginLeft: 2,
    // marginRight: 2,
  },
});

Send.defaultProps = {
  text: '',
  onSend: () => {},
  label: 'Send',
  containerStyle: {},
  textStyle: {},
};

Send.propTypes = {
  text: React.PropTypes.string,
  onSend: React.PropTypes.func,
  label: React.PropTypes.string,
  containerStyle: View.propTypes.style,
  textStyle: Text.propTypes.style,
};
