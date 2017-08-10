import PropTypes from 'prop-types';
import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  ViewPropTypes,
} from 'react-native';
import Lightbox from 'react-native-lightbox';
import GiftedChatInteractionManager from './GiftedChatInteractionManager';

export default class MessageImage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			uri: this.props.currentMessage.image,
			switchToDefaultImg: false,
			retryTime: 0,
		}
	}

	onLoad() {
		// console.log('onLoad');
		// if (this.state.retryTime >= 3) {
		// 	this.setState({
		// 		uri: this.getFullSizeImageUri(),
		// 		retryTime: 0,
		// 		switchToDefaultImg: false,
		// 	});
		// }
	}

	onLoadError(e) {
		if (this.errTimer)
			clearTimeout(this.errTimer);
		// console.log('onError rt:', this.state.retryTime);
		if (this.state.retryTime >= 3) {
			// GiftedChatInteractionManager.runAfterInteractions(() => {
				this.errTimer = setTimeout(() => {
					this.setState({
						switchToDefaultImg: true
					});
				}, 100);
    		// });
		}
		else {
			// GiftedChatInteractionManager.runAfterInteractions(() => {
				this.errTimer = setTimeout(() => {
					const newRetryTime = this.state.retryTime + 1;
					this.setState({
						retryTime: newRetryTime,
						uri: this.getFullSizeImageUri() + '&retryTime=' + newRetryTime, 
					});
				}, 100);
    		// });
		}
	}

	onOpen() {
		// GiftedChatInteractionManager.runAfterInteractions(() => {
			setTimeout(() => {
				this.setState({
					uri: this.getFullSizeImageUri(),
					retryTime: 0,
					switchToDefaultImg: false,
				});
			}, 100);
		// });
	}

	onClose() {
		// GiftedChatInteractionManager.runAfterInteractions(() => {
			setTimeout(() => {
				this.setState({
					uri: this.getThumbImageUri(),
				});
			}, 100);
		// });
	}

	getThumbImageUri() {
		return this.props.currentMessage.image;
	}

	getFullSizeImageUri() {
		return this.props.currentMessage.image.replace('index=1', 'index=0');
	}

	renderImage() {
		// console.log('switchToDefaultImg:', this.state.switchToDefaultImg);
		if (this.state.switchToDefaultImg === true) {
			return (
				<Image
					{...this.props.imageProps}
					style={[styles.thumb, this.props.imageStyle]}
					source={require('./images/missing_image.png')}
				/>
			);	
		}
		return (
			<Image
				{...this.props.imageProps}
				style={[styles.image, this.props.imageStyle]}
				source={{uri: this.state.uri}}
				onLoad={() => { this.onLoad() }}
				onError={e => { this.onLoadError(e) }}
			/>
		);
	}

	render() {
		const { width, height } = Dimensions.get('window');

		return (
			<View style={[styles.container, this.props.containerStyle]}>
				<Lightbox
					activeProps={{
						style: [styles.imageActive, { width, height }],
					}}
					springConfig={{ tension: 40, friction: 7 }}
					{...this.props.lightboxProps}
					onClose={() => { this.onClose() }}
					onOpen={() => { this.onOpen() }}
				>
					{this.renderImage()}
				</Lightbox>
			</View>
		);
	}
}

const styles = StyleSheet.create({
  container: {
  },
  thumb: {
	width: 64,
    height: 64,
    borderRadius: 13,
    margin: 3,
    resizeMode: 'cover',  
  },
  image: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
    resizeMode: 'cover',
  },
  imageActive: {
    flex: 1,
    resizeMode: 'contain',
  },
});

MessageImage.defaultProps = {
  currentMessage: {
    image: null,
  },
  containerStyle: {},
  imageStyle: {},
};

MessageImage.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  imageStyle: Image.propTypes.style,
  imageProps: PropTypes.object,
  lightboxProps: PropTypes.object,
};
