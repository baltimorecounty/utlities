let cachedConfig = {};

const urlPartsRegex = /(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*\..{2,5})/i;

const getSubDomain = (url) => {
	const urlParts = urlPartsRegex.exec(url);
	return urlParts && urlParts.length > 1 ? urlParts[1].toLowerCase() : null;
};

const getEnvironment = (hostname = '', subDomain = '') => {
	if (hostname.indexOf('localhost') > -1) {
		return 'local';
	} else if (subDomain === 'staging') {
		return subDomain;
	} else if (subDomain === 'dev') {
		return 'development';
	} else if (!subDomain || subDomain === 'www') {
		return 'production';
	}
	return 'local';
};

const hasConfig = () => Object.keys(cachedConfig).length > 0;

const GetValue = (key) => {
	if (!hasConfig()) {
		console.error(
			"It doesn't look like config has been specified, be sure to call SetConfig with your config values."
		);
		return;
	}

	const { href = '', hostname = '' } = window.location;
	const subDomain = getSubDomain(href);
	const environmentKey = getEnvironment(hostname, subDomain);
	const environmentConfig = cachedConfig.hasOwnProperty(environmentKey) ? cachedConfig[environmentKey] : null;

	if (!environmentConfig) {
		console.error(`Unable to retrieve value. The "${environmentKey}" config does not exist.`);
		return;
	}

	const environmentValue = environmentConfig[key];

	return environmentConfig && environmentValue
		? environmentValue
		: console.error(`Unable to retrieve value. The ${environmentKey} config does not contain the key "${key}".`);
};

const SetConfig = (config) => {
	cachedConfig = config;
};

export { GetValue, SetConfig, cachedConfig as Config };
