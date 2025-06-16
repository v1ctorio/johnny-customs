export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD';
export type CountryCode = 'ES' | 'CA' | 'UK' | 'US';


export async function pullUSDJson() {
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

	const rates = await pullUSDJson();

	const fromRate = rates[originCurrency];
	const toRate = rates[targetCurrency];

	if (!fromRate || !toRate) {
		throw new Error(`Unsupported invalid conversion from ${originCurrency} to ${targetCurrency}`);
	}

	return (amount / fromRate) * toRate;
}

export function countryToCurrency(country: CountryCode): Currency | null {
	const countryMap: Record<CountryCode, Currency> = {
		'US': 'USD',
		'CA': 'CAD',
		'GB': 'GBP',
		'EU': 'EUR',
	};

	return countryMap[country.toUpperCase()] || null;
}