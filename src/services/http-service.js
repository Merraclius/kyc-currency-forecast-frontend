import axios from 'axios';

// ToDo: Add error handlers for validation errors and for general errors. Show modal dialog with error message
const HttpService = {
	fetchCurrencies: () => {
		return axios.get('currencies')
			.then(response => response.data);
	},
	calculateForecastRates: (baseCurrency, targetCurrency, maxWeekInterval, includePast) => {
		return axios.post('calculate-forecast', {
			baseCurrency: baseCurrency,
			targetCurrency: targetCurrency,
			maxWeekInterval: maxWeekInterval,
			includePast: includePast
		})
			.then(response => response.data);
	}
};

export default HttpService;
