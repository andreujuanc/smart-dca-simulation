import { writeFile } from 'fs';
import { fetch } from 'undici';


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

async function savePrices() {
    const from = '2021-07-01';
    const to = '2022-07-01';
    const token = '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599';

    const url = `https://api.covalenthq.com/v1/pricing/historical_by_addresses_v2/1/USD/${token}/?quote-currency=USD&format=JSON&from=${from}&to=${to}&prices-at-asc=true&key=ckey_0f1f054c0b774a74accad72f551`;
    const response = await fetch(url);
    const result = (await response.json()) as any;
    const prices = result.data[0]?.prices.map((x: any) => ({
        price: x.price,
        date: x.date
    }));
    // save data in a file
    const data = JSON.stringify(prices);
    const file = __dirname + '/../data/prices.json';
    await writeFileAsync(file, data);

    console.log(prices.length);
}
