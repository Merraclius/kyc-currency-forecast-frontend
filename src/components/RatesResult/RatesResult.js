import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import './RatesResult.css';

class RatesResult extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			currencyRates: props.rates,
			optimalFactor: 0
		};
	}

	updateRates = (rates) => {
		this.setState({
			currencyRates: rates,
			optimalFactor: this.extractOptimalFactor(rates)
		});
	};

	extractOptimalFactor = (rates) => {
		return rates.map(rate => rate.factor)
			.reduce((lowestFactor, factor) => factor < lowestFactor ? factor : lowestFactor);
	};

	render() {
		const { currencyRates, optimalFactor } = this.state;

		if (!currencyRates.length) {
			return null;
		}

		return (
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Start Date</TableCell>
						<TableCell>End Date</TableCell>
						<TableCell>Rate</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{currencyRates.map(rate => {
						return ([
							<TableRow className={rate.factor === optimalFactor ? 'optimal-rate' : ''}
							          key={rate.startDate}>
								<TableCell>{rate.startDate}</TableCell>
								<TableCell>{rate.endDate}</TableCell>
								<TableCell>{rate.factor}</TableCell>
							</TableRow>
						]);
					})}
				</TableBody>
			</Table>
		);
	}
}

export default RatesResult;
