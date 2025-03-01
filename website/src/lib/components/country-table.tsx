import type { Countries } from 'country-to-currency';
import useSWR from 'swr';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init);
  return res.json();
}

export default function CountryTable(props: Props) {

}

interface Props {
	countryCode: Countries;
}