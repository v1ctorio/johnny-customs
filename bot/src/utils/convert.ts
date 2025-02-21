export async function convertCurrency(
    from: string,
    to: string,
    amount: number
): Promise<number> {
    const api = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from.toLowerCase()}.json`;
    try {
        const res = await fetch(api);
        const data = await res.json();
        const rate = Number(data[from.toLowerCase()][to.toLowerCase()]);

        if (Number.isNaN(rate)) {
            throw new Error('Invalid conversion rate received');
        }

        return rate * amount;
    } catch (error) {
        console.error('Error fetching currency conversion rate:', error);
        throw error;
    }
}
