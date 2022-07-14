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
}

function runSimOnPair(pair: { name: string; data: Price[] }) {
    for (let slopeLengthDAYS = 1; slopeLengthDAYS < 30; slopeLengthDAYS++) {
        const initialFundsUSD = 0
        const dailyFundsUSD = 10
    
        const result = averagePriceSlope({ prices: pair.data, slopeLengthDAYS, initialFundsUSD, dailyFundsUSD })
        console.log(`${pair.name} ${slopeLengthDAYS} ${result.tokenAmount} ${result.tokenInClassicDCA} ${result.portfolioValueUSD} ${result.ifHoldUSDInstead}`)
    }
}

function averagePriceSlope({ prices, slopeLengthDAYS, initialFundsUSD, dailyFundsUSD }: SimParams) {

    const records: any[] = []
    let ifHoldUSDInstead: number = 0
    let tokenAmount = 0
    let tokensInClassicDCA = 0
    let usdAtHand = initialFundsUSD
    let portfolioValueUSD = usdAtHand

    for (let i = slopeLengthDAYS; i < prices.length; i++) {
        const price = prices[i]
        const pastAVG = prices.slice(i - slopeLengthDAYS, i).reduce((acc, cur) => acc + cur.price, 0) / slopeLengthDAYS
        const slope = Math.pow(price.price / pastAVG, 10)
        ifHoldUSDInstead += dailyFundsUSD

        const tobuyInUSD = dailyFundsUSD / slope

        if (tobuyInUSD > dailyFundsUSD && usdAtHand > 0)
            usdAtHand -= (tobuyInUSD - dailyFundsUSD)
        else if (tobuyInUSD < dailyFundsUSD)
            usdAtHand += (dailyFundsUSD - tobuyInUSD)

        tokenAmount += tobuyInUSD / price.price
        tokensInClassicDCA += dailyFundsUSD / price.price

        portfolioValueUSD = usdAtHand + (tokenAmount * price.price)
        if (i % 28 == 0 || i == slopeLengthDAYS)
            records.push({ i, price: price.price, pastAVG, slope, tobuy: tobuyInUSD, usdAtHand, tokenAmount, tokenInClassicDCA: tokensInClassicDCA, portfolioValueUSD, ifHoldUSDInstead })
    }
    return {
        tokenAmount: records[records.length - 1].tokenAmount,
        tokenInClassicDCA: records[records.length - 1].tokenInClassicDCA,
        portfolioValueUSD: records[records.length - 1].portfolioValueUSD,
        ifHoldUSDInstead: records[records.length - 1].ifHoldUSDInstead,
    }
}
