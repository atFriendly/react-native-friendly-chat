import React from 'react';
import {
	StyleSheet,
	Text,
	View,
} from 'react-native';
import PropTypes from 'prop-types';
import ProgressBar from 'react-native-progress/Bar';

export default class MessageProgress extends React.Component {
	render() {
		let floatProgress = 0;
		if (this.props.currentMessage.progress) {
			if (Number(this.props.currentMessage.progress) >= 100)
				floatProgress = 1;
			else
				floatProgress = Number(this.props.currentMessage.progress) / 100;
		}
		return (
			<View style={[styles.container]}>
				<View style={{paddingBottom: 2}}>
					<Text allowFontScaling={false} style={styles.msgText}>
						{this.props.currentMessage.text}
					</Text>
				</View>
				<View style={[styles.row]}>
					<View>
						<ProgressBar progress={floatProgress} height={6}/>
					</View>
					<View>
						<Text allowFontScaling={false} style={styles.percentText}>
							{this.props.currentMessage.progress + "%"}
						</Text>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		marginTop: 10,
		marginBottom: 10,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	msgText: {
		fontSize: 14,
		color: '#0076ff',
	},
	percentText: {
		paddingLeft: 2,
		fontSize: 12,
		color: '#0076ff',
	}
});

MessageProgress.defaultProps = {
	currentMessage: {
		progress: null,//0-100
	},
};

MessageProgress.propTypes = {
	currentMessage: PropTypes.object,
};
