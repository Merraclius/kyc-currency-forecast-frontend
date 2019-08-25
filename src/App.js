import React from 'react';
import HttpService from './services/http-service';
import RatesResult from './components/RatesResult/RatesResult';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { TextField } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import './App.css';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isReady: false,
			loadingForecast: false,
			currencies: [],
			periodInWeeks: 3,
			currencyRates: [],
			baseCurrency: 'AUD',
			targetCurrency: 'BGN'
		};

		this.rateResultRef = React.createRef();
	}

	changeCurrency = (type) => {
		return (event) => {
			this.setState({ [type]: event.target.value });
		};
	};

	changePeriodInWeeks = (event) => {
		this.setState({
			periodInWeeks: event.target.value
		});
	};

	calculateForecast = (event) => {
		event.preventDefault();

		this.setState({
			loadingForecast: true
		});

		HttpService.calculateForecastRates(this.state.baseCurrency, this.state.targetCurrency, this.state.periodInWeeks, false)
			.then(
				currencyRates => {
					this.setState({
						currencyRates: currencyRates,
						loadingForecast: false
					});

					if (this.rateResultRef.current) {
						this.rateResultRef.current.updateRates(currencyRates);
					}
				}
			)
			.catch(err => {
				alert('Some error happen');
				this.setState({
					loadingForecast: false
				});
			});
	};

	componentDidMount() {
		this.init();
	}

	init = () => {
		HttpService.fetchCurrencies()
			.then(
				(currencies) => {
					this.setState(
						{
							isReady: true,
							currencies: currencies
						}
					);
				}
			)
			.catch(err => {
				alert('Some error happen');
				this.setState({
					isReady: false
				});
			});
	};

	render() {
		const { isReady, loadingForecast, currencies, periodInWeeks, currencyRates, baseCurrency, targetCurrency } = this.state;

		if (!isReady) {
			return (
				<div>Loading...</div>
			);
		} else {
			return (
				<Container>
					<Grid container spacing={2}>
						<Grid item xs={5}>
							<FormControl className="full-width" variant="outlined" margin="normal">
								<InputLabel htmlFor="baseCurrency">Base currency</InputLabel>
								<Select
									onChange={this.changeCurrency('baseCurrency')}
									value={baseCurrency}
									input={<OutlinedInput labelWidth={100} name="baseCurrency" id="baseCurrency"/>}
								>
									<MenuItem value="">None</MenuItem>
									{currencies.map(currency => (
										<MenuItem key={currency.key}
										          value={currency.key}>{currency.name} ({currency.key})</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>

						<Grid item xs={5}>
							<FormControl className="full-width" variant="outlined" margin="normal">
								<InputLabel htmlFor="targetCurrency">Target currency</InputLabel>
								<Select
									onChange={this.changeCurrency('targetCurrency')}
									value={targetCurrency}
									input={<OutlinedInput labelWidth={100} name="targetCurrency" id="targetCurrency"/>}
								>
									<MenuItem value="">None</MenuItem>
									{currencies.map(currency => (
										<MenuItem key={currency.key}
										          value={currency.key}>{currency.name} ({currency.key})</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>

						<Grid item xs={2}>
							<TextField className="full-width"
							           variant="outlined"
							           label="Week interval"
							           helperText="Min - 1, Max - 250"
							           type="number"
							           margin="normal"
							           min="1"
							           value={periodInWeeks}
							           onChange={this.changePeriodInWeeks}/>
						</Grid>
					</Grid>

					<Grid
						container
						direction="column"
						justify="center"
						alignItems="flex-end"
					>
						<Button variant="contained"
						        color="primary"
						        disabled={loadingForecast}
						        onClick={this.calculateForecast}>
							Calculate Forecast
						</Button>
					</Grid>

					{loadingForecast ?
						<Grid container
						      direction="column"
						      justify="center"
						      alignItems="center"><CircularProgress size={100}/></Grid> :
						<RatesResult hidden={loadingForecast} ref={this.rateResultRef} rates={currencyRates}/>
					}
				</Container>
			);
		}
	}
}

export default App;
