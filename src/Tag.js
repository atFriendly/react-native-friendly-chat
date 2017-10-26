import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

export default class Tag extends React.Component {

	renderTagTime() {
		if (!this.props.currentMessage.createdAt)
			return null;
		return (
			<Text style={[styles.text, this.props.textStyle]}>
				{moment(this.props.currentMessage.createdAt).locale(this.context.getLocale()).format('MM.DD HH:mm').toUpperCase()}
			</Text>
		);
	}

	render() {
		return (
			<View style={[styles.container, this.props.containerStyle]}>
				{this.renderTagTime()}
				<Text style={[styles.text, this.props.textStyle]}>
					{this.props.currentMessage.text}
				</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 5,
		marginBottom: 10,
	},
	wrapper: {
		// backgroundColor: '#ccc',
		// borderRadius: 10,
		// paddingLeft: 10,
		// paddingRight: 10,
		// paddingTop: 5,
		// paddingBottom: 5,
	},
	text: {
		backgroundColor: 'transparent',
		color: '#b2b2b2',
		fontSize: 12,
		fontWeight: '600',
	},
});

Tag.contextTypes = {
	getLocale: PropTypes.func,
};

Tag.defaultProps = {
	currentMessage: {
		// TODO test if crash when createdAt === null
		createdAt: null,
	},
	containerStyle: {},
	wrapperStyle: {},
	textStyle: {},
};

Tag.propTypes = {
	currentMessage: PropTypes.object,
	containerStyle: ViewPropTypes.style,
	wrapperStyle: ViewPropTypes.style,
	textStyle: Text.propTypes.style,
};
