import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import Lightbox from 'react-native-lightbox';

export default class MessageImage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			retryTime: 0,
			retryTime2: 0,
			uri: this.props.currentMessage.image,
		}
	}

	onLoadError(e) {
		const newRetryTime = this.state.retryTime + 1;
		const newRetryTime2 = this.state.retryTime2 + 1;
		if (this.state.retryTime >= 3) {
			if (this.state.retryTime2 > 3)
				return;
			this.setState({
				uri: this.getFullSizeImageUri(),
				retryTime: newRetryTime,
				retryTime2: newRetryTime2,
			});
		}
		else {
			this.setState({
				retryTime: newRetryTime,
			});
		}
	}

	getFullSizeImageUri() {
		return this.props.currentMessage.image.replace('index=1', 'index=0');
	}

  render() {
    const { width, height } = Dimensions.get('window');
	const fullSizeImgUri = this.getFullSizeImageUri();

    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <Lightbox
          activeProps={{
            style: [styles.imageActive, { width, height }],
          }}
		  springConfig={{tension: 40, friction: 7}}
          {...this.props.lightboxProps}
		  onOpen={()=>{ this.setState({uri: fullSizeImgUri})}}
        >
          <Image
            {...this.props.imageProps}
            style={[styles.image, this.props.imageStyle]}
            source={{uri: this.state.uri}}
			onError={e => { this.onLoadError(e) }}
          />
        </Lightbox>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
  image: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
    resizeMode: 'cover',
  },
  imageActive: {
    resizeMode: 'contain',
  },
});

MessageImage.defaultProps = {
  currentMessage: {
    image: null,
  },
  containerStyle: {},
  imageStyle: {},
  imageProps: {},
  lightboxProps: {},
};

MessageImage.propTypes = {
  currentMessage: React.PropTypes.object,
  containerStyle: View.propTypes.style,
  imageStyle: Image.propTypes.style,
  imageProps: React.PropTypes.object,
  lightboxProps: React.PropTypes.object,
};
