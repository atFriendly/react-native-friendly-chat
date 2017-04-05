import I18n from 'react-native-i18n';
const data = require('./data/i18n_data.js');
let locale = I18n.locale.toLowerCase();

export default class I18nUtil {
	static get(key) {
		try {
			const val = data[locale][key];
			if (val.indexOf('missing') >= 0)
				throw val;
			return val;
		}
		catch (e) {
			return key;
		}
	}

	/**
	 * set locale code
	 * @param {string} loc locale
	 */
	static setLocale(loc) {
		locale = loc;
	}
}