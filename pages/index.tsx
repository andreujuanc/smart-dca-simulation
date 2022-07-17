import type { NextPage } from 'next'
import Head from 'next/head'
import { Chart } from '../components/chart'
import styles from '../styles/Home.module.css'
import { prices } from '../data'
import { useMemo, useState } from 'react'
import { averagePriceSlope } from '../src'

const Home: NextPage = () => {
  const [pair, setPair] = useState(prices[0].id)
  const [slope, setSlope] = useState(10)
  const [freq, setFreq] = useState(1)
  const [executeAmount, setExecuteAmount] = useState(10)
  const [from, setFrom] = useState<string>('2022-01-01')
  const [to, setTo] = useState<string>('2022-02-01')
  const tokenPrice = useMemo(() => (prices.find(x => x.id == pair)?.data) ?? [], [pair])

  const simResults = averagePriceSlope({
    prices: tokenPrice,
    to, from,
    dailyFundsUSD: executeAmount,
    initialFundsUSD: 0,
    slopeLengthDAYS: slope
  })


  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h3 className={styles.title}>
          Smart DCA Simulation
        </h3>
        <div className={styles.card}>
          <div className={styles.formGroup}>
            <label htmlFor='pair'>Pair</label>
            <select name="pair" onChange={(e) => setPair(e.target.value)} value={pair} >
              {prices.map(({ id, name }) => (
                <option key={id} value={id} >{name}</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor='slope'>Slope</label>
            <input name={"slope"} value={slope} onChange={(e) => setSlope(parseInt(e.target.value))} type={"number"} />
          </div>
          {/* FREQ NOT YET IMPLEMENTED <div className={styles.formGroup}>
            <label htmlFor='freq'>Freq</label>
            <input name={"freq"} value={freq} onChange={(e) => setFreq(parseInt(e.target.value))} type={"number"} />
          </div> */}
          <div className={styles.formGroup}>
            <label htmlFor='executeAmount'>Execute Amount in USD</label>
            <input name={"executeAmount"} value={executeAmount} onChange={(e) => setExecuteAmount(parseInt(e.target.value))} type={"number"} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor='from'>Range</label>
            <input name={"from"} value={from} onChange={(e) => setFrom(e.target.value)} type={"date"} />
            <input name={"to"} value={to} onChange={(e) => setTo(e.target.value)} type={"date"} />
          </div>
        </div>

        <Chart
          tokenPrice={simResults.data.map(x => ({ date: x.date, price: x.price }))}
          classicDCAValue={simResults.data.map(x => x.portfolioValueUSDCLASSIC)}
          smartDCAValue={simResults.data.map(x => x.portfolioValueUSDSMART)}
          usdSavingsAccountValue={simResults.data.map(x => x.ifHoldUSDInstead)}
          classicDCAHolding={simResults.data.map(x => x.tokenAmountCLASSIC)}
          smartDCAHolding={simResults.data.map(x => x.tokenAmountSMART)}
        />
      </main>

    </div>
  )
}

export default Home
