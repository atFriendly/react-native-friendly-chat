import PropTypes from 'prop-types';
import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  ViewPropTypes,
  Dimensions,
  TouchableWithoutFeedback,
  Modal,
  Text
} from 'react-native';
import Lightbox from 'react-native-lightbox';
import PhotoView from 'react-native-photo-view';
import GiftedChatInteractionManager from './GiftedChatInteractionManager';
import I18n from './I18nUtil';

export default class MessageImage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			uri: this.props.currentMessage.image,
			switchToDefaultImg: false,
			retryTime: 0,
			openModal: false,
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
					openModal: true,
				});
			}, 100);
		// });
	}

	onClose() {
		// GiftedChatInteractionManager.runAfterInteractions(() => {
			setTimeout(() => {
				this.setState({
					uri: this.getThumbImageUri(),
					openModal: false,
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
		const noImg = this.state.switchToDefaultImg;
		return (
			<View style={[styles.container, this.props.containerStyle]}>
				{/* <Lightbox
					activeProps={{
						style: [styles.imageActive, { width, height }],
					}}
					springConfig={{ tension: 40, friction: 7 }}
					{...this.props.lightboxProps}
					onClose={() => { this.onClose() }}
					onOpen={() => { this.onOpen() }}
				>
					{this.renderImage()}
				</Lightbox> */}
				<TouchableWithoutFeedback onPress={() => {this.onOpen()}}>
					{this.renderImage()}
				</TouchableWithoutFeedback>
				<Modal visible={this.state.openModal} transparent={true} animationType='none'>
					<View style={[styles.glass, {width, height,}]}>
						<PhotoView 
							source={noImg === true ? require('./images/missing_image.png') : {uri: this.state.uri}}
							minimumZoomScale={0.5}
							maximumZoomScale={4}
							androidScaleType="center"
							onViewTap={() => {this.onClose()}}
							style={{width, height}}/>
						<View style={{position:'absolute', backgroundColor:'transparent', right:20, top:20}}>
							<TouchableWithoutFeedback onPress={() => {this.onClose()}}>
								<View style={styles.closeButton}>
									<Text style={{fontSize:16, color:'#CCC'}}>
										{I18n.get('Close')}
									</Text>
								</View>
							</TouchableWithoutFeedback>
						</View>
					</View>
				</Modal>
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
  closeButton: {
	padding: 5, 
	borderStyle: 'solid', 
	borderWidth: StyleSheet.hairlineWidth, 
	borderColor: '#CCC',
	borderRadius: 6,
  },
  glass: {
	flex: 1, 
	alignItems: 'center', 
	justifyContent: 'center', 
	backgroundColor: '#000', 
	opacity: 0.9,
  }
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
