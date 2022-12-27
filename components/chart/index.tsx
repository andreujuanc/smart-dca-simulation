import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: 'index' as const,
        intersect: false,
    },
    color: '#CCC',

    //stacked: false,
    plugins: {

    },

    scales: {
        y: {
            type: 'linear' as const,
            display: true,
            position: 'left' as const,
            title: {
                display: true,
                text: 'Price'
            },
        },
        y1: {
            type: 'linear' as const,
            display: true,
            position: 'right' as const,
            title: {
                display: true,
                text: 'Value USD'
            }
        },
        y2: {
            type: 'linear' as const,
            display: true,
            position: 'left' as const,
            grid: {
                drawOnChartArea: false,
            },
            title: {
                display: true,
                text: 'Token Amount'
            }
        },
        // y3: {
        //     type: 'linear' as const,
        //     display: true,
        //     position: 'left' as const,
        //     grid: {
        //         drawOnChartArea: false,
        //     },
        //     title: {
        //         display: true,
        //         text: 'Slope'
        //     },
        //     min: 0,
        //     max: 2,
        // },
    },

};



type StrategyChartData = {
    portfolioValueUSD: number
    totalTokenAmount: number
    usdAmount: number
    entryPrice: number
}[]

export function Chart(params:
    {
        tokenPrice: { date: string, price: number }[],
        classic: StrategyChartData
        smart: StrategyChartData
        entry: StrategyChartData
        dc: StrategyChartData
        // classicDCAValue: number[],
        // classicDCAHolding: number[],
        // smartDCAValue: number[],
        // smartUSDAtHand: number[],
        // usdSavingsAccountValue: number[],
        // smartDCAHolding: number[],
        // slope: number[],
        // averagePrice: number[]
    }) {
    const labels = params.tokenPrice.map(x => x.date)


    const data: ChartData<'line', number[], string> = {
        labels,
        datasets: [
            {
                label: 'Token Price',
                data: params.tokenPrice.map(x => x.price),
                pointRadius: 0,
                borderColor: 'rgba(50, 220, 50)',
                backgroundColor: 'rgba(50, 220, 50)',
                yAxisID: 'y',
                hidden: false
            },
            // {
            //     label: 'Slope',
            //     data: slope,
            //     pointRadius: 0,
            //     borderColor: 'rgba(150, 150, 30, 0.15)',
            //     yAxisID: 'y3',
            //     borderColor: 'rgb(0,0,0)',
            // },
            // {
            //     label: 'Price AVG',
            //     data: averagePrice,
            //     pointRadius: 0,
            //     borderColor: 'rgba(225, 165, 0, 1)',
            //     backgroundColor: 'rgba(225, 165, 0, 1)',
            //     yAxisID: 'y',
            //     hidden: true
            // },


            // {
            //     label: 'Classic DCA Portfolio Value',
            //     data: params.classic.map(x => x.portfolioValueUSD),
            //     pointRadius: 0,
            //     borderColor: 'hsl(4deg 95% 60%)',
            //     backgroundColor: 'hsl(4deg 95% 60%)',
            //     yAxisID: 'y1',
            //     hidden: false
            // },
            // {
            //     label: 'Classic DCA Tokens',
            //     data: params.classic.map(x => x.totalTokenAmount),
            //     pointRadius: 0,
            //     borderColor: 'hsl(4deg 90% 70%)',
            //     backgroundColor: 'hsl(4deg 90% 70%)',
            //     yAxisID: 'y2',
            //     hidden: false

            // },
            {
                label: 'Classic DCA Entry Price',
                data: params.classic.map(x => x.entryPrice),
                pointRadius: 0,
                borderColor: 'hsl(4deg 90% 80%)',
                backgroundColor: 'hsl(4deg 90% 80%)',
                yAxisID: 'y',
                hidden: false

            },




            // {
            //     label: 'Smart DCA Portfolio Value',
            //     data: params.smart.map(x => x.portfolioValueUSD),
            //     pointRadius: 0,
            //     borderColor: 'hsl(220deg 95% 40%)',
            //     backgroundColor: 'hsl(220deg 95% 40%)',
            //     yAxisID: 'y1',
            //     hidden: false
            // },
            // {
            //     label: 'Smart DCA Tokens',
            //     data: params.smart.map(x => x.totalTokenAmount),
            //     pointRadius: 0,
            //     borderColor: 'hsl(220deg 95% 55%)',
            //     backgroundColor: 'hsl(220deg 95% 55%)',
            //     yAxisID: 'y2',
            //     hidden: true
            // },
            // {
            //     label: 'Smart DCA USD Value',
            //     data: params.smart.map(x => x.usdAmount),
            //     pointRadius: 0,
            //     borderColor: 'hsl(220deg 95% 70%)',
            //     backgroundColor: 'hsl(220deg 95% 70%)',
            //     yAxisID: 'y1',
            //     hidden: true
            // },
            // {
            //     label: 'Smart DCA Entry Price',
            //     data: params.smart.map(x => x.entryPrice),
            //     pointRadius: 0,
            //     borderColor: 'hsl(220deg 95% 80%)',
            //     backgroundColor: 'hsl(220deg 95% 80%)',
            //     yAxisID: 'y',
            //     hidden: true
            // },


            // {
            //     label: 'EntryPrice DCA Portfolio Value',
            //     data: params.entry.map(x => x.portfolioValueUSD),
            //     pointRadius: 0,
            //     borderColor: 'hsl(45deg 90% 50%)',
            //     backgroundColor: 'hsl(45deg 90% 50%)',
            //     yAxisID: 'y1',
            //     hidden: false
            // },
            // {
            //     label: 'EntryPrice DCA Tokens',
            //     data: params.dc.map(x => x.totalTokenAmount),
            //     pointRadius: 0,
            //     borderColor: 'hsl(45deg 90% 70%)',
            //     backgroundColor: 'hsl(45deg 90% 70%)',
            //     yAxisID: 'y2',
            //     hidden: false
            // },
            {
                label: 'EntryPrice DCA Entry Price',
                data: params.entry.map(x => x.entryPrice),
                pointRadius: 0,
                borderColor: 'hsl(45deg 95% 80%)',
                backgroundColor: 'hsl(45deg 95% 80%)',
                yAxisID: 'y',
                hidden: false
            },


            // {
            //     label: 'DCInvestor DCA Tokens',
            //     data: params.entry.map(x => x.totalTokenAmount),
            //     pointRadius: 0,
            //     borderColor: 'hsl(45deg 90% 70%)',
            //     backgroundColor: 'hsl(45deg 90% 70%)',
            //     yAxisID: 'y2',
            //     hidden: false
            // },
            {
                label: 'DCInvestor DCA Entry Price',
                data: params.dc.map(x => x.entryPrice),
                pointRadius: 0,
                borderColor: 'hsl(170deg 95% 80%)',
                backgroundColor: 'hsl(170deg 95% 80%)',
                yAxisID: 'y',
                hidden: false
            },


            // {
            //     label: 'USD Savings Account',
            //     data: usdSavingsAccountValue,
            //     pointRadius: 0,
            //     borderColor: 'rgb(190, 30, 250)',
            //     backgroundColor: 'rgb(190, 30, 250)',
            //     yAxisID: 'y1',
            //     hidden: true
            // },

            // {
            //     label: 'Smart DCA Holding',
            //     data: smartDCAHolding,
            //     pointRadius: 0,
            //     borderColor: 'rgba(100, 120, 255)',
            //     backgroundColor: 'rgba(100, 120, 255)',
            //     yAxisID: 'y2',
            //     hidden: false
            // },
        ],
    };

    return <Line options={options} data={data} style={{
        // boxSizing: 'content-box',
    }} />;
}
