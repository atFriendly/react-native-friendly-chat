/**
 * 多語言工具
 */
import I18n from 'react-native-i18n';

const data = require('./data/i18n_data.js');
const locale = I18n.locale;

I18n.fallbacks = true;
I18n.translations = data;

export default class I18nUtil {
	/**
	 * 取得相對應語系的多語言資料
	 */
	static get(key) {
		try {
			const val = I18n.t(key);
			if (val.indexOf('missing') >= 0)
				throw val;
			return val;
		}
		catch (e) {
			// console.log('找不到相關的多語言資料 key:[' + key + ']');
			return key;
		}
	}

	/**
	 * 取得當前語系
	 */
	static getLocale() {
		return locale;
	}

	/**
	 * 是繁中語系
	 */
	static isTw() {
		let result = false;
		['zh_TW', 'zh-TW'].map((x) => {
			if (x.toLowerCase() === locale.toLowerCase()) {
				result = true;
				return;
			}
		});
		return result;
	}

	/**
	 * 是簡中語系
	 */
	static isCn() {
		let result = false;
		['zh_CN', 'zh-CN'].map((x) => {
			if (x.toLowerCase() === locale.toLowerCase()) {
				result = true;
				return;
			}
		});
		return result;
		// en: ['en', 'en-US', 'en_US', 'en-GB', 'en_GB'],
	}
}