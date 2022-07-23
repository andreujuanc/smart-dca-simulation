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
    executeUSD: number,
    bias: number
    prices: Price[]
    to?: string
    from?: string
}

function runSimOnPair(pair: { name: string; data: Price[] }) {
    for (let slopeLengthDAYS = 1; slopeLengthDAYS < 30; slopeLengthDAYS++) {
        const initialFundsUSD = 0
        const dailyFundsUSD = 10

        const result = averagePriceSlope({ prices: pair.data, slopeLengthDAYS, initialFundsUSD, executeUSD: dailyFundsUSD, slopeIntensity: 1, bias: 1 })
        //console.log(`${pair.name} ${slopeLengthDAYS} ${result.tokenAmount} ${result.tokenInClassicDCA} ${result.portfolioValueUSD} ${result.ifHoldUSDInstead}`)
        //console.log(result.data)
    }
}

function clamp(num: number, min: number, max: number) { return Math.min(Math.max(num, min), max) }

type StrategyItem = {
    toBuyInUSD: number
    price: number
    tokens: number
    entryPrice: number
    totalTokenAmount: number
    usdAmount: number
    portfolioValueUSD: number
}

type StrategyCalculation = {
    toBuyInUSD: number
    usdAmount: number
}

export function averagePriceSlope(params: SimParams) {
    const { prices, to, from, slopeLengthDAYS, initialFundsUSD, executeUSD } = params
    const records: {
        i: number
        date: string,
        price: number,
        priceAVG: number,
        ifHoldUSDInstead: number
        classic: StrategyItem
        smart: StrategyItem
        entry: StrategyItem


    }[] = []

    let ifHoldUSDInstead: number = 0
    let smartResult: StrategyItem = { price: 0, tokens: 0, toBuyInUSD: 0, entryPrice: 0, portfolioValueUSD: 0, totalTokenAmount: 0, usdAmount: initialFundsUSD }
    let classicResult: StrategyItem = { price: 0, tokens: 0, toBuyInUSD: 0, entryPrice: 0, portfolioValueUSD: 0, totalTokenAmount: 0, usdAmount: initialFundsUSD }
    let entryResult: StrategyItem = { price: 0, tokens: 0, toBuyInUSD: 0, entryPrice: 0, portfolioValueUSD: 0, totalTokenAmount: 0, usdAmount: initialFundsUSD }
    // let usdAtHand = initialFundsUSD
    // let tokenAmountSMART = 0
    // let tokenAmountCLASSIC = 0
    // let portfolioValueUSDSMART = usdAtHand
    // let portfolioValueUSDCLASSIC = usdAtHand

    let rangePrices = prices.filter(x => (!from || x.date >= from) && (!to || x.date <= to))
    const startDate = rangePrices[0]?.date
    const endDate = rangePrices[rangePrices.length - 1]?.date
    const startDateIndex = prices.findIndex(x => x.date === startDate)
    const endDateIndex = prices.findIndex(x => x.date === endDate)
    console.clear()

    for (let i = startDateIndex; i <= endDateIndex; i++) {
        const price = prices[i]
        if (!price) continue;

        ifHoldUSDInstead += executeUSD

        const prevAVG = getAVG(prices, i - slopeLengthDAYS, slopeLengthDAYS);
        const priceAVG = getAVG(prices, i, slopeLengthDAYS);

        classicResult = getResult(calculateClassic(executeUSD, params), classicResult, price.price)
        smartResult = getResult(calculateSmart(prevAVG, priceAVG, params, smartResult), smartResult, price.price)
        entryResult = getResult(calculateEntryPrice(price.price, params, entryResult), entryResult, price.price)


        records.push({
            i, ...price, priceAVG, ifHoldUSDInstead,

            classic: classicResult,
            smart: smartResult,
            entry: entryResult,
        })

    }
    return {
        data: records,
        // tokenAmount: records[records.length - 1]?.tokenAmountSMART,
        // tokenInClassicDCA: records[records.length - 1]?.tokenAmountCLASSIC,
        // portfolioValueUSD: records[records.length - 1]?.portfolioValueUSDSMART,
        // portfolioValueClassicUSD: records[records.length - 1]?.portfolioValueUSDCLASSIC,
        // ifHoldUSDInstead: records[records.length - 1]?.ifHoldUSDInstead,
    }
}

function getResult(calc: StrategyCalculation, prev: StrategyItem, price: number): StrategyItem {
    const tokensToBuy = calc.toBuyInUSD / price
    const totalTokens = prev.totalTokenAmount + tokensToBuy
    //(prev.portfolioValueUSD + calc.toBuyInUSD) 
    const entry = ((prev.entryPrice * prev.totalTokenAmount) + calc.toBuyInUSD) / totalTokens
    console.log(prev.portfolioValueUSD, calc.toBuyInUSD, totalTokens, price, entry)

    return {
        price: price,
        tokens: tokensToBuy,
        toBuyInUSD: calc.toBuyInUSD,
        entryPrice: entry,
        portfolioValueUSD: (totalTokens * price) + calc.usdAmount,
        totalTokenAmount: totalTokens,
        usdAmount: calc.usdAmount
    }
}

function calculateClassic(executeUSD: number, params: SimParams): StrategyCalculation {
    return {
        toBuyInUSD: executeUSD,
        usdAmount: params.initialFundsUSD
    }
}

function calculateEntryPrice(price: number, params: SimParams, prev: StrategyItem): StrategyCalculation {
    const { slopeIntensity, bias, executeUSD } = params

    const direction = prev.entryPrice == 0 ? 1 : price / prev.entryPrice;

    const slope = slopeIntensity == 0 ? direction
        : direction > 1 && bias > 0 ? Math.pow(direction, slopeIntensity * (1 + bias))
            : direction < 1 && bias < 0 ? Math.pow(direction, slopeIntensity * (1 + Math.abs(bias)))
                : Math.pow(direction, slopeIntensity);

    let targetInUSD = executeUSD / slope;
    const diffToTarget = executeUSD - targetInUSD;

    const operation = clamp(diffToTarget, -prev.usdAmount, executeUSD);
    const tobuyInUSD = executeUSD - operation;
    const usdAtHand = prev.usdAmount + operation;

    return {
        toBuyInUSD: tobuyInUSD,
        usdAmount: usdAtHand
    }
}


function calculateSmart(prevAVG: number, priceAVG: number, params: SimParams, prev: StrategyItem): StrategyCalculation {
    const { executeUSD, slopeIntensity, bias } = params

    const direction = priceAVG / prevAVG;
    const slope = slopeIntensity == 0 ? direction
        : direction > 1 && bias > 0 ? Math.pow(direction, slopeIntensity * (1 + bias))
            : direction < 1 && bias < 0 ? Math.pow(direction, slopeIntensity * (1 + Math.abs(bias)))
                : Math.pow(direction, slopeIntensity);

    let targetInUSD = executeUSD / slope;
    const diffToTarget = executeUSD - targetInUSD;

    const operation = clamp(diffToTarget, -prev.usdAmount, executeUSD);
    const tobuyInUSD = executeUSD - operation;
    const usdAtHand = prev.usdAmount + operation;

    return {
        toBuyInUSD: tobuyInUSD,
        usdAmount: usdAtHand
    }
}

function getAVG(prices: Price[], i: number, slopeLengthDAYS: number) {
    return prices.slice(i - slopeLengthDAYS, i).reduce((acc, cur) => acc + cur.price, 0) / slopeLengthDAYS;
}


