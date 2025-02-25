import { assert } from 'console';
import _isoList from './iso2CountryCodes.json' assert { type: 'json' };
import { writeFile } from 'fs';

interface ISOList {
	[key: string]: string;
}

function isoToModalOptions(): any {
	const isoList = _isoList as ISOList;
	const options = Object.entries(isoList).map(([key, value]) => {
		return {
			text: {
				type: 'plain_text',
				text: value,
			},
			value: key,
		};
	});

	return options;
}

// write to file
const options = isoToModalOptions();

writeFile('src/utils/isoModalOptions.json', JSON.stringify(options, null, 2), (err) => {
	if (err) {
		console.error('Error writing to isoToModalOptions.json:', err);
	} else {
		console.log('ISO options successfully written to isoToModalOptions.json');
	}
});