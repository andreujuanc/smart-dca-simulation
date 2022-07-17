import { prices } from '../data'

async function main() {
    for (const pair of prices) {
        runSimOnPair(pair)
    }
}

//main()

type Price = { price: number; date: string }

type SimParams = {
    slopeLengthDAYS: number,
    slopeIntensity: number,
    initialFundsUSD: number,
    dailyExecutionUSD: number,
    prices: Price[]
    to?: string
    from?: string
}

function runSimOnPair(pair: { name: string; data: Price[] }) {
    for (let slopeLengthDAYS = 1; slopeLengthDAYS < 30; slopeLengthDAYS++) {
        const initialFundsUSD = 0
        const dailyFundsUSD = 10

        const result = averagePriceSlope({ prices: pair.data, slopeLengthDAYS, initialFundsUSD, dailyExecutionUSD: dailyFundsUSD, slopeIntensity: 1 })
        //console.log(`${pair.name} ${slopeLengthDAYS} ${result.tokenAmount} ${result.tokenInClassicDCA} ${result.portfolioValueUSD} ${result.ifHoldUSDInstead}`)
        //console.log(result.data)
    }
}

function clamp(num: number, min: number, max: number) { return Math.min(Math.max(num, min), max) }

export function averagePriceSlope({ prices, to, from, slopeLengthDAYS, initialFundsUSD, dailyExecutionUSD, slopeIntensity }: SimParams) {

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
    rangePrices = prices.filter((_, i) => i <= startDateIndex && i > startDateIndex - slopeLengthDAYS).concat(rangePrices)

    for (let i = slopeLengthDAYS; i < prices.length; i++) {
        const price = rangePrices[i]
        if (!price) continue;

        const pastAVG = rangePrices.slice(i - slopeLengthDAYS, i).reduce((acc, cur) => acc + cur.price, 0) / slopeLengthDAYS
        const slope = Math.pow(pastAVG / price.price, slopeIntensity)
        ifHoldUSDInstead += dailyExecutionUSD

        let targetInUSD = dailyExecutionUSD / slope
        const diffToTarget = dailyExecutionUSD - targetInUSD

        const operation = clamp(diffToTarget, -usdAtHand, dailyExecutionUSD)
        const tobuyInUSD = dailyExecutionUSD - operation
        usdAtHand += operation

        console.log(slope, 'targetInUSD', targetInUSD, 'tobuyInUSD', tobuyInUSD, 'usdAtHand', usdAtHand, 'operation', diffToTarget)

        tokenAmountSMART += tobuyInUSD / price.price
        tokenAmountCLASSIC += dailyExecutionUSD / price.price

        portfolioValueUSDSMART = (tokenAmountSMART * price.price) + usdAtHand
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
