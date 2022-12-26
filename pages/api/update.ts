import { writeFile } from 'fs';
import { fetch } from 'undici';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    await savePrices('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', 'eth-usd')
    await savePrices('0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', 'btc-usd')
    res.status(200).json({ name: 'Price updated' })
}


async function writeFileAsync(file: string, data: string) {
    return new Promise<void>((resolve, reject) => {
        writeFile(file, data, (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

async function savePrices(address: string, name: string) {
    const from = '2020-01-01';
    const to = new Date().toISOString().split('T')[0];
    const token = address;

    const url = `https://api.covalenthq.com/v1/pricing/historical_by_addresses_v2/1/USD/${token}/?quote-currency=USD&format=JSON&from=${from}&to=${to}&prices-at-asc=true&key=${process.env.COVALENT_API_KEY}`;
    const response = await fetch(url);
    const result = (await response.json()) as any;
    
    const prices = result.data[0]?.prices.map((x: any) => ({
        price: x.price,
        date: x.date
    }));
    // save data in a file
    const data = JSON.stringify(prices);
    const file = __dirname + `/../../../../data/${name}.json`;
    await writeFileAsync(file, data);

    console.log('UPDATED', name, prices.length);
}
