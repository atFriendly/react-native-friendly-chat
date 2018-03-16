import PropTypes from 'prop-types';
import React from 'react';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	ViewPropTypes,
	Platform,
} from 'react-native';

export default class Emoji extends React.Component {
	render() {
		return (
			<View style={{paddingBottom:2}}>
				<TouchableOpacity style={styles.container} onPress={this.props.onPressEmojiIcon}>
					<Text allowFontScaling={false} style={{fontSize:Platform.select({ios:25, android:22})}}>
						{"\uD83D\uDE42"}
					</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

Emoji.defaultProps = {
	onPressEmojiIcon: () => {},
};

Emoji.propTypes = {
	onPressEmojiIcon: PropTypes.func,
};

const styles = StyleSheet.create({
	container: {
		width: 26,
		height: 26,
		marginLeft: 10,
		marginBottom: 10,
	},
});