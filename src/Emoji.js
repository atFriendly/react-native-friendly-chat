import PropTypes from 'prop-types';
import React from 'react';
import {
	StyleSheet,
	View,
	ViewPropTypes,
} from 'react-native';
import Emoticons from 'react-native-emoticons';

export default class Emoji extends React.Component {
	constructor(props) {
		super(props);
	}

	// renderIcon() {
	// 	if (this.props.icon) {
	// 		return this.props.icon();
	// 	}
	// 	return (
	// 		<View
	// 			style={[styles.wrapper, this.props.wrapperStyle]}
	// 		>
	// 			<Text allowFontScaling={false}
	// 				style={[styles.iconText, this.props.iconTextStyle]}
	// 			>
	// 				+
    //     </Text>
	// 		</View>
	// 	);
	// }

	// render() {
	// 	return (
	// 		<TouchableOpacity
	// 			style={[styles.container, this.props.containerStyle]}
	// 			onPress={this.onPress}
	// 		>
	// 			{this.renderIcon()}

	// 		</TouchableOpacity>
	// 	);
	// }

	onEmoticonPress = () => {

	}

	onBackspacePress = () => {

	}

	render() {
		return (
			<View style={styles.container}>
			<Emoticons
				onEmoticonPress={this.onEmoticonPress.bind(this)}
				onBackspacePress={this.onBackspacePress.bind(this)}
				concise={this.props.concise}
				showHistoryBar={this.props.showHistoryBar}
			/>
			</View>
		);
	}
}

Emoji.defaultProps = {
	concise: false,
	showHistoryBar: false,
};

Emoji.propTypes = {
	concise: PropTypes.bool,
	showHistoryBar: PropTypes.bool,
};

const styles = StyleSheet.create({
	container: {
		width: 26,
		height: 26,
		marginLeft: 10,
		marginBottom: 10,
	},
});