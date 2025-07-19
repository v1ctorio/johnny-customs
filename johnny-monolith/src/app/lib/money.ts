import { countries } from "./constants";

export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CNY' | 'JPY' | 'AUD' | 'CHF' | 'NZD' | 'RUB' | 'INR' | 'ZAR' | 'KRW' | 'BRL' | 'MXN' | 'SGD' | 'HKD' | 'SEK' | 'NOK' | 'DKK' | 'PLN' | 'TRY';
export type CountryCode = keyof typeof countries

const USDRate = {
	rate:1,
	code: 'USD',
	name: 'United States Dollar',
	inverseRate: 1,
}
interface FloatRates {
	[key: string]: { // key is lowercase currency code
		rate: number;
		aplhaCode: string;
		code: string; 
		numericCode: string;
		name: string;
		inverseRate: number;
		date: string;
	};
}

export async function pullUSDJson(): Promise<FloatRates> {
	'use server';
	const res = await fetch('https://www.floatrates.com/daily/usd.json', {
		cache: 'force-cache',
		next: { revalidate: 60 * 60 * 24 }, // revalidate every 24 hours
	});
	
	if (!res.ok) {
		throw new Error('Failed to fetch USD JSON');
	}
	
	return res.json();
}

export async function exchangeCurrency(originCurrency: Currency, targetCurrency: Currency, amount: number) {
	if (originCurrency === targetCurrency) {
		return amount;
	}

	const rates = (await pullUSDJson())

	const fromRate = rates[originCurrency.toLowerCase()] || USDRate;
	const toRate = rates[targetCurrency.toLowerCase()] || USDRate;


	let originInUSD = amount * fromRate.inverseRate

	if (originCurrency === 'USD') {
		originInUSD = amount;
	}


	if (!originInUSD) {
		throw new Error(`Unsupported invalid conversion from ${originCurrency} to ${targetCurrency}`);
	}

	return originInUSD * toRate.rate;
}

