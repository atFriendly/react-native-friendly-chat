import React from 'react';
import {
	StyleSheet,
	Text,
	View,
} from 'react-native';
import ProgressBar from 'react-native-progress/Bar';

export default class MessageProgress extends React.Component {
	render() {
		return (
			<View style={[styles.container]}>
				<ProgressBar progress={Number(this.props.currentMessage.progress)} />
				<Text style={styles.percentText} >
					{this.props.currentMessage.progress + "%"}
				</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
	},
	percentText: {
		paddingLeft: 2,
		fontSize: 10,
		color: 'blue',
	}
});

MessageProgress.defaultProps = {
	currentMessage: {
		progress: null,
	},
};

MessageProgress.propTypes = {
	currentMessage: React.PropTypes.object,
};
