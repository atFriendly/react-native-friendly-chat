import PropTypes from 'prop-types';
import React from 'react';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	ViewPropTypes,
	Modal,
} from 'react-native';
import Emoticons from 'react-native-emoticons';

export default class Emoji extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
		}
	}

	onEmoticonPress = () => {

	}

	onBackspacePress = () => {

	}

	onEmojiIconPress = () => {
		this.setState({
			visible: !this.state.visible
		});
	}

	render() {
		return (
			<View>
				<TouchableOpacity style={styles.container} onPress={this.onEmojiIconPress.bind(this)}>
					<Text>{String.fromCodePoint(128512)}</Text>
				</TouchableOpacity>
				<Modal
					animationType={"slide"}
					transparent={false}
					visible={this.state.visible}
				>
					<Emoticons
						onEmoticonPress={this.onEmoticonPress.bind(this)}
						onBackspacePress={this.onBackspacePress.bind(this)}
						concise={this.props.concise}
						showPlusBar={this.props.showPlusBar}
						showHistoryBar={this.props.showHistoryBar}
					/>
				</Modal>
			</View>
		);
	}
}

Emoji.defaultProps = {
	concise: true,
	showPlusBar: false,
	showHistoryBar: false,
};

Emoji.propTypes = {
	concise: PropTypes.bool,
	showPlusBar: PropTypes.bool,
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