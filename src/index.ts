import { prices } from '../data'

async function main() {
    for (const pair of prices) {
        runSimOnPair(pair)
    }
}

main()

type Price = { price: number; date: string }

type SimParams = {
    slopeLengthDAYS: number,
    initialFundsUSD: number,
    dailyFundsUSD: number,
    prices: Price[]
    to?: string
    from?: string
}

function runSimOnPair(pair: { name: string; data: Price[] }) {
    for (let slopeLengthDAYS = 1; slopeLengthDAYS < 30; slopeLengthDAYS++) {
        const initialFundsUSD = 0
        const dailyFundsUSD = 10

        const result = averagePriceSlope({ prices: pair.data, slopeLengthDAYS, initialFundsUSD, dailyFundsUSD })
        console.log(`${pair.name} ${slopeLengthDAYS} ${result.tokenAmount} ${result.tokenInClassicDCA} ${result.portfolioValueUSD} ${result.ifHoldUSDInstead}`)
    }
}

export function averagePriceSlope({ prices, to, from, slopeLengthDAYS, initialFundsUSD, dailyFundsUSD }: SimParams) {

    const records: {
        i: number
        date: string,
        price: number,
        pastAVG: number,
        slope: number,
        tobuy: number,
        usdAtHand: number,
        tokenAmountSMART: number,
        tokenAmountCLASSIC: number,
        portfolioValueUSDSMART: number,
        portfolioValueUSDCLASSIC: number,
        ifHoldUSDInstead: number

    }[] = []
    let ifHoldUSDInstead: number = 0
    let tokenAmountSMART = 0
    let tokenAmountCLASSIC = 0
    let usdAtHand = initialFundsUSD
    let portfolioValueUSDSMART = usdAtHand
    let portfolioValueUSDCLASSIC = usdAtHand

    let rangePrices = prices.filter(x => (!from || x.date >= from) && (!to || x.date <= to))
    const startDateIndex = prices.findIndex(x => x.date === rangePrices[0].date)
    rangePrices = prices.filter((_, i) => i <= startDateIndex && i > startDateIndex - slopeLengthDAYS ).concat(rangePrices)

    for (let i = slopeLengthDAYS; i < prices.length; i++) {
        const price = rangePrices[i]
        if (!price) continue;

        const pastAVG = rangePrices.slice(i - slopeLengthDAYS, i).reduce((acc, cur) => acc + cur.price, 0) / slopeLengthDAYS
        const slope = Math.pow(price.price / pastAVG, 10)
        ifHoldUSDInstead += dailyFundsUSD

        const tobuyInUSD = dailyFundsUSD / slope

        if (tobuyInUSD > dailyFundsUSD && usdAtHand > 0)
            usdAtHand -= (tobuyInUSD - dailyFundsUSD)
        else if (tobuyInUSD < dailyFundsUSD)
            usdAtHand += (dailyFundsUSD - tobuyInUSD)

        tokenAmountSMART += tobuyInUSD / price.price
        tokenAmountCLASSIC += dailyFundsUSD / price.price

        portfolioValueUSDSMART = usdAtHand + (tokenAmountSMART * price.price)
        portfolioValueUSDCLASSIC = tokenAmountCLASSIC * price.price

        records.push({ i, date: price.date, price: price.price, pastAVG, slope, tobuy: tobuyInUSD, usdAtHand, tokenAmountSMART: tokenAmountSMART, tokenAmountCLASSIC, portfolioValueUSDSMART, portfolioValueUSDCLASSIC, ifHoldUSDInstead })
    }
    return {
        data: records,
        tokenAmount: records[records.length - 1]?.tokenAmountSMART,
        tokenInClassicDCA: records[records.length - 1]?.tokenAmountCLASSIC,
        portfolioValueUSD: records[records.length - 1]?.portfolioValueUSDSMART,
        ifHoldUSDInstead: records[records.length - 1]?.ifHoldUSDInstead,
    }
}
