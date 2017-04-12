import React from 'react';
import {
	Linking,
	StyleSheet,
	Text,
	View,
} from 'react-native';

import Hyperlink from 'react-native-hyperlink';
import I18n from './I18nUtil';

export default class DownloadLink extends React.Component {
	constructor(props) {
		super(props);
		this.onUrlPress = this.onUrlPress.bind(this);
	}

	render() {
		return (
			<View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
				<Hyperlink linkText={I18n.get('Download')} linkStyle={styles[this.props.position].fileLinkStyle} onPress={url => Linking.openURL(url)}>
					<Text style={styles[this.props.position].fileLinkStyle}>
						{this.props.currentMessage.filePath}
					</Text>
				</Hyperlink>
			</View>
		);
	}
}

const styles = {
	left: StyleSheet.create({
		container: {
		},
		fileLinkStyle: {
			fontSize: 16,
			marginTop: 2,
			marginBottom: 3,
			marginLeft: 10,
			alignSelf: 'flex-start',
			textDecorationLine: 'underline',
		},
	}),
	right: StyleSheet.create({
		container: {
		},
		fileLinkStyle: {
			fontSize: 16,
			marginTop: 2,
			marginBottom: 3,
			marginRight: 10,
			alignSelf: 'flex-end',
			textDecorationLine: 'underline',
		},
	}),
};

DownloadLink.contextTypes = {
	actionSheet: React.PropTypes.func,
};

DownloadLink.defaultProps = {
	position: 'left',
	currentMessage: {
		filePath: null,
	},
	containerStyle: {},
};

DownloadLink.propTypes = {
	position: React.PropTypes.oneOf(['left', 'right']),
	currentMessage: React.PropTypes.object,
	containerStyle: React.PropTypes.shape({
		left: View.propTypes.style,
		right: View.propTypes.style,
	}),
};
